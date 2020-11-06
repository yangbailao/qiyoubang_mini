// pages/mission/list.js
//获取应用实例
const app = getApp()
import {
  loginUser,
  getUser
} from '../../api/login'
import {scrollLoadList} from '../../utils/util'
import {
  informationList,
  getInformationCate
} from '../../api/api'
import { cache } from '../../utils/cache.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskFlag : false,
    indexMenuFlag :false,
    mainMenuFlag :false,
    userInfo:null,
    isRefresh: false,
    isLoading:false,
    isEnd: false,
    isShowAllPop: false,
    list: [],
    page: 1,
    pageSize: 10,
    totalPage: 1,
    total: 1,
    allCategory: [], // 信息分类
    isOnload: false,  // 是否曾经加载过
    cateActive: 0,
    focus: true,
    triggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();
    const {
      contentHeight,
      navBarExtendHeight,
      navBarHeight,
      windowWidth
    } = app.globalSystemInfo;
    const rpxR =750 / windowWidth;
    let listHeight = contentHeight - 80;
    this.setData({
      listHeight
    })

    //发布按钮位置
    let addTop = navBarExtendHeight * rpxR + navBarHeight * rpxR + 1000;

    this.setData({
      addTop
    });

    // 获取用户信息
    if (cache.get('userInfo')) {
      getUser().then(() => {
        this.setUserInfo()
      })
    }



    // 读取信息分类
    this.getCates()

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
    // const {isOnload, cateActive} = this.data
    // const {id} = app.globalData.category
    // if (isOnload && cateActive != id) {
    //   this.reloadData()
    // }
    // 读取信息列表
    this.reloadData()
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

  onAbort(e) {
    this.reloadData()
  },
  // 拉到最底部
  onScrollTolower(e){
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

  // 重新加载数据
  reloadData() {
    console.log('f')
    const {id, name} = app.globalData.category
    this.setData({
      isEnd: false,
      page: 1,
      list: [],
      title: name,
      cateActive: id
    },() => {
      this.searchList()
    })
  },

  searchList() {
    let {
      page,
      list,
      cateActive,
      isEnd,
      isLoading,
      pageSize
    } = this.data;
    
    scrollLoadList({
      isEnd,
      isLoading,
      list,
      apiPost: informationList,
      data:{
        page,
        pageSize,
        cate_id: cateActive || 0,
        status : 1
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
  // 读取信息分类
  getCates(){
    getInformationCate().then(res => {
      this.setData({
        allCategory : res.data.allList
      })
    })
  },
  // 点击分类
  changeCate(e) {
    const {title, cate} = e.currentTarget.dataset
    this.setData({
      page: 1,
      list: [],
      isEnd: false,
      isLoading: false,
      title,
      cateActive: cate
    },() => {
      app.globalData.category.id = cate
      this.searchList()
    })
  },


})


