// pages/rescue/index.js
//获取应用实例
const app = getApp()
import {
  getShopList
} from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unfold : null,
    maskFlag : false,
    indexMenuFlag :false,
    mainMenuFlag :false,
    latitude : 0,
    longitude : 0,
    markers: [{
      iconPath: "/images/marker-rescue.svg",
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
  onLoad: function (options) {
    app.editTabBar();
    const {
      contentHeight
    } = app.globalSystemInfo;

    this.setData({
      contentHeight
    })


    //获取当前的地理位置、速度
    this.getLocation();

    //读取身边的店铺列表并标记
    this.getShops()
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
  getLocation : function(e){
    wx.showLoading({
      title: '加载中……',
      mask : true
    })
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: res => {
        //赋值经纬度
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        wx.hideLoading()
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
  // 读取身边店铺列表
  getShops(){
    getShopList({page:1,pageSize:8,lat:this.data.latitude,long:this.data.longitude}).then(
      res => {
        var markers = []
        const list = res.data.list
        // console.log(res,typeof list,list)
        list.forEach(item =>{
          let marker = {
            iconPath: "/images/marker-repair.svg",
            id: item.id, 
            latitude: item.latitude,
            longitude: item.longitude,
            width: 50,
            height: 50
          }
          markers.push(marker)
          this.setData({
            markers
          })
        })
        
          
        
        
      }
    )
  }
  
})