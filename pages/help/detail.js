// pages/help/detail.js
import {
  fetchHelpDetail,
  getWorkerCate,
  getQiniu,
  fetchWorkerCollection
} from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : 0,
    detail : null,
    userInfo : null,
    showAccpte:false,
    allCategory:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id : options.id,
      showAccpte:options.showAccpte?options.showAccpte:false
    })
    
    

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
    fetchHelpDetail({id:this.data.id}).then( res => {
      let cateTitle = [];
      res.data.cateArr.forEach(element => {
        cateTitle.push(element['title']);
      });
      cateTitle = cateTitle.join(',');
      this.setData({
        detail : res.data,
        cateTitle,
        comments : res.data.workerComment
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })
    
  },
  // 收藏店铺
  touchToCollection:function(){
    if(this.data.userInfo)
    {
      let data = {'worker_id':this.data.id}
      fetchWorkerCollection(data).then((res) => {
        if(res.status== 200) {
          if(this.data.detail.favor == 0) {
            wx.showToast({
              title: '收藏成功',
            })
            this.setData({
              'detail.favor':0
            })
            console.log(this.data.detail.favor)
          } else {
            wx.showToast({
              title: '取消收藏成功',
              icon:'none'
            })
            this.setData({
              'detail.favor':1
            })
            console.log(this.data.detail.favor)
          }
          this.getDetail()
        } else {
          wx.showToast({
            title: '收藏失败',
            icon:'none'
          })
        }
      })
    }
    else
    {
      wx.showToast({
        title: '请先登录再收藏',
        duration : 2000,
        icon : 'none'
      })
    }
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