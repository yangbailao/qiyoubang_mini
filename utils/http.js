import { cache } from './cache.js'
import { getSign } from './util'
import { md5 } from './md5.js'
var BaseURL = 'https://dev.cunxiyuan.com'
BaseURL = 'http://www.qiyouapi.com'

export function http(opt) {
  const token = cache.get('token')
  // console.log('token', token)
  opt = opt || {}
  opt.url = opt.url || ''
  opt.data = opt.data || {}
  opt.method = opt.method || 'POST'
  opt.header = opt.header || {
    "content-type": "application/x-www-form-urlencoded"
  };
  // opt.header['appId'] = '1165818486098890752'
  // 请求头携带token
  if (token) {
    opt.header['TOKEN'] = token
  }
  // 每个接口添加时间戳、签名
  if (opt.data) {
    const {sign, time} = getSign(opt.data)
    opt.data.sign = sign
    opt.data.timestamp =time
  }

  opt.success = opt.success || function () { };

  wx.request({
    url: BaseURL + opt.url,
    data: opt.data,
    method: opt.method,
    header: opt.header,
    dataType: 'json',
    success: function (res) {
      if (res.statusCode !== 200) {
        wx.showToast({
          title: '服务器错误！',
          image: '/images/close.png'
        })
      } else {
        opt.success(res.data);
        if (res.data.code != '1') {
          wx.showToast({
            icon: 'none',
            title: res.data.data
          });
        }
      }
    },
    fail: function () {
      wx.showToast({
        title: '请求失败了',
        image: '/images/close.png'
      })
    }
  })
}