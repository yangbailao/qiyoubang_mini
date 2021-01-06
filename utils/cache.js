const cache = {
  set(key, val, expire) {
    try {
      let data = ''
      let dataObj = ''
      if (data = wx.getStorageSync(key)) {
        dataObj = JSON.parse(data)
      }
      let curTime = data ? dataObj.saveTime : new Date().getTime()
      expire = expire ? (data ? dataObj.expire : (1000 * 60 * 60 * 24 * expire)) : null
      wx.setStorageSync(key, JSON.stringify({ data: val, saveTime: curTime, expire }))
    } catch (e) {
      console.log(e)
    }
  },
  get(key) {
    try {
      const data = wx.getStorageSync(key)
      if (data) {
        // console.log(data)
        const dataObj = JSON.parse(data)
        if (dataObj.expire && new Date().getTime() - dataObj.saveTime > dataObj.expire) {
          this.remove(key)
        } else {
          return dataObj.data
        }
      }
      return ''
    } catch (e) {
      console.log(e)
    }
  },
  remove(key) {
    try {
      wx.removeStorageSync(key)
    } catch (e) {
      // error
    }
  }
}

export {
  cache
}