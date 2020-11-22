// pages/personal/feedback.js
const app = getApp()
import {
  upDateFeedback
} from '../../api/api'
import {md5} from '../../utils/md5'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadImg:[],
    keys:[],
    getId:0,
    form:{
      title:'',
      content:'',
      img:'',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.chengeNeed()
    this.setData({
      getId:options.id
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
  changeTitle:function(e){
    this.data.form.title = e.detail.value
    this.setData({
      form:this.data.form
    })
  },
  changeContent:function(e){
    this.data.form.content = e.detail.value
    this.setData({
      form:this.data.form
    })
  },
  /**
   * 选择照片
   */
  takePhoto() {
    
    let {uploadImg} = this.data
    if (this.data.uploadImg.length >= 3) {
      wx.showToast({
        title: '最多选3张图片',
        icon: 'none'
      })
      return
    }
    wx.chooseImage({
      count: 3 - uploadImg.length,
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
   * 表单提交
   */
  submit(){
    let {keys,form} = this.data

    if(form.title === ''){
      wx.showToast({
        title: '请填写标题',
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
    console.log("显示内容____",form)
    upDateFeedback({
      user_id:this.data.getId,
      title : form.title,
      content : form.content,
      images : images,
    }).then(res => {
      if (res.code == '1'){
        wx.showToast({
          title: '意见反馈发布成功'
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    })
    
  },
})