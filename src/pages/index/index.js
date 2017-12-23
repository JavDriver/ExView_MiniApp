//index.js
//获取应用实例
const app = getApp()
var base64 = require('../../utils/base64.js').Base64;
var md5 = require('../../utils/md5.js');
Page({
  data: {
    released: null,
    hiddenLoading: true,
    pageid: 1,
    /* suggestpagecount: 2000, */
    catArray: ["竞技","热血","高清单行","职场","冒险","魔法","萌系","生活","爱情","校园","神鬼","悬疑","治愈","欢乐向","耽美","科幻","伪娘","后宫","宅系","侦探","性转换","历史","机战","美食","百合","格斗","音乐舞蹈","战争","轻小说","搞笑","四格","西方魔幻","励志","欢乐向","颜艺","东方","其他","恐怖","武侠","奇幻","魔幻","仙侠"],
    /* motto: 'Hello World',
    userInfo: {}, */
    inputValue: '',
    /* hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'), */
    starArray: [],
    itemArray: [],
    unreleasevalue: ''
  },
  onShareAppMessage: function () {
    return {
      title: 'ExView',
      path: 'pages/index/index'
    }
  },
  unreleaseinput:function(e){
    // console.log(e)
    this.setData({
      unreleasevalue:e.detail.value
    })
  },
  onempty:function(e){
    this.setData({
      unreleasevalue:''
    })
  },
  onmd5:function(e){
    console.log(e)
    
    if(!this.data.unreleasevalue){
      app.alert('需处理字符不能为空！')
      return false
    }
    try{
      var result = md5(this.data.unreleasevalue)
      this.setData({
        unreleasevalue:result
      })
    }catch(e){
      app.alert(e.toString())
    }
  },
  onbase64en:function(e){
    console.log(e)
    
    if(!this.data.unreleasevalue){
      app.alert('需处理字符不能为空！')
      return false
    }
    try{
      var result = base64.encode(this.data.unreleasevalue)
      this.setData({
        unreleasevalue:result
      })
    }catch(e){
      app.alert(e.toString())
    }
  },
  onbase64de:function(e){
    console.log(e)
    if(!this.data.unreleasevalue){
      app.alert('需处理字符不能为空！')
      return false
    }
    try{
      var result = base64.decode(this.data.unreleasevalue)
      this.setData({
        unreleasevalue:result
      })
    }catch(e){
      app.alert(e.toString())
    }
  },
  onurlen:function(e){
    console.log(e)
    if(!this.data.unreleasevalue){
      app.alert('需处理字符不能为空！')
      return false
    }
    try{
      var result = encodeURIComponent(this.data.unreleasevalue)
      this.setData({
        unreleasevalue:result
      })
    }catch(e){
      app.alert(e.toString())
    }    
  },
  onurlde:function(e){
    console.log(e)
    if(!this.data.unreleasevalue){
      app.alert('需处理字符不能为空！')
      return false
    }
    try{
      var result = decodeURIComponent(this.data.unreleasevalue)
      this.setData({
        unreleasevalue:result
      })
    }catch(e){
      app.alert(e.toString())
    }   
  },
  onescape:function(e){
    console.log(e)
    if(!this.data.unreleasevalue){
      app.alert('需处理字符不能为空！')
      return false
    }
    try{
      var result = escape(this.data.unreleasevalue)
      this.setData({
        unreleasevalue:result
      })
    }catch(e){
      app.alert(e.toString())
    }
  },
  onunescape:function(e){
    console.log(e)
    if(!this.data.unreleasevalue){
      app.alert('需处理字符不能为空！')
      return false
    }
    try{
      var result = unescape(this.data.unreleasevalue)
      this.setData({
        unreleasevalue:result
      })
    }catch(e){
      app.alert(e.toString())
    }
  },        
  onLoad: function () {
    /* this.setData({
      hiddenLoading: false
    })
    app.fetch({
      url: 'https://raw.githubusercontent.com/ghostgzt/ExView/master/miniapp.json?time=' + (new Date()).getTime()
    }).then((res) => {
      let data = JSON.parse(res.body)
      let released = data.released
      this.setData({
        hiddenLoading: true,
        released:released?true:false
      })
      // console.log(data)
    }).catch((e) => {
      this.setData({
        hiddenLoading: true,
        released:false
      })
      console.log(e)
    }) */
    this.setData({
      released:true
    })


    /* let arr = []
    for (let i = 0;i < 10;i++) {
      arr.push({

      })
    }
    this.setData({
      itemArray:arr
    }) */
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
/*   getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }, */
  getdata(page) {
    this.setData({
      hiddenLoading: false
    })
    app.fetch({
      url: `${app.config.requestApi}comics/?page=${page || 1}&sign=${app.config.sign}`
    }).then((res) => {
      let data = JSON.parse(res.body)
      let items =data.entries
      this.setData({
        hiddenLoading: true,
        suggestpagecount: data.total_pages,
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
  randomNum: function (minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
  },
  onShow(e) {
    this.loadstar()
  },
  tabtap: function(e) {
    console.log(e.target.id)
    switch (e.target.id) {
      case 'home':
        this.setData({pageid: 0})
        if (!this.data.itemArray.length) this.getdata(this.randomNum(1, this.data.suggestpagecount))
        break
      case 'category':
        this.setData({pageid: 1})
        break
      case 'star':
        this.setData({pageid: 2})
        this.loadstar()
        break
      case 'about':
        this.setData({pageid: 3})
        break
    }
  },
  loadstar() {
    let {storeIds, storeDatas} = app.getStore()
    this.setData({
      starArray: storeIds.reverse().map((id) => {
        return storeDatas[id]
      })
    })
  },
  cattap: function(e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: `../category/category?id=${e.currentTarget.id}&title=${e.currentTarget.id === 'all' ? '全部' : this.data.catArray[parseInt(e.currentTarget.id) - 1]}&type=cats`
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindconfirm: function(e) {
    console.log(e)
    this.searchtap(e)
  },
  searchtap: function(e) {
    console.log(this.data.inputValue)
    if (this.data.inputValue) {
      wx.navigateTo({
        url: `../category/category?keyword=${this.data.inputValue}&type=search`
      })      
    }
  },
  loadother() {
    this.setData({
      itemArray:[]
    })
    this.getdata(this.randomNum(1,2000))
  },
  logotap(e) {
    this.setData({
      pageid: 3
    })
  },
  checktap(e) {
    console.log(e)
    this.setData({
      hiddenLoading: false
    })
    let {storeIds, storeDatas} = app.getStore()
    Promise.all(storeIds.map((id) => {
      return app.fetch({
        url: `${app.config.requestApi}comics/${id}?sign=${app.config.sign}`
      })
    })).then((resArr) => {
      try {
        resArr.forEach((res, i) => {
          try {
            if (!res || !res.body) return false
            storeDatas[storeIds[i]].chapters_count = JSON.parse(res.body).chapters_count
          } catch (e) {
            console.log(e)
          }
        })
        console.log({
          storeIds,
          storeDatas
        })
        app.setStore({
          storeIds,
          storeDatas
        })
        this.loadstar()
        this.setData({
          hiddenLoading: true
        })
      } catch (e) {
        this.setData({
          hiddenLoading: true
        })
      }
    })
  },
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
  delstartap(e) {
    app.delstartap(e)
    this.loadstar()
  },
  desctap: app.desctap,
  startap: app.startap,
  previewtap: app.previewtap,
  moretap: app.moretap
})
