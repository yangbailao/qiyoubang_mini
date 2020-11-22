// pages/shop/detail.js
import {
  getShopById,
  getQiniu,
  fetchCollection
} from '../../api/api'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.chengeNeed()
    this.setData({
      id : options.id
    })

    this.getDetail()

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
  // 获取店铺详情
  getDetail(){
    wx.showLoading({
      title: '加载中',
      mask : true
    })
    getShopById({id:this.data.id}).then(
      res=>{
        this.setData({
          detail : res.data.shop,
          comments : res.data.comments
        })
        wx.hideLoading()
      }
    )
  },
  // 预览图片
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
  // 收藏店铺
  touchToCollection:function(){
    let that = this
    let data = {'shop_id':that.data.id}
    fetchCollection(data).then((res) => {
      if(res.code == 1) {
        if(that.data.detail.favor == 0) {
          wx.showToast({
            title: '收藏成功',
          })
        } else {
          wx.showToast({
            title: '取消收藏成功',
            icon:'none'
          })
        }
        that.getDetail()
      } else {
        wx.showToast({
          title: '收藏失败',
          icon:'none'
        })
      }
    })
  }
})