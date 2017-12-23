//category.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hiddenLoading: false,
    itemArray: [],
    page: 1,
    pagecount: 1,
    query: null
  },
  onShareAppMessage: function () {
    return {
      title: 'ExView 漫画',
      path: 'pages/index/index'
    }
  },
  onLoad: function (query) {
    console.log(query)
    this.setData({
      query
    })
    switch (query.type) {
      case 'search':
        this.search(query.keyword)
        break
      case 'cats':
        this.cats(query.id, query.title)
        break  
    }
    // wx.setNavigationBarTitle({
    //   title: "tmpTitle"
    // }) 
  },
  search(keyword, page) {
    wx.setNavigationBarTitle({
      title: keyword
    }) 
    app.fetch({
      url: `${app.config.requestApi}comics/?q[name_cont]=${encodeURIComponent(keyword)}&page=${page || 1}&sign=${app.config.sign}`
    }).then((res) => {
      let data = JSON.parse(res.body)
      let items = data.entries
      this.setData({
        hiddenLoading: true,
        page: page || 1,
        pagecount: data.total_pages || 1,
        itemArray:items.filter((item) => {
          return item.cover.indexOf('images.dmzj.com') === -1 && item.cover.indexOf('i.3qfm.com') === -1
        })
      })
      this.data.page = page || 1
      this.data.pagecount = data.total_pages || 1
      console.log(data)
    }).catch((e) => {
      this.setData({
        hiddenLoading: true
      })
      console.log(e)
    })
  },
  cats(id, title, page) {
    wx.setNavigationBarTitle({
      title
    })
    app.fetch({
      url: `${app.config.requestApi}comics/${(id == 'all') ? '?' : (('?q%5Btags_id_eq%5D=') + id + '&')}page=${page || 1}&sign=${app.config.sign}`
    }).then((res) => {
      let data = JSON.parse(res.body)
      let items = data.entries
      this.setData({
        hiddenLoading: true,
        page: page || 1,
        pagecount: data.total_pages || 1,
        itemArray:items.filter((item) => {
          return item.cover.indexOf('images.dmzj.com') === -1 && item.cover.indexOf('i.3qfm.com') === -1
        })
      })
      console.log(data)
    }).catch((e) => {
      this.setData({
        hiddenLoading: true
      })
      console.log(e)
    })
  },
  loadprev() {
    this.setData({
      hiddenLoading: false,
      itemArray: []
    })
    switch (this.data.query.type) {
      case 'search':
        this.search(this.data.query.keyword, this.data.page - 1)
        break
      case 'cats':
        this.cats(this.data.query.id, this.data.query.title, this.data.page - 1)
        break  
    }
    // app.alert(this.data.page)
  },
  loadnext() {
    this.setData({
      hiddenLoading: false,
      itemArray: []
    })
    switch (this.data.query.type) {
      case 'search':
        this.search(this.data.query.keyword, this.data.page + 1)
        break
      case 'cats':
        this.cats(this.data.query.id, this.data.query.title, this.data.page + 1)
        break  
    }
    // app.alert(this.data.page)
  },
  desctap: app.desctap,
  cardtap(e) {
    this.setData({
      hiddenLoading: false
    })
    app.cardtap(e, () => {
      this.setData({
        hiddenLoading: true
      })
    })
  },
  delstartap: app.delstartap,
  startap: app.startap,
  previewtap: app.previewtap,
  moretap: app.moretap
})
