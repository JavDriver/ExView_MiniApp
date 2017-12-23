//read.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hiddenLoading: false,
    imgArray: [],
    query: null,
    nowid: 1,
    chapterArray: [],
    prevchaptername: '',
    nextchaptername: ''
  },
  getpage(pid, cid, title) {
    wx.setNavigationBarTitle({
      title
    })
    this.setData({
      hiddenLoading: false,
      imgArray:[]
    })
    app.fetch({
      url: `${app.config.requestApi}comics/${pid}/${cid}?sign=${app.config.sign}`
    }).then((res) => {
      let data = JSON.parse(res.body)
      let items = data.pages
      this.setData({
        hiddenLoading: true,
        imgArray:items.map((item) => {
          return item.track_url
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
  onShareAppMessage: function () {
    return {
      title: 'ExView 漫画',
      path: 'pages/index/index'
    }
  },
  onLoad: function (query) {
    console.log(query)
    let nowid = app.globalData.nowid || 1
    let chapters = app.globalData.chapters
    this.setData({
      query,
      nowid: nowid,
      chapterArray: chapters,
      prevchaptername: nowid-1 > 0 ? chapters[parseInt(nowid)-2].name : '',
      nextchaptername: nowid < chapters.length ? chapters[parseInt(nowid)].name : ''
    })
    this.getpage(query.pid, query.cid, this.data.query.title + ' - ' + chapters[parseInt(nowid) - 1].name)
  },
  load(nowid) {
    let {storeIds, storeDatas} = app.getStore()
    let chapters = app.globalData.chapters
    let json = chapters[parseInt(nowid) - 1]
    let pid = String(this.data.query.pid)
    let cid = String(nowid)
    let title = this.data.query.title/* .split(' - ')
    title.pop()
    title = title.join(' - ') */
    if (storeIds.indexOf(pid) !== -1) {
      storeDatas[pid].nowid = nowid || null
      storeDatas[pid].chapters_count = chapters.length
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
    console.log({storeIds, storeDatas})
    console.log(nowid)
    app.globalData.nowid = nowid
    cid = String(nowid || 1)
    title += ' - ' + chapters[parseInt(nowid || 1) - 1].name
    
    this.setData({
      nowid: nowid,
      chapterArray: chapters,
      prevchaptername: nowid - 1 > 0 ? chapters[parseInt(nowid)-2].name : '',
      nextchaptername: nowid < chapters.length ? chapters[parseInt(nowid)].name : ''
    })
    this.getpage(pid, cid, title)
  },
  loadprev(e) {
    console.log(e)
    let nowid = app.globalData.nowid
    nowid = parseInt(nowid) - 1
    if (nowid > 0) this.load(nowid)
  },
  loadnext(e) {
    console.log(e)
    let nowid = app.globalData.nowid
    let chapters = app.globalData.chapters
    nowid = parseInt(nowid) + 1
    if (nowid < chapters.length) this.load(nowid)
  }
})
