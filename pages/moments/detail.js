// pages/moments/detail.js
//获取应用实例
const app = getApp()
import {
  momentsDetail,
  getWorkerCate,
  getQiniu,
  addMomentAttention,
  addMomentComment,
  addMomentLike,
  delMomentLike
} from '../../api/api'
import {
  loginUser,
  getUser
} from '../../api/login'
import { cache } from '../../utils/cache.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : 0,
    detail : null,
    userInfo : null,
    showAccpte:false,
    allCategory:[],
    focusInput: false,
    comments:[],
    height: '',
    isInput: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();
    app.chengeNeed()
    this.setData({
      id : options.id,
      showAccpte:options.showAccpte?options.showAccpte:false
    })
    
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
    this.getDetail()
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
  onShareTimeline:function(res){

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
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  },

    // 读取信息分类
    getCates(){
      getWorkerCate().then(res => {
        let list = res.data.list
        list.map((item,index) =>{
          if(item.id == this.data.detail.worker_cate){
            this.data.detail['cateName'] = item.title
          }
        })
        this.setData({
          allCategory : res.data.allList,
          detail:this.data.detail
        })
      })
    },
  // 读取任务详情
  getDetail(){
    wx.showLoading({
      title: '加载中',
    })
    momentsDetail({id:this.data.id}).then( res => {
      this.setData({
        detail : res.data,
        comments : res.data.comment
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
      if(this.data.userInfo.id == this.data.detail.user_id){
        wx.showToast({
          title: '不能关注自己!',
          duration : 2000,
          icon : 'none'
        })
        return;
      }

      wx.showLoading({
        title: '处理中……',
        mask:true
      })

      addMomentAttention({user_id:this.data.detail.user_id}).then(res=>{
        this.setData({
          'detail.haseAttention':1
        })
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
    if(this.data.userInfo){
      wx.showLoading({
        title: '处理中……',
        mask:true
      })
  
      if(this.data.userInfo.id == this.data.detail.user_id){
        wx.showToast({
          title: '不能关注自己!',
          duration : 2000,
          icon : 'none'
        })
        return;
      }
  
      addMomentAttention({user_id:this.data.detail.user_id}).then(res=>{
       
        this.setData({
          'detail.haseAttention':0
        })
        wx.hideLoading({
          success: (res) => {},
        })
      })
    }else{
      wx.showToast({
        title: '请先登录再关注',
        duration : 2000,
        icon : 'none'
      })
    }
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
      addMomentLike({moments_id:this.data.detail.id}).then(res=>{
        let num = this.data.detail.likeNum;
        this.setData({
          'detail.hasLike':1,
          'detail.likeNum':num+1
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
    if(this.data.userInfo)
    {
      wx.showLoading({
        title: '处理中……',
        mask:true
      })
      delMomentLike({ids:this.data.detail.id}).then(res=>{
        let num = this.data.detail.likeNum;
        this.setData({
          'detail.hasLike':0,
          'detail.likeNum':num-1
        })
        wx.hideLoading({
          success: (res) => {},
        })
      })
    }else{
      wx.showToast({
        title: '请先登录再点赞',
        duration : 2000,
        icon : 'none'
      })
    }

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
      addMomentComment({comment_id,moments_id,comment}).then(res=>{

        let cArr = this.data.detail.comments;
        let last = cArr.length-1;
        let id =  cArr[last]['id']++
        let newComment = {
          id:id,
          moments_id:moments_id,
          user_id:this.data.userInfo.id,
          comment_id:comment_id,
          comment:comment,
          create_at:new Date().getTime()/1000,
          userinfo:{
            nickname:this.data.userInfo.nickname,
            avatar_url:this.data.userInfo.avatar_url,
          }
        }
        cArr.splice(0,0,newComment);
        this.setData({
          'comments':cArr
        })
  
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
  //拨打电话
  call(){
    wx.makePhoneCall({
      phoneNumber: this.data.detail.tel,
    })
  },
  goTo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }
  
  
  
})