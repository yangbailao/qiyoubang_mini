// components/rate/rate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    imgs: [{
      id: 1
    }, {
      id: 2
    }, {
      id: 3
    }, {
      id: 4
    }, {
      id: 5
    }],
    starId: 0,
    src1: '/images/icon-stars-yes.svg',
    src2: '/images/icon-stars-no.svg',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    select(e) {
      this.data.starId = e.currentTarget.dataset.index;
      this.setData({
        starId: this.data.starId
      })
      this.triggerEvent('ratechange',this.data.starId)
    }
  }
})
