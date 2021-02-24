// pages/rescue/index.js
//获取应用实例
const app = getApp()
import {
  getShopList,
  getPriceList
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
      iconPath: "/images/test_1.png",
      id: 0, 
      latitude: 23.11306,
      longitude: 109.59364,
      width: 50,
      height: 50
    }],
    currentMask:[],
    type:1
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

    this.setData({
      contentHeight : contentHeight + 112
    })


    //获取当前的地理位置、速度
    this.getLocation();

    //读取身边的店铺列表并标记
    this.getShops()
    this.getPrice()
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
  hideMask:function(){
	  this.setData({showMask:false});
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
	let currentM = this.data.currentMask.filter(function(item){
		if(e.detail.markerId == item.id){
			return item;
		}
	})
	this.setData({
		showMask:true,
		currentM:currentM[0]
	})
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
        var currentMask = [];
        // console.log(res,typeof list,list)
        list.forEach(item =>{
          let marker = {
            iconPath: "/images/test_1.png",
            id: item.id, 
            latitude: item.latitude,
            longitude: item.longitude,
            width: 50,
            height: 50
          }

          
          let map_address = {
            address:item.address,
            latitude:item.latitude,
            longitude:item.longitude,
            name:item.map_name,
          }
          
                let maskItem = {
                  id:item.id,
                  title:item.shop_name,
                  phone:item.shop_tel,
                  map_address:JSON.stringify(map_address)
                }
                currentMask.push(maskItem);
          markers.push(marker)
          this.setData({
            markers,
            currentMask
          })
        })
      }
    )
  },
  getPrice:function(){
    let that = this
    getPriceList({page:1,pageSize:10,type:that.type}).then(res => {
      let list = res.data.list
      that.setData({
        priceList:list
      })
    })
  },
  goTo:function(e){
    let {address,latitude,longitude,name} = JSON.parse(e.currentTarget.dataset.map);
            wx.openLocation({
      //​使用微信内置地图查看位置。
            latitude:Number(latitude),//要去的纬度-地址
            longitude: Number(longitude),//要去的经度-地址
             name: name,
       scale: 18,
            address:address
           })
this.hideMask();
  }
})