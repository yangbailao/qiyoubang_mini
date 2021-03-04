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
	showMask:false,
    markers: [{
      iconPath: "/images/marker-rescue.svg",
      id: 0, 
      latitude: 23.11306,
      longitude: 109.59364,
      width: 50,
      height: 50
    }],
    type:2,
    priceList:[],
	currentMask:[],
	currentM:{
		id:0,
		title:'',
		phone:''
	}
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
    console.log("显示传值____",options.type)
    if(options.type != undefined && options.type.length > 0){
      this.setData({
        type:options.type
      })
    }

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
    //创建 map 上下文 MapContext 对象。
    this.mapCtx = wx.createMapContext('map')
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
	console.log(this.data.currentMask);
	let currentM = this.data.currentMask.filter(function(item){
		if(e.detail.markerId == item.id){
			return item;
		}
	})
	console.log(currentM);
	this.setData({
		showMask:true,
		currentM:currentM[0]
	})
  },
  controltap(e) {
    console.log(e.detail.controlId)
  },
  labeltap(e) {
    console.log(e.detail)
  },
  callouttap(e) {
    console.log(e.detail)
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
        var markers = [];
		    var currentMask = [];
        const list = res.data.list
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
          markers.push(marker);
      
          
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
  hideMask:function(){
	  this.setData({showMask:false});
  }
  ,goToStore:function(){
    let id = this.data.currentM.id;
    wx.navigateTo({
      url: `/pages/shop/detail?id=${id}`
    });
  }
  ,goTo:function(e){
    
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