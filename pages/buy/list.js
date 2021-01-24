//index.js
//获取应用实例
const app = getApp()
import {
  scrollLoadList
} from '../../utils/util';
import {
  loginUser,
  getUser,
  getIndex,

} from '../../api/login'
import {
  cache
} from '../../utils/cache.js'
import {
  activitesList
} from '../../api/api'
Page({
  data: {
    motto: 'Hello World',
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    maskFlag: false,
    indexMenuFlag: false,
    mainMenuFlag: false,
    swiperHeight: 0,
    newsList: [],
    imagesList: [],
    current: 0,
    isRefresh: false,
    isLoading: false,
    isEnd: false,
    list: [],
    page: 1,
    pageSize: 10,
    cateActive: 0,
    banner1:[]
  },
  // 拉到最底部
  onScrollTolower(e) {
    if (this.data.isEnd) {
      wx.showToast({
        title: '所有数据已加载完成',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '数据加载中……',
      })
    }
    this.searchList()
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  swiperChange: function (e) {
    var that = this;
    that.setData({
      current: e.detail.current,
    })
  },
  onLoad: function () {
    app.editTabBar();
    app.chengeNeed()
    const {
      navBarHeight,
      navBarExtendHeight,
      windowHeight,
      windowWidth
    } = app.globalSystemInfo;
    let rpxR = 750 / windowWidth;
    // console.log(rpxR)
    let scrollHeight = windowHeight * rpxR - navBarExtendHeight * rpxR - navBarHeight * rpxR - 150 - 76 - 220 - 44 - 112;
    this.setData({
      scrollHeight
    });



    /**
     * 获取登录信息
     */
    if (cache.get('userInfo')) {
      getUser().then(() => {
        this.setUserInfo()
      })
    }
    getIndex().then((res) => {
      this.setData({
        imagesList: res.images,
        newsList: res.notice,
        banner1:res.banner1
      })
    })
    let title = '送文件'
    this.setData({
      page: 1,
      list: [],
      isEnd: false,
      isLoading: false,
      title,
      cateActive: '0'
    }, () => {
      this.searchList()
    })
  },
  onShow: function () {
    let getHeight = (wx.getSystemInfoSync().windowWidth - 30) * 9 / 16
    this.setData({
      swiperHeight: getHeight
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    // 刷新完成
    that.setData({
      isRefresh: true
    }, () => {
      wx.stopPullDownRefresh()
      that.searchList()
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    // 刷新完成
    that.setData({
      isRefresh: true,
      page: that.data.page - 0 + 1
    }, () => {
      wx.stopPullDownRefresh()
      that.searchList()
    })
  },
  getUserInfo: function (e) {
    app.authAndLogin(e.detail.userInfo, loginUser).then(() => {
      getUser().then(() => {
        this.setUserInfo()
      })
    })
  },
  setUserInfo: function () {
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
  test: function () {
    console.log(this.data)
  },
  searchList() {
    let that = this
    let {
      page,
      list,
      cateActive,
      isEnd,
      pageSize
    } = this.data;
    wx.showLoading({
      title: '加载中...',
    })
    activitesList({
      page: page,
      pageSize: pageSize,
      cate_id: cateActive || 0,
      status: 1
    }).then((res) => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      if (res.status== 200) {
        let getList = res.data.list
        if (page == 1) {
          list = []
        }
        isEnd = (getList.length <= pageSize)
        if (getList.length > 0) {
          list = list.concat(getList)
        }
        that.setData({
          list: list,
          isEnd: isEnd
        })
      }
    })

  },
  // tabbar
  showMenu: function (e) {
    this.setData({
      maskFlag: true
    })
    app.showMenu(e.currentTarget.dataset.index);
  },
  hideMask: function (e) {
    this.setData({
      maskFlag: false,
      indexMenuFlag: false,
      mainMenuFlag: false
    })
  },
  // tabbar
  touchNext: function (e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  isLogin:function(e){
    if(!this.data.userInfo)
    {
      wx.showToast({
        title: '请先授权登录',
        duration : 2000,
        icon : 'none'
      })
    }else{
      let url = e.currentTarget.dataset.url;
      console.log(e);
      wx.navigateTo({
        url: url,
      })
    }
  }
})