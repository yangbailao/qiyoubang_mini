// pages/shop/list.js
const app = getApp()
import {scrollLoadList} from '../../utils/util'
import {
  getShopList,
  updateUser
} from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRefresh: false,
    isLoading:false,
    isEnd: false,
    isShowAllPop: false,
    list: [],
    page: 1,
    pageSize: 10,
    totalPage: 1,
    total: 1,
    lat:0,
    long:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.chengeNeed()
    const {
      contentHeight
    } = app.globalSystemInfo;

    let listHeight = contentHeight;
    this.setData({
      listHeight,
      lat : options.lat,
      long : options.long,
      act : options.act
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
  onAbort(e) {
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

  searchList() {
    let {
      page,
      list,
      cateActive,
      isEnd,
      isLoading,
      pageSize,
      lat,
      long
    } = this.data;
    
    scrollLoadList({
      isEnd,
      isLoading,
      list,
      apiPost: getShopList,
      data:{
        page,
        pageSize,
        lat,
        long
      },
      beforeLoad:() => {
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
  /**
   * 选择我的店铺
   */
  choose(e){
    const id = e.currentTarget.dataset.id
    updateUser({service_shop_id:id,fuck:'ddd'}).then(res=>{
      wx.navigateTo({
        url: '/pages/personal/myServiceShop',
      })
    })
  }
})