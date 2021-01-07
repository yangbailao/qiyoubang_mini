Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    currentDate: {
      type: Number,
      value: 0
    },
    list: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        // console.log(newVal)
        // console.log(oldVal)
      }
    }
  },
  methods: {
    _created() {
      console.log('list-component：被创建了！')
      console.log(this.list)
    }
  },
  lifetimes: {
    created() {
      this._created()
    }
  }
})
