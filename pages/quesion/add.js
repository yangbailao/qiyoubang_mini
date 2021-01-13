// pages/mission/add.js

import {
  getQuestionCate,
  questionUpdate,
  questionAdd,
  getQuestionById,
  getUploadToken
} from '../../api/api'
import {md5} from '../../utils/md5'
const chooseLocation = requirePlugin('chooseLocation');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      id:0,
      name:'',
      // tel:'',
      // cate_id:'',
      // cate_title:'',
      // locale:'',
      // bouns:'',
      description:''
    },
    uploadImg: [],
    keys:[],
    maskFlag : false,
    cateList:[],
    cateData:[],
    cateDataId :[],
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [], //下拉列表的数据
    index: 0, //选择的下拉列 表下标,

    shop:{ // 选地点用 懒得改名字

    }
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

    this.setData({
      scrollHeight
    });

    this.getCates()

    if(options.id > 0) this.getQuestion(options.id)

    getUploadToken().then(res => {
      this.setData({
        token: res.data.token,
        uploadUrl: res.data.uploadUrl,
      })
    })

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
    // const location = chooseLocation.getLocation();
    // if(location)
    // {
    //   this.setData({
    //     'shop.map_name' : location.name,
    //     'shop.address' : location.address,
    //     'shop.district' : location.district,
    //     'shop.city' : location.city,
    //     'shop.province' : location.city,
    //     'shop.latitude' : location.latitude,
    //     'shop.longitude' : location.longitude,
    //   });
    // }
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
  // 读取任务详情 - 编辑
  getQuestion(id){
    getQuestionById({id:id}).then(
      res => {
        const d = res.data.mission
        this.setData({
          'form.description':d.description,
          // 'form.tel': d.tel,
          // 'form.cate_id': d.cate_id,
          // 'form.tel': d.tel,
          // 'form.bouns': d.bouns,
          // 'form.locale':d.locale,
          'form.name' : d.name,
          'form.id' : d.id,
          // 'form.cate_title' : this.data.cateDataId[d.cate_id].title,
          'form.images' : d.images,
          // 'shop.map_name' : d.map_name,
          // 'shop.address' : d.address,
          // 'shop.district' : d.district,
          // 'shop.city' : d.city,
          // 'shop.province' : d.city,
          // 'shop.latitude' : d.latitude,
          // 'shop.longitude' : d.longitude,
        })
      }
    )
  },

  // 读取任务分类
  getCates(){
    getQuestionCate().then(res => {
      let cates = [];
      let listId = [];
      res.data.list.forEach((item)=>{
        listId.push(item.id)
        cates.push(item.title)
      })
      this.setData({
        selectData : cates, // 用做选择的数组
        cateData : res.data.list, // 用做选中的选项内容的数组
        cateDataId : listId, // 数组下标与分类id匹配的数组 
        'form.cate_id' : res.data.list[0].id
      })
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

  // 任务名称
  changeTitle(e){
    this.setData({
      'form.name': e.detail.value
    })
  },

  // 联系方式
  changeTel(e){
    this.setData({
      'form.tel': e.detail.value
    })
  },

  // 赏金
  changeBouns(e){
    this.setData({
      'form.bouns': e.detail.value
    })
  },

  // 任务地点
  changeLocale(e){
    this.setData({
      'form.locale': e.detail.value
    })
  },

  // 任务描述
  changeContent(e){
    this.setData({
      'form.description': e.detail.value
    })
  },

  /**
   * 表单提交
   */
  submit(){
    console.log(this.data.form)
    let {id,name,description} = this.data.form

    if(name === '' || description === ''){
      // console.log(title === '' , tel === '' , cate_id === '' , bouns === '' , content === '',content)
      wx.showToast({
        title: '请填写完整的信息',
        icon:'none',
        mask: true
      })
      return
    }

    const images = this.data.keys.join(',') //图片

    wx.showLoading({
      title: '提交中...',
      mask: true
    })

    let shop = this.data.shop
    
if(this.data.form.id > 0){
  questionUpdate({
    description:description,
    // tel: tel,
    // cate_id: cate_id,
    // tel: tel,
    // bouns: bouns,
    // locale:locale,
    name : name,
    id : id,
    img : images,
    // map_name : shop.map_name,
    // address : shop.address,
    // district : shop.district,
    // city : shop.city,
    // province : shop.province,
    // latitude : shop.latitude,
    // longitude : shop.longitude
  }).then(res => {
    if (res.status== 200){
      wx.showToast({
        title: '发布成功'
      })
      wx.navigateBack({
        delta: 1,
      })
    }
  })
}else{
  questionAdd({
    description:description,
    // tel: tel,
    // cate_id: cate_id,
    // tel: tel,
    // bouns: bouns,
    // locale:locale,
    name : name,
    // id : id,
    img : images,
    // map_name : shop.map_name,
    // address : shop.address,
    // district : shop.district,
    // city : shop.city,
    // province : shop.province,
    // latitude : shop.latitude,
    // longitude : shop.longitude
  }).then(res => {
    if (res.status== 200){
      wx.showToast({
        title: '发布成功'
      })
      wx.navigateBack({
        delta: 1,
      })
    }
  })
}


    
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show,
      maskFlag: !this.data.maskFlag
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show,
      maskFlag: !this.data.maskFlag,
      'form.cate_id' : this.data.cateData[Index].id,
    });
  },
  /**
   *  选择用户位置
   */
  chooseAddress : function(){
    const key = 'GQZBZ-ABDHS-6ZPOH-6P2WY-RPQGZ-PPFV5'; //使用在腾讯位置服务申请的key
    const referer = '骑行帮'; //调用插件的app的名称
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`
    });
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
   * 选择照片
   */
  takePhoto() {
    
    let {uploadImg} = this.data
    if (this.data.uploadImg.length >= 6) {
      wx.showToast({
        title: '最多选6张图片',
        icon: 'none'
      })
      return
    }
    wx.chooseImage({
      count: 9 - uploadImg.length,
      // sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
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
})