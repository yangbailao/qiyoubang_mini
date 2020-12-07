// pages/mission/detail.js
const app = getApp()
import {
  loginUser,
  getUser
} from '../../api/login'
import {
  getMissionById,
  getTake,
  getCheckFinish,
  getConfirmMission
} from '../../api/api'
import { cache } from '../../utils/cache.js'
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
    // 获取用户信息
    if (cache.get('userInfo')) {
      getUser().then(() => {
        this.setUserInfo()
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
        user_info : res.data.user
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })
    
  },
  getUserInfo: function(e) {
    app.authAndLogin(e.detail.userInfo, loginUser).then(() => {
      getUser().then(() => {
        this.setUserInfo()
      })
    })
  },
  setUserInfo : function(){
    let gUserInfo = app.globalData.userInfo
    // console.log(gUserInfo, 789)
    gUserInfo = gUserInfo ? gUserInfo : JSON.parse(cache.get('userInfo'))
    let {
      avatarUrl,
      nickName
    } = gUserInfo
    this.setData({
      avatarUrl,
      nickName,
      userInfo: gUserInfo,
    })
  },
  // 拨打电话
  touchToPhone:function(){
    if(this.data.userInfo)
    {
      wx.showModal({
        title:'接单提示',
        content:'确认要接此任务?',
        cancelText:'取消',
        confirmText:'确定',
        success:res=>{
          if(res.confirm){
            getTake({'id':this.data.detail.id}).then((res) =>{
              if(res.code == 1){
                wx.makePhoneCall({
                  phoneNumber: this.data.detail.tel,
                  success:() =>{
                    wx.showModal({
                      title:'提示',
                      content:'电话联系后请反馈是否已接受此任务！',
                      cancelText:'未接受',
                      confirmText:'已接受',
                      success:res=>{
                        console.log('已确认')
                        console.log(res)
                        const status = res.confirm ? 1 : 0
                        const id = this.data.detail.id
                        getConfirmMission({status,id}).then((res) => {
                          if(res.code == 1){
                            wx.setStorageSync('need', res.data)
                            wx.setStorageSync('takeId', this.data.id)
                          }
                        })
                      }
                    })
                    // wx.setStorageSync('needShow', 'true')
                    // that.fetchTake()
                  },
                  fail:res =>{
                    console.log('不拨打')
                    wx.showModal({
                      title:'是否已接受此任务？',
                      // content:'确认要接此任务?',
                      cancelText:'未接受',
                      confirmText:'已接受',
                      success:res=>{
                        console.log('已确认')
                        console.log(res)
                        const status = res.confirm ? 1 : 0
                        const id = this.data.detail.id
                        getConfirmMission({status,id}).then((res) => {
                          if(res.code == 1){
                            wx.setStorageSync('need', res.data)
                            wx.setStorageSync('takeId', this.data.id)
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
    else
    {
      wx.showToast({
        title: '请先登录再发布骑友录',
        duration : 2000,
        icon : 'none'
      })
    }

    
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