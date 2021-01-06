// pages/personal/collection.js

import {
  getFavorShop,
  getFavorWorker,
  getFavorMoment
} from '../../api/api';
const app = getApp()
import {scrollLoadList} from '../../utils/util'
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
    typeActive : 1,
    list:[],
    // listHeitht : app.globalSystemInfo.contentHeight - 100,
    isRefresh: false,
    isLoading:false,
    isEnd: false,
    page: 1,
    pageSize: 10,
    totalPage: 1,
    total: 1,
    triggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.chengeNeed()
	if (cache.get('userInfo')) {
	  getUser().then(res => {
		  console.log(res);
	    this.setData({
	      userInfo:res
	    })
		this.searchList()
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
    // 刷新完成
    this.setData({
      isRefresh: true
    },()=> {
      wx.stopPullDownRefresh()
      this.reloadData()
    })
  },

  // 拉到最底部
  onScrollTolower(e){
    console.log(e)
    if(this.data.isEnd)
    {
      wx.showToast({
        title: '所有数据已加载完成',
        icon:'none'
      })
    }
    else
    {
      wx.showLoading({
        title: '数据加载中……',
      })
    }
    this.searchList()
  },
  // 下拉刷新
  onAbort(e) {
    this.reloadData()
  },
  // 点击切换状态
  changeStatus(e) {
    const {type} = e.currentTarget.dataset
    this.setData({
      page: 1,
      list: [],
      isEnd: false,
      isLoading: false,
      typeActive : type
    },() => {
      // app.globalData.myMissionType = type
      this.reloadData()
    })
  }, 
  // 重新加载数据
  reloadData() {

    this.setData({
      isEnd: false,
      page: 1,
      list: [],
    },() => {
      this.searchList()
    })
  },
  searchList() {
    let {
      page,
      list,
      isEnd,
      isLoading,
      pageSize
    } = this.data;
    var apiMethod
	switch(Number(this.data.typeActive)){
		case 1:
		apiMethod = getFavorShop;
		break;
		case 2:
		apiMethod = getFavorMoment;
		break;
		case 3:
    apiMethod = getFavorWorker;
    break;
	}
	
    scrollLoadList({
      isEnd,
      isLoading,
      list,
      apiPost:  apiMethod,
      data:{
        page,
        pageSize,
		user_id:this.data.userInfo.id
      },
      beforeLoad:() => {
        this.setData({
          isLoading: true,
          isShowAllPop: false
        })
      },
      afterLoad: ({lists,page,totalPage,total,isLoading,isEnd}) => {
        this.setData({
          isLoading,
          page,
          totalPage,
          list: lists,
          total,
          isEnd
        })
        // wx.stopPullDownRefresh()
      }
    })
  },
  goTo(e){
    console.log(e.currentTarget.dataset.url)
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }
})