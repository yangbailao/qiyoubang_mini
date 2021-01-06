// pages/moments/add.js
const app = getApp()
import {
  getUploadToken,
  momentAdd,

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
    //发布按钮位置
    let addTop = navBarExtendHeight * rpxR + navBarHeight * rpxR + 80;

    this.setData({
      scrollHeight,
      imgHeight,
      addTop
    });

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
  /**
   * 选择视频
   */
  takeVideo() {
    wx.chooseVideo({
      maxDuration : 30,
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.upload({item:res.tempFilePath,index:0})
        this.setData({
          uploadVideo: res.tempFilePath
        })
      }
    })
  },

  addPhoto(){
    if(this.data.uploadImg.length > 0)
    {
      this.takePhoto()
    }
    else
    {
      wx.showActionSheet({
        itemList: ['视频', '照片'],
        success: (res) => {
          switch (res.tapIndex) {
            case 1:
              this.takePhoto()
              break;
            case 0:
              this.takeVideo()
              break;
          
            default:
              break;
          }
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    }
    
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
  delVideo(){
    wx.showModal({
      title: '确认删除此视频吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            uploadVideo: null,
            keys:[]
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
      content: e.detail.value
    })
  },
  /**
   * 表单提交
   */
  submit(){
    let {keys,content,uploadVideo} = this.data

    if(keys.length === 0 && content === ''){
      wx.showToast({
        title: '请输入内容',
        image : '/images/close.png',
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
    if(uploadVideo)
    {
      video = keys.join(',')
    }
    else
    {
      images = keys.join(',')
    }
    momentAdd({
      content:content,
      images: images,
      video : video
    }).then(res => {
      if (res.status== 200){
        wx.showToast({
          title: '骑友圈发布成功'
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    })
    
  },
})