//app.js
App({
  config: {
    proxyApi: '<已备案的HTTPS代理服务器>', // 已备案的HTTPS代理服务器
    requestApi: '<漫画服务器>', //漫画服务器
    sign: '<请求签名认证>' // 请求签名认证
  },
  onLaunch: function () {
    // this.alert('这个是ExView的小程序版本，若要体验全部功能，请前往官网\n exview.gtool.ml/ExView \n下载App!', 'ExView 漫画')
  },
  globalData: {
    userInfo: null
  },
  alert(content = '', title = '', success = null) {
    wx.showModal({
      title,
      content,
      success,
      showCancel: false
     })
  },
  confirm(content = '', title = '', success = null) {
    wx.showModal({
      title,
      content,
      success,
      showCancel: true
     })
  },
  fetch({url, method, data, header, callback}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url:`${this.config.proxyApi}api/request`,
        data:`method=${method || 'GET'}&url=${encodeURIComponent(url)}&body=${data || ''}&` + ((header || []).map((item) => {
          let itemArr = item.split(':')
          let key = itemArr[0]
          let value = itemArr[1]
          return encodeURIComponent(`header[${key}]:${value}`)
        })).join('&'),
        header:{
          'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With':'XMLHttpRequest'
        },
        method: 'POST',
        success: (res) => {
          if ((res.data.code >= 200 && res.data.code < 300) || res.data.code == 304) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        },
        fail: (error) => {
          reject(error)
        },
        complete: callback
      })
      
    })
  },
  cardtap(e) {
    console.log(e)
  },
  delstartap(e) {
    console.log(e)
    let json = e.currentTarget.dataset.json
    let id = String(json.id)
    let {storeIds, storeDatas} = this.getStore()
    if (storeIds.indexOf(id) !== -1) {
      storeIds = storeIds.slice(0, storeIds.indexOf(id)).concat(storeIds.slice(storeIds.indexOf(id) + 1))
      delete storeDatas[id]
      this.setStore({
        storeIds,
        storeDatas
      })
      this.alert('已退订！', json.name)
      console.log(storeIds)
    }
  },
  getStore() {
    let storeIds, storeDatas
    try {
      storeIds = JSON.parse(wx.getStorageSync('starIds') || '[]')
      storeDatas = JSON.parse(wx.getStorageSync('storeDatas') || '{}')
    } catch (e) {
      storeIds = []
      storeDatas = {}
    }
    if (!Array.isArray(storeIds)) {
      storeIds = []
      storeDatas = {}
    }
    return {
      storeIds,
      storeDatas
    }
  },
  setStore({storeIds, storeDatas}) {
    wx.setStorageSync('starIds', JSON.stringify(storeIds))
    wx.setStorageSync('storeDatas', JSON.stringify(storeDatas))
  },
  startap(e) {
    console.log(e)
    let json = e.currentTarget.dataset.json
    let id = String(json.id)
    let {storeIds, storeDatas} = this.getStore()
    if (storeIds.indexOf(id) !== -1) {
      this.alert('已存在！', json.name)
    } else {
      storeIds.push(id)
      storeDatas[id] = json
      this.setStore({
        storeIds,
        storeDatas
      })
      this.alert('已订阅！', json.name)
    }
    // wx.setStorageSync('userName', objData.userName);
    // wx.getStorageSync('userName');
  },
  /* previewtap(e) {
    console.log(e)
  }, */
  moretap(e) {
    console.log(e)
    let id = e.currentTarget.id
    let json = e.currentTarget.dataset.json
    this.globalData.detail = json
    wx.navigateTo({
      url: `../detail/detail?id=${id}&title=${json.name}`
    })
  },
  desctap(e) {
    console.log(e)
    let json = e.currentTarget.dataset.json || {}
    !!json.description && this.alert(json.description, json.name)
  },
  cardtap(e, callback) {
    console.log(e)
    let id = e.currentTarget.id
    let json = e.currentTarget.dataset.json
    this.globalData.detail = json
    this.fetch({
      url: `${this.config.requestApi}comics/${id}?sign=${this.config.sign}`
    }).then((res) => {
      let data = JSON.parse(res.body)
      let items = data.chapters
      this.globalData.chapters = items
      let {storeIds, storeDatas} = this.getStore()
      let nowid = null
      let pid = String(id)
      let cid = String(nowid || 1)
      let title = json.name
      if (storeIds.indexOf(pid) !== -1) {
        nowid = storeDatas[pid].nowid || 1
        storeDatas[pid].nowid = nowid
        storeDatas[pid].chapters_count = items.length
        storeIds = storeIds.slice(0, storeIds.indexOf(pid)).concat(storeIds.slice(storeIds.indexOf(pid) + 1))
        storeIds.push(pid)
        console.log({
          storeIds,
          storeDatas
        })
        this.setStore({
          storeIds,
          storeDatas
        })
      }
      console.log({storeIds, storeDatas})
      console.log(nowid)
      this.globalData.nowid = nowid || 1
      cid = String(nowid || 1)
      // title += ' - ' + items[parseInt(nowid || 1) - 1].name
      wx.navigateTo({
        url: `../read/read?pid=${pid}&cid=${cid}&title=${title}`
      })
      !!callback && callback(data)
      console.log(data)
    }).catch((e) => {
      !!callback && callback(e)
      console.log(e)
    })
  }
})