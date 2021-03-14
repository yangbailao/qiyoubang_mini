
const rpx2px = wx.getSystemInfoSync().windowWidth / 750
import {
  getGoodInfo,
  getOrderCheck
} from '../../api/api'
const app = getApp()
var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : 0,
    is_check:0,
    detail : null,
    userInfo : null,
    qrcodeURL: '',
    content: '11111',
    width: 600,
    goodsInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _self = this;
    this.setData({
      id : options.order_id,
      content:options.order_id
    })
    // this.getInformationDetail()
    // app.chengeNeed()
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
  // 读取订单商品详情
  getGoodInfos(order_id = 0){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    getGoodInfo({order_id:order_id}).then( res => {
      console.log(res.data);
      _self.setData({
        detail : res.data,
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })
    
  },
  //扫码结果
  scanQr(){
    wx.scanCode({
      success (res) {
        console.log(res)
        _self.getGoodInfos(res.result);
      }
    })
  },
  goCheck(){
    
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    getOrderCheck({order_id:this.data.detail.order_id,orders_id:this.data.detail.orders_id}).then( res => {
      console.log(res.data);
      _self.setData({
        is_check: 1,
      })
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '核销成功',
            mask:true
          })
        },
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