// pages/personal/myComment.js
import {
  fetchCommentList,
  delComment,
  getQiniu
} from '../../api/api';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    pageSize:10,
    list:[],
    showMore:true,
    qiniuShowUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.chengeNeed()
    this.fetchData()
    //获取7牛配置信息
    getQiniu().then((res) => {
      this.setData({
        qiniuShowUrl : res.data.showUrl
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
    this.setData({
      page:1
    })
    this.fetchData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.showMore){
      this.setData({
        page:this.data.page-0+1
      })
      this.fetchData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  fetchData:function(){
    let that = this
    fetchCommentList({page:that.data.page,pageSize:that.data.pageSize}).then((res) => {
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      if(res.status== 200) {
        let list = res.data.list
        if(that.data.page == 1) {
          that.data.list = []
        }

        let showMore = (list.length > 0)
        
        if(showMore) {
          that.data.list = that.data.list.concat(list)
        }
        that.setData({
          showMore:showMore,
          list:that.data.list
        })
        
      }
    })
  }
  ,del:function(e){
    console.log(e);
    delComment({ids:e.currentTarget.dataset.ids}).then(res => {
      this.onPullDownRefresh()
    })
  }
})