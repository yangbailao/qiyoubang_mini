// pages/certification/index.js
const chooseLocation = requirePlugin('chooseLocation');
const app = getApp()
import {
  getUploadToken,
  goWithdrawal,
  bindBank,
  getWorkerCate,
  sendCode,
  getUserInfo,
  fileUpload
} from '../../api/api'
import {
  loginUser,
  getUser
} from '../../api/login'
import {md5} from '../../utils/md5'
import { cache } from '../../utils/cache.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromData:{
      name:'',
      mobile:'',
      code:'',
      card:'',
      image1:'',
      image2:'',
      introduction:'',
      cateText:'',
      cate:'',
      bank_user:'',
      bank_name:'',
      bank_card:'',
      verify_id:''
    },
    image1:'',
    image2:'',
    verifyText:'获取验证码',
    countDown:0,
    indexPhoto:0,
    keys:[],
    token:'',
    uploadUrl:'',
    allCategory:[],
    money:0,
    max_money:0,
    shop:{

    },
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {






    // this.getCates()
    // getUploadToken().then(res => {
    //   this.setData({
    //     token: res.data.token,
    //     uploadUrl: res.data.uploadUrl,
    //   })
    // })
  },
  getUserInfo: function(e) {
    app.authAndLogin(e.detail.userInfo, loginUser).then(() => {
      getUser().then(() => {
        this.setUserInfo()
      })
    })
  },
  setUserInfo : function(){
    let gUserInfo = app.globalData.userInfo
    gUserInfo = gUserInfo ? gUserInfo : JSON.parse(cache.get('userInfo'))
    let {
      avatarUrl,
      nickName
    } = gUserInfo
    console.log(gUserInfo,888888)
    this.setData({
      avatarUrl,
      nickName,
      userInfo: gUserInfo,
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
  onShow:async function () {
    // const location = chooseLocation.getLocation();
    // if(location)
    // {
    //   this.setData({
    //     'shop.map_name' : location.name,
    //     'shop.address' : location.address,
    //     'shop.district' : location.district,
    //     'shop.city' : location.city,
    //     'shop.province' : location.city,
    //     'shop.latitude' : location.latitude,
    //     'shop.longitude' : location.longitude,
    //   });
    // }
          // 获取用户信息
          if (cache.get('userInfo')) {
            await getUser().then(async () => {
              await this.setUserInfo()
            })
          }else{
            await this.getUserInfo()
          }
          this.setData({
            ['fromData.mobile']:this.data.userInfo.tel,
            ['fromData.bank_name']:this.data.userInfo.bank_name,
            ['fromData.bank_card']:this.data.userInfo.bank_card,
            ['fromData.bank_user']:this.data.userInfo.bank_user
          })
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
  changeInput:function(e){
    let name = e.currentTarget.dataset.name
    let value = e.detail.value
    this.data.fromData[name] = value
    this.setData({
      fromData:this.data.fromData
    })
  },
   // 读取信息分类
   getCates(){
    getWorkerCate().then(res => {
      let list = res.data.list
      list.map((item,index) =>{
        item.selected = false
      })
      this.setData({
        allCategory : list
      })
    })
  },
  touchCate:function(e){
    let index = e.currentTarget.dataset.index
    this.data.allCategory[index].selected = !this.data.allCategory[index].selected
    this.setData({
      allCategory:this.data.allCategory
    })
  },
  getVerifyCode:function(){
    let that = this
    that.data.countDown = 60;
    if(this.data.fromData.mobile.length === 0) {
      wx.showToast({
        title: '请输入手机号码!',
        icon:'none',
        mask: true
      })
      return
    }
    // console.log(this.data.fromData.mobile)
    // return
    sendCode({mobile:this.data.fromData.mobile}).then((res) =>{
      if(res.status== 200) {
        this.setData({
          'fromData.verify_id':res.key
        })
        wx.showToast({
          title: '验证码已发送',
          mask:true
        })
      }
    })

    let interval = setInterval(function(){
      if(that.data.countDown > 0) {
        that.data.countDown --;
        that.setData({
          verifyText: that.data.countDown + 's后重试',
          countDown:that.data.countDown
        })
      } else {
        that.data.countDown = 0
        that.setData({
          verifyText:'获取验证码',
          countDown:that.data.countDown
        })
        clearInterval(interval)
      }
    }, 1000)
  },

  /**
   * 选择照片
   */
  takePhoto(e) {
    let index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 1,
      // sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        if(index == 1) {
          this.data.image1 = tempFilePaths[0]
        } else {
          this.data.image2 = tempFilePaths[0]
        }
        this.setData({
          image1: this.data.image1,
          image2:this.data.image2,
          indexPhoto:index
        })
        this.upload(tempFilePaths[0])
      }
    })
  },

  /**
   * 上传照片或者视频
   */
  upload : function(img){
    let {token} = this.data
    const key = md5(new Date().getTime() + '0' + '')
    let keys = this.data.keys
    keys.push(key)
    if(this.data.indexPhoto == 1) {
      this.data.fromData.image1 = this.data.uploadUrl + key
    } else {
      this.data.fromData.image2 = this.data.uploadUrl + key
    }
    this.setData({
      keys:keys,
      fromData:this.data.fromData
    })
    wx.uploadFile({
      url: this.data.uploadUrl,
      filePath: img,
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
  save:function(){
 
    const {fromData,keys,cate} = this.data
    // let cateText = this.data.fromData.cateText
    console.log(this.data)

    console.log(fromData)
    if(fromData.mobile.length === 0 || fromData.bank_name.length === 0|| fromData.bank_card.length === 0|| fromData.bank_user.length === 0 || fromData.code.length === 0 || fromData.verify_id.length === 0) {
      wx.showToast({
        title: '请输入完内容在提交！',
        icon:'none',
        mask: true
      })
      return
    }

    let data = {}

    let new_userinfo = this.data.userInfo;
    

    // data['realname'] = fromData.name
    // data['tel'] = fromData.mobile
    data['mobile'] = fromData.mobile
    data['verify_id'] = fromData.verify_id
    data['verify'] = fromData.code
    new_userinfo.bank_name = data['bank_name'] = fromData.bank_name
    new_userinfo.bank_card = data['bank_card'] = fromData.bank_card
    new_userinfo.bank_user = data['bank_user'] = fromData.bank_user
    // data['code'] = fromData.code
    // data['idcard'] = fromData.card
    // data['idcard_img_a'] = fromData.image1
    // data['idcard_img_b'] = fromData.image2
    // data['worker_desc'] = fromData.introduction
    // data['worker_cate'] = JSON.stringify(fromData.cate)

    // let shop = this.data.shop
    // data['map_name'] = shop.map_name
    // data['address'] = shop.address
    // data['district'] = shop.district
    // data['city'] = shop.city
    // data['province'] = shop.province
    // data['latitude'] = shop.latitude
    // data['longitude'] = shop.longitude
    // console.log(data);return;
    bindBank(data).then((res) =>{
      if(res.status== 200){
        wx.showToast({
          title: '信息已更新!',
          mask:true
        })



        let new_userInfo = JSON.stringify(new_userinfo);
        app.globalData.userInfo = new_userinfo;
        cache.set('userInfo', new_userInfo)


        setTimeout(function(){
          wx.switchTab({
            url: '/pages/index/index',
          })
        },1500)
      }
    })
  },
  selectCate(){
    // let t = [1,23]
    // let t2 = JSON.stringify(t)
    // let t3 = JSON.parse(t2)
    // console.log(t2,t3)

    // return
    if(this.data.fromData.cate != '')
    {
      console.log(typeof this.data.fromData.cate)
      const cates = JSON.stringify(this.data.fromData.cate) 
      const cateText = JSON.stringify(this.data.fromData.cateText)
      console.log(cates)
      wx.navigateTo({
        url: '/pages/certification/selectCate?cates='+cates+'&catesText='+cateText,
      })
    }
    else
    {
      wx.navigateTo({
        url: '/pages/certification/selectCate',
      })
    }
    
  },
    /**
   *  选择用户位置
   */
  chooseAddress : function(){
    const key = 'GQZBZ-ABDHS-6ZPOH-6P2WY-RPQGZ-PPFV5'; //使用在腾讯位置服务申请的key
    const referer = '我来帮'; //调用插件的app的名称
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`
    });
  },
})