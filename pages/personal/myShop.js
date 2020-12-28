// pages/personal/feedback.js
const chooseLocation = requirePlugin('chooseLocation');
const app = getApp()
import {
  updateShop
} from '../../api/api'
import {md5} from '../../utils/md5'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadImg:[],
    keys:[],
    getId:0,
    form:{
      shop_name:'',
      shop_tel:'',
      img:'',
	  open_time:'09:00',
	  close_time:'18:00',
	  server_item:[],
	  help_item:[]
    },
	shop:{},
	itemNum:[
		{id:1,title:'',price:0}
	],
	type:1,
	// 弹窗
	showMask:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.chengeNeed()
    this.setData({
      getId:options.id
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
    const location = chooseLocation.getLocation();
	console.log(location);
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
  changeTitle:function(e){
    this.data.form.shop_name = e.detail.value
    this.setData({
      form:this.data.form
    })
  },
  changeContent:function(e){
    this.data.form.content = e.detail.value
    this.setData({
      form:this.data.form
    })
  },
  changeTel:function(e){
    this.data.form.shop_tel = e.detail.value
    this.setData({
      form:this.data.form
    })
  },
  /**
   * 选择照片
   */
  takePhoto() {
    
    let {uploadImg} = this.data
    if (this.data.uploadImg.length >= 6) {
      wx.showToast({
        title: '最多选6张图片',
        icon: 'none'
      })
      return
    }
    wx.chooseImage({
      count: 6 - uploadImg.length,
      // sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        let uploadList = this.data.uploadImg
        tempFilePaths.forEach((item,index) => {
          uploadList.push(item)
          this.upload({item,index})
        })
        this.setData({
          uploadImg: uploadList
        })
      }
    })
  },


  /**
   * 上传照片或者视频
   */
  upload : function(data){
    let {token} = this.data
    const key = md5(new Date().getTime() + data.index + '')
    let keys = this.data.keys
    keys.push(key)
    this.setData({
      keys
    })

    wx.uploadFile({
      url: this.data.uploadUrl,
      filePath: data.item,
      name: 'file',
      formData: {
        token,
        key
      },
      success: (res)=>{
        const data = JSON.parse(res.data)
        
      }
    })
  },
  /**
   * 删除照片
   */
  del(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.uploadImg;
    let keys = this.data.keys;
    wx.showModal({
      title: '确认删除此图片吗？',
      success: (res) => {
        if (res.confirm) {
          list.splice(index,1)
          keys.splice(index,1)
          this.setData({
            uploadImg: list,
            keys:keys
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   *  选择用户位置
   */
  chooseAddress : function(){
    const key = 'GQZBZ-ABDHS-6ZPOH-6P2WY-RPQGZ-PPFV5'; //使用在腾讯位置服务申请的key
    const referer = '骑行帮'; //调用插件的app的名称
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`
    });
  },
  /**
   * 表单提交
   */
  submit(){
    let {keys,form} = this.data
	console.log(form);
    if(form.shop_name === ''){
      wx.showToast({
        title: '请填写标题',
        icon : 'none',
        mask: true
      })
      return
    }

    if(form.shop_tel === ''){
      wx.showToast({
        title: '请填联系方式',
        icon : 'none',
        mask: true
      })
      return
    }
	var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(form.shop_tel)) {
      wx.showToast({
        title: '手机号码不正确',
        icon : 'none',
        mask: true
      })
      return
    }

    if(keys.length === 0){
      wx.showToast({
        title: '请拍摄照片',
        icon : 'none',
        mask: true
      })
      return
    }

    wx.showLoading({
      title: '发表中...',
      mask: true
    })
    var video = '';
    var images = '';
 
    images = keys.join(',')
   
	form.img = images;
	form.address = this.data.shop;
	 console.log("显示内容____",form)
    updateShop(form).then(res => {
      if (res.code == '1'){
        wx.showToast({
          title: '我的店铺更新成功'
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    })
    
  },
  addItem:function(){
	  let itemNum = this.data.itemNum;
	  let newItem = {
		  title:'',
		  price:0,
		  id:itemNum.length
	  }
	  itemNum.push(newItem);
	  this.setData({
		  itemNum
	  })
  }, 
  reduceItem:function(e){
	  
	  let index = e.currentTarget.dataset.index;
	  let itemNum = this.data.itemNum;
	  if(itemNum.length <= 1){
		  wx.showToast({
		    title: '修车项目至少为一项',
		  	icon:'none'
		  })
		  return;
	  }
	  console.log(itemNum);
	 itemNum.splice(index,1)
	  this.setData({
		  itemNum
	  })
  },
  changeTtile:function(e){
	  let index = e.currentTarget.dataset.index;
	  let value = e.detail.value;
	  let itemNum = this.data.itemNum;
	  itemNum[index].title = value;
	   this.setData({itemNum:itemNum})
  },
  changePrice:function(e){
  	  let index = e.currentTarget.dataset.index;
  	  let value = e.detail.value;
  	  let itemNum = this.data.itemNum;
  	  itemNum[index].price = value;
  	  this.setData({itemNum:itemNum})
  },
  submitItem:function(){
	  let itemNum = this.data.itemNum;
	  
	  var itemArr = [];
	  console.log(itemNum);
	  itemNum.forEach(function(item,index,arr){
		  if(item.title != '' && item.price != ''){
			  itemArr.push(item)
		  }
	  })
	  
	  if(itemArr.length <= 0){
	  		  wx.showToast({
	  		    title: '有效修车项目至少为一项',
	  				icon:'none'
	  		  })
	  		  return;
	  }
	  if(type == 1){
		  this.setData({
		  		  'form.server_item':itemArr,
		  		  showMask:false
		  })
	  }else{
		 this.setData({
		 		  'form.help_item':itemArr,
		 		  showMask:false
		 }) 
	  }
	  
  },
  /* 弹窗 */
  openMask:function(e){
  	  this.setData({
  		  showMask:true,
  		  type:e.currentTarget.dataset.value
  	  })
  },
  closeMask:function(e){
	  let itemNum=[{id:1,title:'',price:0}];
	  this.setData({
		  showMask:false,
		  itemNum
	  })
  },
  returnFale(){
	  return;
  }
})