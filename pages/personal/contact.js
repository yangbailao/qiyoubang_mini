// pages/personal/contact.js
const app = getApp()
import {
  getContact
} from '../../api/api'
import {md5} from '../../utils/md5'
var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eamil:'cheyoubang@che.com',
    phone:'123456789'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.chengeNeed()
	_self=this;
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
	getContact({}).then(res => {
	  if (res.status== 200){
	    _self.setData({
	      email:res.data.email,
	      phone:res.data.tel
	    })
	  }
	})
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
	//拨打电话
	 callPhone:function(phone){
		 wx.makePhoneCall({
		   phoneNumber: this.data.phone
		 })
	 }
})