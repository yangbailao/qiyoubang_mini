// pages/certification/selectCate.js
import {
  getWorkerCate
} from '../../api/api'
// import { indexof } from '../../utils/util.wxs'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parentCate : [],
    sonCate: [],
    cruPartenCate : '',
    cruSonCate : '',
    cates : [],
    catesText : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCates()
    // console.log(options.catesText)
    if(options.cates){
      const cates = JSON.parse(options.cates)
      const catesText = JSON.parse(options.catesText)
      this.setData({
        cates,catesText
      })
      // console.log('dsdsd')
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
   * 读取分类
   */
  getCates(){
    getWorkerCate().then(res => {
      this.setData({
        parentCate: res.data.top,
        sonCate: res.data.sons,
        cruPartenCate:res.data.top[0].id
      })
    })
  },

  /**
   * 切换分类
   */
  changeCate(e){
    this.setData({
      cruPartenCate : e.currentTarget.dataset.id
    })
  },

  /**
   * 选择具体工种
   */
  chooseSon(e){
    const pages = getCurrentPages(); //获取页面栈堆
    const prev = pages[pages.length - 2]; //-2即为父级页面，想跳两层的话就-3


    // 选中工种保存id
    var ids = this.data.cates
    const id = Number(e.currentTarget.dataset.id);
    const index = ids.indexOf(id)
    if( index != -1 ){
      // 已选，去掉
      ids.splice(index, 1)
    }
    else
    {
      // 未选，增加
      ids.push(id)
      ids = Array.from(new Set(ids))
    }


    // 选中工种保存名称
    var texts = this.data.catesText
    const text = e.currentTarget.dataset.title
    if( index != -1 ){
      // 已选，去掉
      texts.splice(index, 1)
    }
    else
    {
      // 未选，增加
      texts.push(text)
      texts = Array.from(new Set(texts))
    }
    

    this.setData({
      cates : ids,
      catesText : texts
    })
    console.log(this.data.catesText)
    console.log(this.data.cates)

    prev.setData({ //用setData()的特性给父级页面赋值并重新渲染
      'fromData.cateText': texts,
      'fromData.cate': ids,
    })
  }
})