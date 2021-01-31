// pages/mission/add.js

import {
  getInformationCate,
  informationUpdate,
  getInformationById
} from '../../api/api'
import {
  checkPhone
} from '../../utils/util.js'
import { cache } from '../../utils/cache.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      id:0,
      title:'',
      tel:'',
      cate_id:'',
      cate_title:'',
      locale:'',
      bouns:'',
      content:''
    },
    cateList:[],
    cateData:[],
    cateDataId :[],
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [], //下拉列表的数据
    index: 0, //选择的下拉列 表下标,
    maskFlag : false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.chengeNeed()
    const {
      navBarHeight,
      navBarExtendHeight,
      windowHeight,
      windowWidth
    } = app.globalSystemInfo;
    const rpxR =750 / windowWidth;
    let scrollHeight = windowHeight * rpxR - navBarExtendHeight * rpxR - navBarHeight * rpxR - 20;

    this.setData({
      scrollHeight
    });

    this.getCates()

    if(options.id > 0) this.getInformation(options.id)


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
  // 读取任务详情 - 编辑
  getInformation(id){
    getInformationById({id:id}).then(
      res => {
        const d = res.data.info
        this.setData({
          'form.content':d.content,
          'form.tel': d.tel,
          'form.cate_id': d.cate_id,
          'form.tel': d.tel,
          'form.title' : d.title,
          'form.id' : d.id,
          'form.cate_title' : this.data.cateDataId[d.cate_id].title
        })
      }
    )
  },

  // 读取任务分类
  getCates(){
    getInformationCate().then(res => {
      let cates=[],cateData=[],cateDataId=[];
      res.data.list.map(function(item,k,arr){
        cateDataId.push(item.id)
        cateData.push(item.title)
      })
      this.setData({
        selectData : cateData, // 用做选择的数组
        cateData : res.data.list, // 用做选中的选项内容的数组
        cateDataId : cateDataId, // 数组下标与分类id匹配的数组
        'form.cate_id':cateDataId[0]
      })
    })
  },

  // 选择分类
  showCate(){
    wx.showActionSheet({
      itemList: this.data.cateList,
      success : res => {
        this.setData({
          'form.cate_id' : this.data.cateData[res.tapIndex].id,
          'form.cate_title' : this.data.cateData[res.tapIndex].title
        })
        // console.log(this.data.cateData[res.tapIndex])
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },

  // 任务名称
  changeTitle(e){
    this.setData({
      'form.title': e.detail.value
    })
  },

  // 联系方式
  changeTel(e){
    this.setData({
      'form.tel': e.detail.value
    })
  },

  // 赏金
  changeBouns(e){
    this.setData({
      'form.bouns': e.detail.value
    })
  },

  // 任务地点
  changeLocale(e){
    this.setData({
      'form.locale': e.detail.value
    })
  },

  // 任务描述
  changeContent(e){
    this.setData({
      'form.content': e.detail.value
    })
  },

  /**
   * 表单提交
   */
  submit(){
    console.log(this.data.form)
    let {id,title,tel,cate_id,content} = this.data.form

    if(title === '' || tel === '' || cate_id === '' || content === '' || !checkPhone(tel)){
      // console.log(title === '' , tel === '' , cate_id === '' , bouns === '' , content === '',content)
      wx.showToast({
        title: '请填写完整的信息',
        icon:'none',
        mask: true
      })
      return
    }

    wx.showLoading({
      title: '提交中...',
      mask: true
    })

    informationUpdate({
      content:content,
      tel: tel,
      cate_id: cate_id,
      tel: tel,
      title : title,
      id : id
    }).then(res => {
      if (res.status== 200){
        wx.showToast({
          title: '发布成功'
        })


        wx.navigateBack({
          delta: 1,
        })
      }
    })
    
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show,
      maskFlag: !this.data.maskFlag
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show,
      maskFlag: !this.data.maskFlag,
      'form.cate_id' : this.data.cateData[Index].id,
    });
  },
})