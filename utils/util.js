import { md5 } from './md5.js'

const formatTime = time => {
  const date = new Date(time * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const getSign = (params) => {
  // params.nonceStr = md5(postUrl + Date.parse(new Date()) + Math.round(Math.random() * 10));
  const AppSecret = '123'
  let content;
  if (typeof params === 'string') {
    content = params
  } else if (typeof params === 'object') {
    var arr = []
    for (var i in params) {
      arr.push(i + '=' + params[i])
    }
    content = arr.join('&')
  }
  let time = new Date().getTime();
  const timestamp = `timestamp=${time}`
  const url = content + (content ? `&${timestamp}` : timestamp )
  const urlStr = url.split('&').sort().join('&')
  const newUrl = urlStr + '&key=' + AppSecret
//   console.log(newUrl)
//   const md5str = md5(newUrl)
//   return newUrl
  return { sign: md5(newUrl), time }
}

const checkPhone = (val) =>{ 
  // 验证手机号码
  return (/^1[3456789]\d{9}$/.test(val)) 
}

const scrollLoadList = (status) => {
  let {isEnd,isLoading,apiPost,beforeLoad,list,afterLoad,data} = status
  if (!isEnd && !isLoading) {
    data.page < 2 && wx.showLoading({title: '加载中...', mask: true})
    beforeLoad()
    apiPost(data).then(result => {
      let totalPage = Math.ceil(result.data.total / data.pageSize);
      data.page = totalPage >= data.page ? (++data.page) : totalPage;
      wx.hideLoading()
      afterLoad({
        lists: [...list,...result.data.list],
        page:data.page,
        totalPage,
        isLoading: false,
        isEnd: totalPage < data.page || totalPage === 0,
        total:result.data.total,
        currentDate: result.headerDate
      })
    }).catch(() => {
      afterLoad({
        lists: [],
        page:1,
        totalPage: 15,
        isLoading: false,
        isEnd: true,
        total: 0
      })
    })
  }
}

module.exports = {
  formatTime,
  getSign,
  checkPhone,
  scrollLoadList
}
