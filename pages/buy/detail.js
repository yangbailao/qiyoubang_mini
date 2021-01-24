// pages/help/detail.js
import {
  activitesDetail,
  buyGoods,
  createOrder,
  getWorkerCate,
  getQiniu,
  fetchWorkerCollection
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
    activitesDetail({activities_id:this.data.id}).then( res => {
      this.setData({
        detail : res.data,
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
  //购买
  buy(){

      if(this.data.userInfo)
      {
       let detail = this.data.detail;
        let data = {'goods_id':detail.goodsInfo.goods_id,'activities_id':detail.activities_id}
        buyGoods(data).then((res) => {
          console.log(res);
          if(res.status== 200) {
            let data = {'activities_id':res.data}
            createOrder(data).then((resPay) => {
              console.log(resPay);
              if(resPay.status== 200) {
                let data = resPay.data;
                  wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: 'MD5',
                    paySign: data.paySign,
                    success (payRes) {
                      console.log(payRes);
                     },
                    fail (payRes) {
                      console.log(payRes);
                     }
                  })
              } else {
                wx.showToast({
                  title: '支付失败',
                  icon:'none'
                })
              }
            })
          } else {
            wx.showToast({
              title: '订单创建失败',
              icon:'none'
            })
          }
        })
      }else{
        wx.showToast({
          title: '请先登录',
          duration : 2000,
          icon : 'none'
        })
    }
  },
  goTo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }
  
  
  
})