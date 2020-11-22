// pages/personal/index.js
const app = getApp()
import {
  loginUser,
  getUser
} from '../../api/login'
import { cache } from '../../utils/cache.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskFlag : false,
    indexMenuFlag :false,
    mainMenuFlag :false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();
    app.chengeNeed()
    if (cache.get('userInfo')) {
      getUser().then(res => {
        this.setData({
          userInfo:res
        })
      })
    }
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
   * tabbar
   */
  showMenu : function(e){
    this.setData({
      maskFlag : true
    })
    app.showMenu(e.currentTarget.dataset.index);
  },
  hideMask : function(e){
    this.setData({
      maskFlag : false,
      indexMenuFlag : false,
      mainMenuFlag :false
    })
  },
  /******* tabbar *******/ 
  getUserInfo: function(e) {
    app.authAndLogin(e.detail.userInfo, loginUser).then(() => {
      getUser().then( res => {
        this.setData({
          userInfo : res
        })
      })
    })
  },
  setUserInfo : function(){
    let gUserInfo = app.globalData.userInfo
    console.log(gUserInfo, 789)
    gUserInfo = gUserInfo ? gUserInfo : JSON.parse(cache.get('userInfo'))
    let {
      avatarUrl,
      nickName
    } = gUserInfo
    this.setData({
      avatarUrl,
      nickName,
      userInfo: gUserInfo,
      balance: cache.get('balance')
    })
  },
  goTo(e){
    if(this.data.userInfo)
    {
      wx.navigateTo({
        url: e.currentTarget.dataset['url'],
      })
    }
    else
    {
      wx.showToast({
        title: '请先登录',
        duration : 2000,
        icon : 'none'
      })
    }
  }
})