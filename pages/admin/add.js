// pages/admin/add.js
const chooseLocation = requirePlugin('chooseLocation');
import {
  updateShop,getShopList,getShopById,delShop
} from '../../api/api';
import {scrollLoadList} from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData:{},
    tabIndex: 0,
    isEnd: false,
    isLoading: false,
    list:[],
    listData:{
      page: 1,
      pageSize: 5,
      totalPage: 1,
      total: 1,
    },
    shop:{

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      latitude: options.latitude,  
      longitude: options.longitude,
    })
    console.log(that.data)
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
    const location = chooseLocation.getLocation();
    if(location)
    {
      this.setData({
        'shop.map_name' : location.name,
        'shop.address' : location.address,
        'shop.district' : location.district,
        'shop.city' : location.city,
        'shop.province' : location.city,
        'shop.latitude' : location.latitude,
        'shop.longitude' : location.longitude,
      });
    }

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
    this.reloadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getShopList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   *  选择用户位置
   */
  chooseAddress : function(){
    const key = 'GQZBZ-ABDHS-6ZPOH-6P2WY-RPQGZ-PPFV5'; //使用在腾讯位置服务申请的key
    const referer = '骑友帮'; //调用插件的app的名称
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`
    });
  },

  /**
   * 更新店铺
   */
  updateShop : function(){
    wx.showLoading({
      title: '提交中...'
    })
    // console.log(this.data.formData)
    var requestData = Object.assign({}, this.data.shop)
    // 店铺录入
    updateShop(requestData).then(result => {
      wx.hideLoading()
      wx.showToast({
        title: requestData.id ? '编辑成功' : '添加成功',
      })
      this.setData({
        shop : {}
      })
    })
  },

  changeTel : function(e){
    this.setData({
      'shop.shop_tel': e.detail.value
    })
  },

  changeBoss : function(e){
    this.setData({
      'shop.shop_boss': e.detail.value
    })
  },

  changeName : function(e){
    this.setData({
      'shop.shop_name': e.detail.value
    })
  },

  switchTab : function(e){
    const index = e.currentTarget.dataset.index
    this.setData({
      tabIndex : index,
      'listData.page':1,
      list:[],
      isEnd : false,
      isLoading : false,
      shop : {}
    })
    if(index == 1) this.getShopList()
  },

  /**
   * 重新加载本页数据
   */
  reloadData : function(){
    this.setData({
      'listData.page':1,
      list:[],
      isEnd : false,
      isLoading : false
    })
    this.getShopList();
  },

  /**
   * 获取店铺列表
   */
  getShopList : function() {
    // console.log(this.data.listData)
    let {isEnd,isLoading} = this.data;
    var requestData = Object.assign({}, this.data.listData)
    scrollLoadList({
      isEnd,
      isLoading,
      list:this.data.list,
      apiPost: getShopList,
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

  /**
   * 获取店铺详情
   */

  getShop : function(id)
  {
    wx.showLoading({
      title: '加载中',
    })
    getShopById({id:id}).then(res => {
      wx.hideLoading()
      const data = res.data;
      this.setData({
        'shop.shop_name' : data.shop_name,
        'shop.shop_boss' : data.shop_boss,
        'shop.shop_tel' : data.shop_tel,
        'shop.map_name' : data.name,
        'shop.address' : data.address,
        'shop.district' : data.district,
        'shop.city' : data.city,
        'shop.province' : data.city,
        'shop.latitude' : data.latitude,
        'shop.longitude' : data.longitude,
        'shop.id' : data.id
      })
    })
  },

  /**
   * 编辑店铺
   */
  edit : function(e)
  {
    const id = e.currentTarget.dataset.id
    this.setData({
      tabIndex : 0,
      'listData.page':1,
      list:[],
      isEnd : false,
      isLoading : false
    });
    this.getShop(id)
  },
  /**
   * 删除确认
   */
  del(e) {
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该店铺信息吗？',
      success: res => {
        if (res.confirm) {
          this.sendDel(id)
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
    
  },
  /**
   * 发送删除请求
   */
  sendDel(id){

    wx.showLoading({title: '删除中...',mask:true})
    delShop({id}).then(res => {
      wx.showToast({title: '删除成功'})
      this.reloadData()
    })
  },
  /**
   * 在地图中显示店铺位置
   */
  showShopInMap : function(e){
    const data = e.currentTarget.dataset.shop;
    console.log(data)
    wx.navigateTo({
      url: '/pages/admin/shop_location?shop_name='+data.shop_name+'&latitude='+data.latitude+'&longitude='+data.longitude,
    })
  }
})