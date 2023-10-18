// pages/lesson/lesson.js
Page({

  data: {
    navList:["全部","前端","java","python","软件测试","网络安全","大数据"],
    navId:0 ,//当前选择的导航
    scrollLeft: 0,//导航偏移
    courseList:''
  },

  // 点击导航获取对应视频分类数据
  getLessonData(event){
    // 改变导航条样式
    let navId = event.currentTarget.id;
    this.setData({
      navId :navId*1,
      scrollLeft: (navId - 1) * 60
    })

    wx.showLoading({
      title: '加载中',
      mask:'true'
    })

    // console.log(event.currentTarget.dataset.type)
    wx.cloud.callFunction({
      name:"getLessons",
      data:{
        type:event.currentTarget.dataset.type
      }
    }).then(res=>{
      // console.log(res)
      this.setData({
        courseList:res.result.data
      })
      wx.hideLoading()
    })
  },

  // 去搜索页
  navToSearchPage() {
    wx.navigateTo({ url: '/pages/search/search' });
  },


  // 去视频播放页
  navToVideoPlayPage(event){
    
    // 点击量增加
    let click = event.currentTarget.dataset.id
    // 先把本地数据增加
    this.setData({
      ['courseList['+ click +'].click_num']:this.data.courseList[click].click_num+1
    })
    // 调运云函数把数据库数据增加
    // console.log( this.data.courseList[click].course_title)
    wx.cloud.callFunction({
      name:"addClickNumber",
      data:{
        title:this.data.courseList[click].course_title
      }
    }).then(res=>{
      // console.log(res)
    })



    // 把点击的课程缓存到课程详情页获取
    wx.setStorageSync('courseInfo', this.data.courseList[event.currentTarget.dataset.id])
    wx.navigateTo({ url: '/pages/videoPlay/videoPlay' });
  },


// 首页导航跳转课程页、tarbar跳转课程页
receiveskip(){

  wx.showLoading({
    title: '加载中',
    mask:'true'
  })

 let navId = wx.getStorageSync('navId')
 let type = wx.getStorageSync('type')

 if(navId ==''){
   this.setData({
     navId:0,
     scrollLeft:0
   })
    wx.cloud.callFunction({
      name:"getLessons",
      data:{
        type:'全部'
      }
    }).then(res=>{
      // console.log(res)
      // console.log(courseList)
      this.setData({
        courseList:res.result.data
     })

     wx.hideLoading()

    })
 }else{
    this.setData({
      navId:navId*1
    })
    wx.cloud.callFunction({
      name:"getLessons",
      data:{
        type:type
      }
    }).then(res=>{
      // console.log(res)
      this.setData({
        courseList:res.result.data
     })
     wx.hideLoading()
    })
 }
 wx.removeStorageSync('navId')
 wx.removeStorageSync('type')
},




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 首页跳转到课程页执行的函数
    this.receiveskip();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})