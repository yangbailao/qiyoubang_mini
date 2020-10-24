// pages/moments/list.js
//获取应用实例
const app = getApp()
import {scrollLoadList} from '../../utils/util';
import {
  loginUser,
  getUser
} from '../../api/login'
import {
  getMomentsList,
  getQiniu
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
    show: false,
    list:[],
    listData:{
      page: 1,
      pageSize: 5,
      totalPage: 1,
      total: 1,
    },
    isShow: false,//控制emoji表情是否显示
    isLoad: true,//解决初试加载时emoji动画执行一次
    content: "",//评论框的内容

    disabled: true,
    cfBg: false,
    _index: 0,
    comments:'',
    emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    //0x1f---
    emoji: [
      "01", "02", "03", "04", "05", "06", "07", "08", "09","10", 
      "11", "12", "13", "14", "15", "16", "17", "18", "19","20", 
      "21", "22", "23", "24", "25", "26", "27", "28", "29","30", 
      "31", "32", "33", "34", "35", "36", "37", "38", "39","40", 
      "41", "42", "43", "44", "45", "46", "47", "48", "49","50", 
      "51", "52", "53", "54", "55",
    ],
    emojis: [],//qq、微信原始表情
    alipayEmoji: [],//支付宝表情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();
    const {
      navBarHeight,
      navBarExtendHeight,
      windowHeight,
      windowWidth
    } = app.globalSystemInfo;
    const rpxR =750 / windowWidth;
    let scrollHeight = windowHeight * rpxR - navBarExtendHeight * rpxR - navBarHeight * rpxR - 112;
    //显示朋友圈图片的可用总宽度
    let imageWidth = 750 - 60 - 92;
    //九宫格图片宽高
    let imgHeight = imageWidth / 3;
    //发布按钮位置
    let addTop = navBarExtendHeight * rpxR + navBarHeight * rpxR + 80;

   
    this.setData({
      scrollHeight,
      imgHeight,
      addTop
    });

    if (cache.get('userInfo')) {
      getUser().then(() => {
        this.setUserInfo()
      })
    }

    //读取骑友录数据
    this.getMomentsList()

    //获取7牛配置信息
    getQiniu().then((res) => {
      this.setData({
        qiniuShowUrl : res.data.showUrl
      })
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
    //读取骑友录数据
    this.getMomentsList()
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
  previewImg : function(e){
    let imgSrc = e.currentTarget.dataset.img
    let imgs = e.currentTarget.dataset.imgs
    var images = []
    imgs.forEach((item,index,array)=>{
      let url = this.data.qiniuShowUrl + item
      images.push(url)
    })
    wx.previewImage({
      current: imgSrc,
      urls: images
    })
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
  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    console.log(event.detail);
  },

  /**
   * 获取列表
   */
  getMomentsList : function() {
    // console.log(this.data.listData)
    let {isEnd,isLoading} = this.data;
    var requestData = Object.assign({}, this.data.listData)
    scrollLoadList({
      isEnd,
      isLoading,
      list:this.data.list,
      apiPost: getMomentsList,
      data: requestData,
      beforeLoad:()=> {
        this.setData({isLoading: true})
      },
      afterLoad: ({lists,page,totalPage,total,isLoading,isEnd})=> {
        this.setData({
          list: lists,
          'listData.page' : page,
          'listData.totalPage' : totalPage,
          'listData.total' : total,
          isLoading,
          isEnd
        });
      }
    })
  },
  // 前往发布页面
  goToAdd(){
    if(this.data.userInfo)
    {
      wx.navigateTo({
        url: '/pages/moments/add',
      })
    }
    else
    {
      wx.showToast({
        title: '请先登录再发布骑友录',
        duration : 2000,
        icon : 'none'
      })
    }
  }
})