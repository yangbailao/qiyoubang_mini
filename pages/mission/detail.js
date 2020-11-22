// pages/mission/detail.js

import {
  getMissionById,
  getTake,
  getCheckFinish,
  getConfirmMission
} from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : 0,
    detail : null,
    userInfo : null,
    showAccpte:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id : options.id,
      showAccpte:options.showAccpte?options.showAccpte:false
    })
    this.getMissionDetail()
    
    if(options.showAccpte){
      that.fetchTake()
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
    let needShow = wx.getStorageSync('needShow')
    if(needShow){
      this.fetchCheckFinish()
    }
    console.log("显示内容___",needShow)
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

  // 读取任务详情
  getMissionDetail(){
    wx.showLoading({
      title: '加载中',
    })
    getMissionById({id:this.data.id}).then( res => {
      this.setData({
        detail : res.data.mission,
        userInfo : res.data.user
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })
    
  },
  // 拨打电话
  touchToPhone:function(){
    let t = this
    wx.showModal({
      title:'接单提示',
      content:'确认要接此单?',
      cancelText:'取消',
      confirmText:'确定',
      success:function(res){
        if(res.confirm){
          t.fetchTake()
        }
      }
    })
    
  },
  fetchTake:function(){
    let that = this
    const {detail} = this.data
    getTake({'id':detail.id}).then((res) =>{
      if(res.code == 1){
        wx.makePhoneCall({
          phoneNumber: detail.tel,
          success:function(){
            wx.setStorageSync('needShow', 'true')
            that.fetchTake()
          },
          fail:function(res){
            that.fetchTake()
            // wx.showToast({
            //   title: '拨打失败！',
            //   icon:'none'
            // })
          }
        })
      }
    })
  },
  fetchCheckFinish:function(){
    getCheckFinish({}).then((res) => {
      if(res.code == 1){
        wx.setStorageSync('need', res.data)
        wx.setStorageSync('takeId', this.data.id)
      }
    })
  },
  fetchTake:function(){
    const {id} = this.data
    wx.showModal({
      title:'是否已接受此任务？',
      cancelText:'拒绝',
      confirmText:'接受',
      success:function(res){
        let status = 0
        if(res.confirm){
          status = 1
        }
        getConfirmMission({'id':id,'status':status}).then((res) => {
          if(res.code == 1) {
            console.log("显示结果_____",res)
            console.log("显示结果_____",status)
            if(status == 1) {
              wx.removeStorageSync('need')
              wx.removeStorageSync('takeId')
            }
          }
        })
        
      }
    })
  }
})