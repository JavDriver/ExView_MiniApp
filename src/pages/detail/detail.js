//detail.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hiddenLoading: false,
    item: [],
    chapterArray: [],
    nowid: null,
    query: null
  },
  onShareAppMessage: function () {
    return {
      title: 'ExView 漫画',
      path: 'pages/index/index'
    }
  },
  onShow() {
    this.setData({
      nowid: app.globalData.nowid || null
    })
  },
  onLoad: function (query) {
    console.log(query)
    this.setData({
      query,
      item: app.globalData.detail
    })
    wx.setNavigationBarTitle({
      title: this.data.item.name
    })
    app.fetch({
      url: `${app.config.requestApi}comics/${query.id}?sign=${app.config.sign}`
    }).then((res) => {
      let data = JSON.parse(res.body)
      let items = data.chapters

      let {storeIds, storeDatas} = app.getStore()
      let pid = String(query.id)
      let nowid = null
      if (storeIds.indexOf(pid) !== -1) {
        nowid = storeDatas[pid].nowid || null
        storeDatas[pid].chapters_count = items.length
        app.setStore({
          storeIds,
          storeDatas
        })
      }
      console.log({storeIds, storeDatas})
      console.log(nowid)
      app.globalData.nowid = nowid
      app.globalData.chapters = items
      this.setData({
        hiddenLoading: true,
        nowid,
        chapterArray:items
      })
      console.log(data)
    }).catch((e) => {
      this.setData({
        hiddenLoading: true
      })
      console.log(e)
    })
  },
  read(pid, cid, title) {
    let {storeIds, storeDatas} = app.getStore()
    if (storeIds.indexOf(pid) !== -1) {
      storeDatas[pid].nowid = cid
      storeIds = storeIds.slice(0, storeIds.indexOf(pid)).concat(storeIds.slice(storeIds.indexOf(pid) + 1))
      storeIds.push(pid)
      console.log({
        storeIds,
        storeDatas
      })
      app.setStore({
        storeIds,
        storeDatas
      })
    }
    wx.navigateTo({
      url: `../read/read?pid=${pid}&cid=${cid}&title=${title}`
    })
  },
  chaptertap(e) {
    console.log(e)
    let json = e.currentTarget.dataset.json
    let pid = String(json.comic_id)
    let cid = String(e.currentTarget.id)
    let title = app.globalData.detail.name/*  + ' - ' + json.name */
    app.globalData.nowid = cid
    this.read(pid, cid, title)
  },
  readtap(e) {
    console.log(e)
    let nowid = app.globalData.nowid || 1
    let json = app.globalData.chapters[parseInt(nowid || 1) - 1]
    let pid = String(json.comic_id)
    let cid = String(nowid)
    let title = app.globalData.detail.name/*  + ' - ' + json.name */
    app.globalData.nowid = cid
    this.read(pid, cid, title)
  },
  desctap: app.desctap,
  cardtap: app.cardtap,
  delstartap: app.delstartap,
  startap: app.startap,
  previewtap: app.previewtap,
  moretap: app.moretap
})
