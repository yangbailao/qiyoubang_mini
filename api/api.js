import { http } from '../utils/http.js'
// import { cache } from '../utils/cache.js'

// 店铺更新
export function updateShop(data) {
  return new Promise((resolve, reject) => {
    http({
      url: '/mini_api/shop/update',
      data,
      success: function (data) {
        console.log('店铺添加', data)
        resolve(data)
      }
    })
  })
}

// 店铺删除
export function delShop(data) {
  return new Promise((resolve, reject) => {
    http({
      url: '/mini_api/shop/del',
      data,
      success: function (data) {
        console.log('店铺删除', data)
        resolve(data)
      }
    })
  })
}

// 店铺列表
export function getShopList(data) {
  return new Promise((resolve, reject) => {
    http({
      url: '/mini_api/shop/getList',
      data,
      success: function (data) {
        console.log('店铺列表', data)
        resolve(data)
      }
    })
  })
}

// 店铺详情
export function getShopById(data) {
  return new Promise((resolve, reject) => {
    http({
      url: '/mini_api/shop/getById',
      data,
      success: function (data) {
        console.log('店铺详情', data)
        resolve(data)
      }
    })
  })
}

// 添加店铺评价
export function shopCommentAdd(data) {
  return new Promise((resolve, reject) => {
    http({
      url: '/mini_api/shop_comment/add',
      data,
      success: function (data) {
        console.log('添加店铺评价', data)
        resolve(data)
      }
    })
  })
}

// 店铺服务分类
export function getShopServiceCate(data) {
  return new Promise((resolve, reject) => {
    http({
      url: '/mini_api/shop_service_cate/getList',
      data,
      success: function (data) {
        console.log('店铺服务分类', data)
        resolve(data)
      }
    })
  })
}

