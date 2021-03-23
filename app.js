//app.js
import page from './utils/page';
const app = getApp()
App({
  onLaunch: function () {
    Page = page;
    //计算导航栏高度
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight)*2;//导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
      },
      fail(err) {
        console.log(err);
      }
    })


    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  editTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },
  chengeNeed:function(){
    let need = wx.getStorageSync('need')
    console.log(need);
    if(need) {
      let takeId = wx.getStorageSync('takeId')
      wx.showModal({
        title:'提示',
        content:'有一个任务未完成，是否查看？',
        confirmText:'去查看',
        showCancel:false,
        success:function(res){
          if(res.confirm){
            wx.navigateTo({
              url: '/pages/mission/detail?id=' + takeId + '&showAccpte=true' ,
            })
          }
        }
      })
    }
  },

  showMenu: function (index) {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if(index == 1)
    {
      _curPage.setData({
        indexMenuFlag: true,
        mainMenuFlag: false
      });
    }
    if(index == 3)
    {
      _curPage.setData({
        mainMenuFlag: true,
        indexMenuFlag: false
      });
    }
    
  },
  authAndLogin(wxUser, loginUser){
    return new Promise((resolve) => {
      if(wxUser) {
        wx.showLoading({
          mask: true,
          title: '加载中'
        })
        console.log('走wx-服务器登录流程')
        
        loginUser(wxUser).then(data => {
          wx.hideLoading()
          resolve()
          // if (data.data.status === 0) {
          //   wx.navigateTo({
          //     url: '/pages/bind/bind',
          //   })
          // } else {
          //   wx.hideLoading()
          //   resolve()
          //   this.getList()
          //   getUser().then(() => {
          //     this.setData({
          //       userInfo: app.globalData.userInfo
          //     })
          //   })
          // }
        })
      }
    })
  },
  globalData: {
 
    userInfo: null,
    category:{
      id :0
    },
    category_mission:{
      id:0,
      name:''
    },
    category_information:{
      id:0,
      name:''
    },
    category_order:{
      id:-1,
      name:''
    },
    myMissionType : 1,
 
    tabBar: {
      color: "#a9b7b7",
      selectedColor: "#ff8124",
      borderStyle: "white",
      list: [
        {
          selectedIconPath: "/images/tabbar-index-cur.svg",
          iconPath: "/images/tabbar-index.svg",
          pagePath: "/pages/index/index",
          text: "首页",
          clas: "menu-item",
          selected: false,
          nav: true,
          index:1
        },

        {
          selectedIconPath: "/images/tabbar-moments-cur.svg",
          iconPath: "/images/tabbar-moments.svg",
          pagePath: "/pages/moments/list",
          text: "帮友录",
          clas: "menu-item",
          selected: false,
          nav: true,
          index:2
        },

        // {
        //   selectedIconPath: "/images/tabbar-main.svg",
        //   iconPath: "/images/tabbar-main.svg",
        //   pagePath: "/pages/repair/index",
        //   text: "",
        //   clas: "menu-item menu-main",
        //   selected: false,
        //   nav: false,
        //   index:3
        // },
 
        {
 
          selectedIconPath: "/images/tabbar-bike-cur.svg",
          iconPath: "/images/tabbar-bike.svg",
          pagePath: "/pages/information/list",
          text: "便民信息",
          clas: "menu-item",
          selected: false,
          nav: true,
          index:4
        },
        // {
        //   selectedIconPath: "/images/tabbar-mission-cur.svg",
        //   iconPath: "/images/tabbar-mission.svg",
        //   pagePath: "/pages/mission/list",
        //   text: "骑友帮",
        //   clas: "menu-item",
        //   selected: false,
        //   nav: true,
        //   index:5
        // }
        {
 
          selectedIconPath: "/images/tabbar-mission-cur.svg",
          iconPath: "/images/tabbar-mission.svg",
          pagePath: "/pages/buy/list",
          text: "嗨活动",
          clas: "menu-item",
          selected: false,
          nav: true,
          index:5
        },
        {
          selectedIconPath: "/images/tabbar-user-on.svg",
          iconPath: "/images/tabbar-user.svg",
          pagePath: "/pages/personal/index",
          text: "个人中心",
          clas: "menu-item",
          selected: false,
          nav: true,
          index:6
        }
      ],
 
      position: "bottom"
 
    }
  }
})