// pages/help/index.js
const app = getApp()
import {
  loginUser,
  getUser
} from '../../api/login'
import {scrollLoadList} from '../../utils/util'
import {
  workerList,
  getWorkerCate,
  getSystemConfig
} from '../../api/api'
import { cache } from '../../utils/cache.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    pageSize: 10,
    allCategory: [], // 信息分类
    moreCategory: [], // 分类
    isLoading:false,
    isEnd: false,
    cateActive: 0,
    cateSonActive: 0,
    searchShow:false,
    searchStr:'',
    latitude : 0,
    longitude : 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前的地理位置、速度
    this.getLocation();

    app.chengeNeed()
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

    // 头部描述文字
    getSystemConfig({title:'worker_text'}).then((res) => {
      this.setData({
        headText : res.data
      })
    })

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
  touchSearch:function(){
    this.setData({
      searchShow:true,
      focus:true
    })
  },
  touchToSearch:function(e){
    let value = e.detail.value
    this.setData({
      page:1,
      searchStr:value
    })
    
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

  searchList(isSonCate = 0) {
    let that = this
    let {
      page,
      cateActive,
      pageSize,
      searchStr
    } = this.data;
	if(isSonCate> 0){
		cateActive = isSonCate;
	}
    workerList({page:page,pageSize:pageSize,type:cateActive,title:searchStr,lat:this.data.latitude,long:this.data.longitude}).then((res) =>{
      if(res.code == 1) {
        let list = res.data.list
        if(page == 1) {
          that.data.list = []
        }
        let showMore = (list.length > 0)
        if(showMore) {
          that.data.list = that.data.list.concat(list)
        }
        that.setData({
          list:that.data.list
        })
      }
    })
  },
  // 读取信息分类
  getCates(){
    getWorkerCate().then(res => {
      this.setData({
        allCategory : res.data.topAllList,
        moreCategory : res.data.allList
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
      this.searchList(cate)
    })
  },
  // 点击子分类
  changeSonCate(e) {
    const {title, cate,soncate} = e.currentTarget.dataset
	console.log(soncate);
    this.setData({
      page: 1,
      list: [],
      isEnd: false,
      isLoading: false,
      title,
      cateActive: cate,
      cateSonActive: soncate
    },() => {
      app.globalData.category.id = cate
      this.searchList(soncate)
    })
  },
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



})