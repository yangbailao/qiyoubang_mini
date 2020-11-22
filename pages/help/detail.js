// pages/help/detail.js
import {
  fetchHelpDetail,
  getWorkerCate
} from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : 0,
    detail : null,
    userInfo : null,
    showAccpte:false,
    allCategory:[]
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
    // 读取信息分类
    getCates(){
      getWorkerCate().then(res => {
        let list = res.data.list
        list.map((item,index) =>{
          if(item.id == this.data.detail.worker_cate){
            this.data.detail['cateName'] = item.title
          }
        })
        this.setData({
          allCategory : res.data.allList,
          detail:this.data.detail
        })
      })
    },
  // 读取任务详情
  getMissionDetail(){
    wx.showLoading({
      title: '加载中',
    })
    fetchHelpDetail({id:this.data.id}).then( res => {
      
      this.setData({
        detail : res.data,
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })
    
  },
  
  
  
})