// 登录
export function login(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/login/index',
      data,
      success: function (data) {
        console.log('登录回调', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 用户信息
export function getUserInfo() {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/User/getUserInfo',
      success: function (data) {
        console.log('用户信息', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 发表朋友圈评论
export function addMomentComment(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/MomentsComment/add',
      data,
      success: function (data) {
        console.log('发表朋友圈评论', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 发表朋友圈
export function momentAdd(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/Moments/add',
      data,
      success: function (data) {
        console.log('发表朋友圈', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 删除朋友圈
export function delMoments(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/Moments/del',
      data,
      success: function (data) {
        console.log('删除朋友圈', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

//朋友圈列表
export function getMomentsList(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/Moments/getList',
      data,
      success: function (data) {
        console.log('朋友圈列表', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

//朋友圈点赞
export function addMomentLike(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/moments_like/add',
      data,
      success: function (data) {
        console.log('点赞', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

//朋友圈取消点赞
export function delMomentLike(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/moments_like/del',
      data,
      success: function (data) {
        console.log('取消点赞', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}


// 获取上传token、key
export function getUploadToken() {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/qiniu/getToken',
      success: function (data) {
        console.log('获取上传token、key', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 获取七牛配置信息
export function getQiniu() {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/qiniu/getQiniu',
      success: function (data) {
        console.log('获取上传token、key', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 获取任务分类
export function getMissionCate() {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/mission_cate/getList',
      success: function (data) {
        console.log('任务分类', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 任务列表
export function missionList(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/mission/getList',
      data,
      success: function (data) {
        console.log('任务列表', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 发布任务
export function missionUpdate(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/mission/update',
      data,
      success: function (data) {
        console.log('发布任务', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 任务详情
export function getMissionById(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/mission/getById',
      data,
      success: function (data) {
        console.log('任务详情', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 删除任务
export function delMission(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/mission/del',
      data,
      success: function (data) {
        console.log('删除任务', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 结束任务
export function endMission(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/mission/updateStatus',
      data,
      success: function (data) {
        console.log('结束任务', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}



// 获取信息分类
export function getInformationCate() {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/information_cate/getList',
      success: function (data) {
        console.log('任务分类', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 信息列表
export function informationList(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/information/getList',
      data,
      success: function (data) {
        console.log('信息列表', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 发布便民信息
export function informationUpdate(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/information/update',
      data,
      success: function (data) {
        console.log('发布便民信息', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 信息详情
export function getInformationById(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/information/getById',
      data,
      success: function (data) {
        console.log('信息详情', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 删除任务
export function delInformation(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/information/del',
      data,
      success: function (data) {
        console.log('删除任务', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 更新用户信息
export function updateUser(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user/update',
      data,
      success: function (data) {
        console.log('更新用户信息', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

/**
 * 下面开始是乐竞购的接口
 */
// 发送验证码
export function sendCode(tel) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user_tel_code/sendCode',
      data: {
        tel
      },
      success: function (data) {
        console.log('验证码回调', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 绑定手机号
export function bindPhone(data) {
  return new Promise((resolve, reject) => {
    http({
      url: '/mini_api/User/bindTel',
      data,
      success: function (data) {
        console.log('绑定手机号', data)
        if (data.code == '1') {
          resolve(data)
        } else {
          reject(data)
        }
      }
    })
  })
}

// 商品列表（分类列表）
export function goodList(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/auction/getList',
      data,
      success: function (data) {
        console.log('商品列表', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 商品详情
export function goodDetail(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/auction/getByid',
      data,
      success: function (data) {
        console.log('商品详情', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 全局数据（系统配置）
export function globalInfo(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/system_config/getConfig',
      data,
      success: function (data) {
        console.log('全局数据（系统配置）', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 报名状态（是否已报名活动）
export function getAuctionStatus(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/auction_sign_up/signUpCheck',
      data,
      success: function (data) {
        console.log('报名状态', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 点击报名活动按钮
export function signUpPost(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/auction_sign_up/signUp',
      data,
      success: function (data) {
        console.log('点击报名操作', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 出价
export function bidPost(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/auction_detail/bid',
      data,
      success: function (data) {
        console.log('出价', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 创建订单
export function createOrder(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/trade/create',
      data,
      success: function (data) {
        console.log('创建订单', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 商品分类（导航）
export function getCategory() {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/goods_cate/getList',
      success: function (data) {
        console.log('商品分类', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 我的活动
export function myAuction(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/auction_sign_up/myAuction',
      data,
      success: function (data) {
        console.log('我的活动', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 我的订单（含已中标数据）
export function orderList(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/trade/getList',
      data,
      success: function (data) {
        console.log('我的订单（含已中标数据）', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 优惠券
export function getCoupon(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user_coupon/getList',
      data,
      success: function (data) {
        console.log('优惠券', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 收货地址列表
export function getAddress() {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user_Address/getList',
      success: function (data) {
        console.log('收货地址列表', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 新增收货地址
export function createAddress(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user_address/create',
      data,
      success: function (data) {
        console.log('新增收货地址', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 修改收货地址
export function updateAddress(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user_address/update',
      data,
      success: function (data) {
        console.log('修改收货地址', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 删除收货地址
export function delAddress(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user_address/del',
      data,
      success: function (data) {
        console.log('删除收货地址', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 支付报名费 
export function payWithBalance(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/auction_sign_up/payWithBalance',
      data,
      success: function (data) {
        console.log('支付报名费', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 支付
export function payment(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/pay/index',
      data,
      success: function (data) {
        console.log('支付', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 微信支付
export function paymentWeChat(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/pay/test2',
      data,
      success: function (data) {
        console.log('微信支付', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 确认收货
export function checkReceipt(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/trade/receipt',
      data,
      success: function (data) {
        console.log('确认收货', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}


// 评论
export function comment(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/goods_comment/create',
      data,
      success: function (data) {
        console.log('评论', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 我的收藏
export function favorList(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user_favor/getList',
      data,
      success: function (data) {
        console.log('我的收藏', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 添加收藏
export function favorEvent(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user_favor/create',
      data,
      success: function (data) {
        console.log('添加收藏产品', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 我的足迹
export function historyRecord(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user_history/getList',
      data,
      success: function (data) {
        console.log('我的足迹', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 添加足迹
export function addHistoryRecord(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user_history/record',
      data,
      success: function (data) {
        console.log('添加足迹', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 获取商品id跳转
export function getGoodId(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/auction/getAuctionIdByGoodsId',
      data,
      success: function (data) {
        console.log('获取商品id跳转', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 个人中心订单数字标签
export function getBadge(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/trade/getBadge',
      data,
      success: function (data) {
        console.log('个人中心订单数字标签', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 帮助中心列表
export function getHelpList(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/article/getList',
      data,
      success: function (data) {
        console.log('帮助中心列表', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 帮助详情
export function helpDetail(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/article/getByid',
      data,
      success: function (data) {
        console.log('帮助详情', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 砍价
export function bargainPost(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/trade/bargaining',
      data,
      success: function (data) {
        console.log('砍价', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}
// https://www.kuaidi100.com/query?type=shentong&postid=773039769480216&temp=0.31552077680839785

// 砍价
export function queryKd() {
  return new Promise((resolve) => {
    wx.request({
      url: 'https://www.kuaidi100.com/query?type=shentong&postid=773039769480216&temp=0.31552077680839785',
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res)
      },
      fail: function () {
        wx.showToast({
          title: '请求失败了',
          image: '/assets/images/close.png'
        })
      }
    })
  })
}

// 首页数据
export function fetchIndex(){
  return new Promise((resolve) => {
    http({
      url:'/mini_api/index/index',
      success:function(data){
        if(data.code == '1'){
          resolve(data)
        }
      }
    })
  })
}

// 价格列表
export function getPriceList(data) {
  return new Promise((resolve, reject) => {
    http({
      url: '/mini_api/shop_base_price/getList',
      data,
      success: function (data) {
        console.log('价格列表', data)
        resolve(data)
      }
    })
  })
}
// 收藏列表
export function fetchCollectionList(data){
  return new Promise((resolve) => {
    http({
      url:'/mini_api/user_favor/getList',
      data,
      success:function(res) {
        console.log("显示收藏",res)
        resolve(res)
      }
    })
  })
}
// 收藏/取消
export function fetchCollection(data){
  return new Promise((resolve) => {
    http({
      url:'/mini_api/user_favor/create',
      data,
      success:function(res) {
        console.log("收藏",res)
        resolve(res)
      }
    })
  })
}

// 评论列表
export function fetchCommentList(data){
  return new Promise((resolve) => {
    http({
      url:'/mini_api/shop_comment/myComment',
      data,
      success:function(res) {
        console.log("我的评论",res)
        resolve(res)
      }
    })
  })
}

// 意见反馈
export function upDateFeedback(data){
  return new Promise((resolve) => {
    http({
      url:'/mini_api/message/add',
      data,
      success:function(res) {
        console.log("意见反馈",res)
        resolve(res)
      }
    })
  })
}

// 接单
export function getTake(data){
  return new Promise((resolve) => {
    http({
      url:'/mini_api/mission/take',
      data,
      success:function(res) {
        console.log("接单",res)
        resolve(res)
      }
    })
  })
}

// 检查是否有未完成的操作
export function getCheckFinish(data){
  return new Promise((resolve) => {
    http({
      url:'/mini_api/mission/checkFinish',
      data,
      success:function(res) {
        console.log("是否有未完成",res)
        resolve(res)
      }
    })
  })
}
// 接任务反馈
export function getConfirmMission(data){
  return new Promise((resolve) => {
    http({
      url:'/mini_api/mission/confirmMission',
      data,
      success:function(res) {
        console.log("是否接任务",res)
        resolve(res)
      }
    })
  })
}

// 获取我来帮分类
export function getWorkerCate() {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/worker_cate/getList',
      success: function (data) {
        console.log('我来帮任务分类', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 我来帮信息列表
export function workerList(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user/getWorkerList',
      data,
      success: function (data) {
        console.log('我来帮信息列表', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}

// 我来帮信息详情
export function fetchHelpDetail(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user/getById',
      data,
      success: function (data) {
        console.log('我来帮信息详情', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}


// 信息列表
export function updateBindTel(data) {
  return new Promise((resolve) => {
    http({
      url: '/mini_api/user/bindTel',
      data,
      success: function (data) {
        console.log('提交认证', data)
        if (data.code == '1') {
          resolve(data)
        }
      }
    })
  })
}
