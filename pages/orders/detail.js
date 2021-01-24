// pages/mission/detail.js
const QR = require('../../utils/weapp-qrcode.js')
const rpx2px = wx.getSystemInfoSync().windowWidth / 750
import {
  getInformationById
} from '../../api/api'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : 0,
    detail : null,
    userInfo : null,
    qrcodeURL: '',
    content: '11111',
    width: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id : options.id
    })
    // this.getInformationDetail()
    // app.chengeNeed()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
        // 此方法返回输出base64编码
        var imgData = QR.drawImg(this.data.content, {
          typeNumber: 3,//码点大小 1-40，数字越大，码点越小，二维码会显得越密集
          //纠错等级 H等级最高(30%) 简单来说，就是二维码被覆盖了多少仍然能被识别出来
          errorCorrectLevel: 'H',
          size: parseInt(rpx2px * this.data.width)
        })
        // 返回输出base64编码imgData赋值到image标签的src中
        console.log(imgData);
        this.setData({
          qrcodeURL: imgData
        })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义标题',
      // path: 'pages/information/detail?id=123'
    }
  },
	/* 分享到朋友圈 */
	onShareTimeline:function(res){
		console.log(res)
	},
  // 读取任务详情
  getInformationDetail(){
    wx.showLoading({
      title: '加载中',
    })
    getInformationById({id:this.data.id}).then( res => {
      this.setData({
        detail : res.data,
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })
    
  },

  //拨打电话
  call(){
    wx.makePhoneCall({
      phoneNumber: this.data.detail.tel,
    })
  }
})