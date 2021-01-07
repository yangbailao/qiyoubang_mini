// pages/personal/myServiceShop.js
import {
  getShopById
} from '../../api/api'
import {
  getUser
} from '../../api/login'
import { cache } from '../../utils/cache.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lat:0,
    long:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    app.chengeNeed()
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: res => {
        console.log(res)
        wx.hideLoading()
       
        this.setData({
          lat:res.latitude,
          long:res.longitude
        })
      }
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
    if (cache.get('userInfo')) {
      getUser().then(res => {
        this.setData({
          userInfo:res
        })
        if(this.data.userInfo.service_shop_id > 0)
        {
          this.getDetail() //获取店铺详情
        }
      })
    }
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
  // 获取店铺详情
  getDetail(){
    wx.showLoading({
      title: '加载中',
      mask : true
    })
    getShopById({id:this.data.userInfo.service_shop_id}).then(
      res=>{
        this.setData({
          detail : res.data
        })
        wx.hideLoading()
      }
    )
  },
  selectShop()
  {
    wx.showLoading({
      title: '加载中……',
      mask : true
    })
    wx.navigateTo({
      url: '/pages/shop/list?act=service_shop&lat='+this.data.lat+'&long='+this.data.long,
    })
  },

})