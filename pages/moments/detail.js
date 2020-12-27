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
  getQiniu,
  addMomentLike,
  delMomentLike,
  addMomentAttention,
  delMomentAttention,
  addMomentComment,
  delMoments
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
    isRefresh: false,
    isLoading:false,
    isEnd: false,
    page: 1,
    pageSize: 2,
    totalPage: 1,
    total: 1,
    triggered: false,
    
    isShow: false,//控制emoji表情是否显示
    isLoad: true,//解决初试加载时emoji动画执行一次
    content: "",//评论框的内容

	searchKey:'',
	search_user:0,

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

    focusInput: false,
    height: '',
    isInput: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();
    app.chengeNeed()
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
      addTop,
      windowHeight: windowHeight * rpxR
    });

    if (cache.get('userInfo')) {
      getUser().then(res => {
        this.setData({
          userInfo:res
        })
      })
    }

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
    this.reloadData()
    console.log(this.data.userInfo)
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
    // 刷新完成
    this.setData({
      isRefresh: true
    },()=> {
      wx.stopPullDownRefresh()
      this.reloadData()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义标题',
      // path: 'pages/information/detail?id=123'
    }
  },
	/* 分享到朋友圈 */
	onShareTimeline:function(res){
		console.log(res)
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
      getUser().then(res => {
        this.setData({
          userInfo : res
        })
        console.log(this.data.userInfo)
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

  // 拉到最底部
  onScrollTolower(e){
    console.log(e)
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
  // 下拉刷新
  onAbort(e) {
    this.reloadData()
  },

  // 重新加载数据
  reloadData(searchKey='') {
    this.setData({
      isEnd: false,
      page: 1,
      list: []
    },() => {
      this.searchList(searchKey)
    })
  },
  searchList(searchKey='') {
    let {
      page,
      list,
      isEnd,
      isLoading,
      pageSize,
	  search_user
    } = this.data;
    console.log(searchKey);
    scrollLoadList({
      isEnd,
      isLoading,
      list,
      apiPost: getMomentsList,
      data:{
        page,
        pageSize,
		nickname:searchKey,
		// user_id:search_user
      },
      beforeLoad:() => {
        wx.stopPullDownRefresh()
        this.setData({
          isLoading: true,
          isShowAllPop: false
        })
      },
      afterLoad: ({lists,page,totalPage,total,isLoading,isEnd}) => {
        this.setData({
          isLoading,
          page,
          totalPage,
          list: lists,
          total,
          isEnd
        })
        // wx.stopPullDownRefresh()
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
  },
  /* 搜索 */
  bindSearch(e){
	  this.setData({searchKey: e.detail.value})
  },
  search(){
	this.reloadData(this.data.searchKey);
  },
  viewUser(e){
	  console.log(e.currentTarget.dataset.id);
	  this.setData({
		  search_user:e.currentTarget.dataset.id
	  })
  },
  /* 到详情页 */
  goView(e){
	 let id = e.currentTarget.dataset.id;
	 wx.navigateTo({
	   url: '/pages/moments/detail?id='+id,
	 })
  },
  /**
   * 点赞
   */
  like(e){
    if(this.data.userInfo)
    {
      wx.showLoading({
        title: '处理中……',
        mask:true
      })
      const id = e.currentTarget.dataset.id
      const index = e.currentTarget.dataset.index
      const user = this.data.userInfo
      console.log(user)
      const like = {id:user.id,nickname:user.nickname}

      const list = this.data.list
      console.log(index)
      addMomentLike({id}).then(res=>{
        list[index].hasLike = 1
        list[index].like.unshift(like)
        console.log(list[index].like)
        this.setData({
          list
        })
        wx.hideLoading({
          success: (res) => {},
        })
      })
    }
    else
    {
      wx.showToast({
        title: '请先登录再点赞',
        duration : 2000,
        icon : 'none'
      })
    }
  },
  /**
   * 取消点赞
   */
  notLike(e){
    wx.showLoading({
      title: '处理中……',
      mask:true
    })
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const likeIndex = e.currentTarget.dataset.like_index
    
    const list = this.data.list
    console.log(likeIndex,list[index].like[likeIndex])
    
    delMomentLike({id}).then(res=>{
      list[index].hasLike = 0
      list[index].like.splice(likeIndex,1)
      this.setData({
        list
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })
  },
  /**
   * 关注
   */
  attention(e){
    if(this.data.userInfo)
    {
      wx.showLoading({
        title: '处理中……',
        mask:true
      })
      const id = e.currentTarget.dataset.id
      const index = e.currentTarget.dataset.index
      // const user = this.data.userInfo
      // console.log(user)
      // const attention = {id:user.id,nickname:user.nickname}

      const list = this.data.list
      console.log(index)
      addMomentAttention({user_id:id}).then(res=>{
        list[index].hasAttention = 1
        // list[index].attention.unshift(attention)
        // console.log(list[index].attention)
        // this.setData({
        //   list
        // })
        wx.hideLoading({
          success: (res) => {},
        })
      })
    }
    else
    {
      wx.showToast({
        title: '请先登录再关注',
        duration : 2000,
        icon : 'none'
      })
    }
  },
  /**
   * 取消关注
   */
  notAttention(e){
    wx.showLoading({
      title: '处理中……',
      mask:true
    })
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    // const likeIndex = e.currentTarget.dataset.like_index
    
    const list = this.data.list
    // console.log(likeIndex,list[index].like[likeIndex])
    
    addMomentAttention({user_id:id}).then(res=>{
      list[index].hasAttention = 0
      // list[index].like.splice(likeIndex,1)
      // this.setData({
      //   list
      // })
      wx.hideLoading({
        success: (res) => {},
      })
    })
  },
  /**
   * 
   * 评论
   */
  comment(e){
    console.log(e)
    this.setData({
      isInput : true,
      focusInput : true,
      commentContent: '',
      momentsId : e.currentTarget.dataset.momentsid,
      commentId : e.currentTarget.dataset.commentid
    })
  },

  /**
   *  提交评论
   * */ 
  submitComment(){
    if(this.data.userInfo)
    {
      wx.showLoading({
        title: '处理中……',
        mask:true
      })
      const comment_id = this.data.commentId
      const moments_id = this.data.momentsId
      const comment = this.data.commentContent
      const list = this.data.list
      addMomentComment({comment_id,moments_id,comment}).then(res=>{
        this.reloadData()
        wx.hideLoading({
          success: (res) => {},
        })
      })
    }
    else
    {
      wx.showToast({
        title: '请先登录再评论',
        duration : 2000,
        icon : 'none'
      })
    }
  },


  inputFocus(e) {
    console.log(e, '键盘弹起')
    const inputTop = this.data.windowHeight - e.detail.height
    this.setData({
      inputTop: inputTop,
      height:e.detail.height,
      isInput: true
    })
  },
  inputBlur() {
    console.log('键盘收起')
    this.setData({
      isInput: false
    })
  },
 
  focusButn: function () {
    this.setData({
      focusInput: true,
      isInput: true
    })
  },
  /**
   * 输入框
   */
  inputText(e){
    this.setData({
      commentContent: e.detail.value
    })
  },
  /**
   * 删除朋友圈
   */
  delMoments(e){
    wx.showModal({
      title: '提示',
      content: '确定要删除这条骑友录吗？',
      success: res => {
        if (res.confirm) {
          delMoments({id:e.currentTarget.dataset.id}).then(res=>{
            this.reloadData()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})