// pages/rescue/index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unfold : null,
    maskFlag : false,
    indexMenuFlag :false,
    mainMenuFlag :false,
    markers: [{
      id: 0, 
      latitude: 23.11306,
      longitude: 109.59364,
      width: 50,
      height: 50
    }]
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    app.editTabBar();
    const {
      contentHeight
    } = app.globalSystemInfo;

    this.setData({
      contentHeight,
      shop_name : opt.shop_name,
      latitude : opt.latitude,
      longitude : opt.longitude,
      markers: [{
        id: 0, 
        latitude: opt.latitude,
        longitude: opt.longitude,
        width: 50,
        height: 50,
        callout: {
				  content: 	opt.shop_name,
				  color: "#333333",
				  fontSize: 13,
				  borderRadius: 10,
				  bgColor: "#ffffff",
				  textAlign: "center" ,
				  padding: 10,
          display: 'ALWAYS',
          borderWidth : 1,
          borderColor : '#f00'
			  }
      }]
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
  getLocation : function(e){
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: res => {
        //赋值经纬度
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        console.log(res.latitude,res.longitude)
      }
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.detail.markerId)
  },
  controltap(e) {
    console.log(e.detail.controlId)
  },
  unfold() {
    var unfold = this.data.unfold
    if(unfold === null)
    {
      unfold = 1
    }
    if (unfold == 0) {   //点击后改变展开样式
      unfold = 1
    } else {
      unfold = 0
    }
    this.setData({  //赋值
      unfold: unfold
    })
  },
  moveEvent(){
    var unfold = this.data.unfold
    if(unfold === null)
    {
      unfold = 1
    }
    if (unfold == 0) {   //点击后改变展开样式
      unfold = 1
    } else {
      unfold = 0
    }
    this.setData({  //赋值
      unfold: unfold
    })
  },
  
})