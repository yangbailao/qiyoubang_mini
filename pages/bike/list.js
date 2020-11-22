// pages/bike/list.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listStyle : 1,
    maskFlag : false,
    indexMenuFlag :false,
    mainMenuFlag :false,
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
    dropDownMenuTitle: ['区域', '牌子', '电源', '价格'],
    data1: [{
        id: 0,
        title: '青秀区',
        
      },
      {
        id: 1,
        title: '西乡塘区',
        
      },
      
    ],
    data2: [{
        id: 1,
        title: '个人房源'
      },
      {
        id: 2,
        title: '经纪人房源'
      }
    ],
    data3: [{
        id: 1,
        title: '出租'
      },
      {
        id: 2,
        title: '出售'
      }
    ],
    data4: [{
      id: 1,
      title: '智能排序'
    }, {
      id: 2,
      title: '发布时间'
    }, {
      id: 3,
      title: '距离优先'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();
    app.chengeNeed()
    const {
      contentHeight
    } = app.globalSystemInfo;

    let scrollHeight = contentHeight - 48;
    this.setData({
      scrollHeight
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
  selectedItem: function(e) {
    console.log(e);
  },
  changeStyle: function(e) {
    
    this.setData({
      listStyle : e.detail
    })

    console.log(this.data.listStyle);
  },
})