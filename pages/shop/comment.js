// pages/moments/add.js
const app = getApp()
import {
  getUploadToken,
  shopCommentAdd,
  getShopServiceCate
} from '../../api/api'
import {md5} from '../../utils/md5'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadImg: [],
    show: false,
    content : '',
    keys:[],
    form:{
      rate:0,
      content:'',
      img:'',
      cate_id : 0,
      cate_title :''
    },
    rateTexts:['','非常差','差','一般','不错','非常棒'],
    rateText:'',
    cateList : [],
    cateData : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.chengeNeed()
    const {
      navBarHeight,
      navBarExtendHeight,
      windowHeight,
      windowWidth
    } = app.globalSystemInfo;
    const rpxR =750 / windowWidth;
    let scrollHeight = windowHeight * rpxR - navBarExtendHeight * rpxR - navBarHeight * rpxR - 20;
    //显示朋友圈图片的可用总宽度
    let imageWidth = 750 - 60 - 92;
    //九宫格图片宽高
    let imgHeight = imageWidth / 3;


    this.setData({
      scrollHeight,
      imgHeight,
      shop:options
    });

    getUploadToken().then(res => {
      this.setData({
        token: res.data.token,
        uploadUrl: res.data.uploadUrl,
      })
    })

    this.getCates()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 读取任务分类
  getCates(){
    getShopServiceCate().then(res => {
      console.log(res);
      let cates = [];
      let listId = [];
      res.data.list.forEach((item)=>{
        listId.push(item.id)
        cates.push(item.title)
      })
      this.setData({
        cateList : cates, // 用做选择的数组
        cateData : res.data.list, // 用做选中的选项内容的数组
        cateDataId : listId // 数组下标与分类id匹配的数组 
      })
    })
  },
  /**
   * 选择照片
   */
  takePhoto() {
    
    let {uploadImg} = this.data
    if (this.data.uploadImg.length >= 9) {
      wx.showToast({
        title: '最多选9张图片',
        icon: 'none'
      })
      return
    }
    wx.chooseImage({
      count: 9 - uploadImg.length,
      // sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        let uploadList = this.data.uploadImg
        

        tempFilePaths.forEach((item,index) => {
          uploadList.push(item)
          this.upload({item,index})
        })

        this.setData({
          uploadImg: uploadList
        })
      }
    })
  },


  /**
   * 上传照片或者视频
   */
  upload : function(data){
    let {token} = this.data
    const key = md5(new Date().getTime() + data.index + '')
    let keys = this.data.keys
    keys.push(key)
    this.setData({
      keys
    })

    wx.uploadFile({
      url: this.data.uploadUrl,
      filePath: data.item,
      name: 'file',
      formData: {
        token,
        key
      },
      success: (res)=>{
        const data = JSON.parse(res.data)
        
      }
    })
  },
  /**
   * 删除照片
   */
  del(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.uploadImg;
    let keys = this.data.keys;
    wx.showModal({
      title: '确认删除此图片吗？',
      success: (res) => {
        if (res.confirm) {
          list.splice(index,1)
          keys.splice(index,1)
          this.setData({
            uploadImg: list,
            keys:keys
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 输入框
   */
  inputText(e){
    this.setData({
      'form.content': e.detail.value
    })
  },
  /**
   * 表单提交
   */
  submit(){
    let {keys,form} = this.data

    if(form.cate_id === 0){
      wx.showToast({
        title: '请选择服务内容',
        icon : 'none',
        mask: true
      })
      return
    }
    if(form.rate === 0){
      wx.showToast({
        title: '请选择评分',
        icon : 'none',
        mask: true
      })
      return
    }

    if(form.content === ''){
      wx.showToast({
        title: '请填写评价内容',
        icon : 'none',
        mask: true
      })
      return
    }

    if(keys.length === 0){
      wx.showToast({
        title: '请拍摄照片',
        icon : 'none',
        mask: true
      })
      return
    }

    wx.showLoading({
      title: '发表中...',
      mask: true
    })
    var video = '';
    var images = '';
 
    images = keys.join(',')

    shopCommentAdd({
      shop_id : this.data.shop.id,
      service_cate_id : form.cate_id,
      service_cate_title : form.cate_title,
      rate : form.rate,
      comment : form.content,
      images : images,
    }).then(res => {
      if (res.status== 200){
        wx.showToast({
          title: '评价发布成功'
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    })
    
  },

  // 更改评分
  rateChange(e){
    const rate = e.detail
    this.setData({
      rateText : this.data.rateTexts[rate],
      'form.rate' : rate
    })
  },

    // 选择分类
    showCate(){
      wx.showActionSheet({
        itemList: this.data.cateList,
        success : res => {
          this.setData({
            'form.cate_id' : this.data.cateData[res.tapIndex].id,
            'form.cate_title' : this.data.cateData[res.tapIndex].title
          })
          // console.log(this.data.cateData[res.tapIndex])
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    },
})