Page({

  /**
   * 页面的初始数据
   */
  data: {
    carouselList:'',//轮播图
    hotQusetionList:'',//热门题类
    courseList:''//精品课程
  },

  // 轮播图跳转
  navToVideoPlay(event){
    let title = event.currentTarget.dataset.title
    // console.log(title)
    wx.cloud.callFunction({
      name:"collectionGetLessons",
      data:{
        title:title
      }
    }).then(res =>{
      let clickCourseInfo =res.result.data[0]
      // console.log(clickCourseInfo)

      // 点击量增加
      // 先把本地数据增加
      clickCourseInfo.click_num = clickCourseInfo.click_num + 1

      // 调运云函数把数据库数据增加
      wx.cloud.callFunction({
        name:"addClickNumber",
        data:{
          title:clickCourseInfo.course_title
        }
      })

      // 把点击的课程缓存到课程详情页获取
      wx.setStorageSync('courseInfo', clickCourseInfo)
      wx.navigateTo({ url: '/pages/videoPlay/videoPlay' });

    })

  },

// 精品课程跳转
  navToVideoPlayPage(event){
    let index = event.currentTarget.dataset.index
    // let courseInfo = this.data.courseList[index]

       // 点击量增加
       // 先把本地数据增加
       this.setData({
         ['courseList['+ index +'].click_num']:this.data.courseList[index].click_num+1
       })
       // 调运云函数把数据库数据增加
       wx.cloud.callFunction({
         name:"addClickNumber",
         data:{
           title:this.data.courseList[index].course_title
         }
       }).then(res=>{
         // console.log(res)
       })


    wx.setStorageSync('courseInfo', this.data.courseList[index])
    wx.navigateTo({ url: '/pages/videoPlay/videoPlay'});
  },
  // 导航栏跳转
  navToLessonPage(event){
    let navId = event.currentTarget.dataset.id;
    let type = event.currentTarget.dataset.type;

    wx.setStorageSync('navId', navId)
    wx.setStorageSync('type', type)


    wx.switchTab({
      url: '/pages/lesson/lesson',
    })
  },
  // 面试题跳转
  navToQuestionPage(event){
    let type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/question/question?type=' + type,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // wx.showModal({
    //   title: '提示',
    //   content: '本小程序的视频、图片、文字资料均来源于网络，如有侵权，请在“个人中心-反馈”中联系删除！',
    //   confirmText: "我已了解",
    //   showCancel:false,
    // })

    wx.showLoading({
      title: '加载中',
      mask:'true'
    })

    // 轮播图
    wx.cloud.callFunction({
      name:"getCarouselChart",
    }).then(res=>{
      // console.log(res.result.data)
      this.setData({
        carouselList:res.result.data
      })
    })

    // 热门题类
    wx.cloud.callFunction({
      name:"getHotQuestion",
    }).then(res=>{
      // console.log(res.result.data)
      this.setData({
        hotQusetionList:res.result.data
      })

      wx.hideLoading()
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 精品课程
    wx.cloud.callFunction({
      name:"getLessons",
      data:{
        type:'全部'
      }
    }).then(res=>{
      // console.log(res.result.data)
      let resData = res.result.data.slice(0,5)
      this.setData({
        courseList:resData
     })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})