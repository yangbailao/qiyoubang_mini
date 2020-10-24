//index.js
//获取应用实例
const app = getApp()
import {
  loginUser,
  getUser
} from '../../api/login'
import { cache } from '../../utils/cache.js'

Page({
  data: {
    motto: 'Hello World',
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    maskFlag : false,
    indexMenuFlag :false,
    mainMenuFlag :false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    app.editTabBar();
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
  test : function(){
    console.log(this.data)
  },

  // tabbar
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
  }
  // tabbar
})
