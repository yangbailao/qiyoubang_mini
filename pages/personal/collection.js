// pages/personal/collection.js

import {
  fetchCollectionList,
  fetchCollection
} from '../../api/api';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    pageSize:10,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.chengeNeed()
    this.fetchList()
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
    this.fetchList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page:this.data.page-0+1
    })
    this.fetchList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  fetchList:function () {
    let that = this
    let data = {}
    data['page'] = that.data.page
    data['pageSize'] = that.data.pageSize
    // data['token'] = wx.
    fetchCollectionList(data).then((res) => {
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      let list = res.data.list
      if(that.data.page == 0) {
        that.data.list = []
      }
      that.data.list.concat(list)
      that.setData({
        list:that.data.list
      })
    })
  },
  touchCollection:function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let data = {'shop_id':id}
    fetchCollection(data).then((res) => {
      if(res.code == 1) {
        wx.showToast({
          title: '成功取消收藏',
        })
        that.setData({
          page:1
        })
        that.fetchList()
      } else {
        wx.showToast({
          title: '取消失败',
        })
      }
    })

  }
})