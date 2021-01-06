// pages/myMission/list.js
const app = getApp()
import {scrollLoadList} from '../../utils/util'
import {
  informationList,
  delInformation,
  endMission
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
    typeActive : 1,
    list:[],
    // listHeitht : app.globalSystemInfo.contentHeight - 100,
    isRefresh: false,
    isLoading:false,
    isEnd: false,
    page: 1,
    pageSize: 10,
    totalPage: 1,
    total: 1,
    triggered: false,
    userInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.chengeNeed()
    const {
      contentHeight,
    } = app.globalSystemInfo;
    this.setData({
      listHeight:contentHeight
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
    if (cache.get('userInfo')) {
      getUser().then(res => {
        this.reloadData()
        this.setData({
          userInfo:res
        })
      })
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
  onShareAppMessage: function () {

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
  // 点击切换状态
  changeStatus(e) {
    const {type} = e.currentTarget.dataset
    this.setData({
      page: 1,
      list: [],
      isEnd: false,
      isLoading: false,
      typeActive : type
    },() => {
      // app.globalData.myMissionType = type
      this.reloadData()
    })
  }, 
  // 重新加载数据
  reloadData() {

    this.setData({
      isEnd: false,
      page: 1,
      list: [],
    },() => {
      this.searchList()
    })
  },
  searchList() {
    let {
      page,
      list,
      isEnd,
      isLoading,
      pageSize
    } = this.data;

    scrollLoadList({
      isEnd,
      isLoading,
      list,
      apiPost: informationList,
      data:{
        page,
        pageSize,
        user_id : this.data.userInfo.id,
        cate_id : 0
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
  // 删除
  handleDel(e){
    const item = e.currentTarget.dataset
    wx.showModal({
      cancelColor: 'cancelColor',
      title : '删除任务',
      content: '即将删除' + item.title + '，是否继续？',
      success : res =>{
        if(res.cancel){
          console.log('quxiao')
        }else if(res.confirm){
          delInformation({ids:item.id}).then(res=>{
            wx.showToast({
              title: '删除成功'
            })
            setTimeout(() => {this.reloadData()},1000)
          })
        }
      }
    })
  },
  // 结束任务
  handleEnd(e){
    const item = e.currentTarget.dataset
    wx.showModal({
      cancelColor: 'cancelColor',
      title : '结束任务',
      content: '即将结束' + item.title + '，是否继续？',
      success : res =>{
        if(res.cancel){
          console.log('quxiao')
        }else if(res.confirm){
          endMission({id:item.id}).then(res=>{
            wx.showToast({
              title: '操作成功'
            })
            setTimeout(() => {this.reloadData()},1000)
          })
        }
      }
    })
  }
})