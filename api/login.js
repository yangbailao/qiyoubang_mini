import {
  login,
  getUserInfo, fetchIndex
} from './api';
import { cache } from '../utils/cache.js';
const app = getApp()

export function getUser(){
  return new Promise((resolve) => {
    getUserInfo().then(res => {
      console.log(res.data,'用户信息');
      if (res.status == 200) {

let userInfo = {
  avatarUrl: res.data.avatar_url,
  nickName: res.data.nickname,
  gender: res.data.gender,
  tel: res.data.tel,
  status: res.data.status,
  id :res.data.id,
  service_shop_id: res.data.service_shop_id
};

let new_userInfo = JSON.stringify(userInfo);
      app.globalData.userInfo = userInfo;
        cache.set('userInfo',new_userInfo )
        resolve(res.data)
      }
    })
  })
}

/**
 * wxUser:微信授权成功返回信息
 * 
 * */ 
export function loginUser(wxUser){
  return new Promise((resolve) => {
    wx.login({
      success:(res) => {
        // console.log('微信登录返回信息',res)
        if (res.code) {
          //发起网络请求
          login({
            code:res.code,
            nickName: wxUser.nickName,
            gender: wxUser.gender,
            avatarUrl: wxUser.avatarUrl
          }).then(data => {
            // console.log(data.data,'微信授权信息')
            cache.set('token', data.data.token)
            app.globalData.userInfo = wxUser
            wx.hideLoading()
            resolve(data)
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  })
}

export function getIndex(){
  return new Promise((resolve) => {
    fetchIndex().then(res => {
      // console.log(res);
      if (res.status == 200) {
        resolve(res.data)
      }
    })
  })
}