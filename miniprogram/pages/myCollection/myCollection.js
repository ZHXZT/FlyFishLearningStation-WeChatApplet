
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList:"",
    clickCourseInfo:'',
  },

// 跳转对应视频
  navTovideoPlay(event){

    wx.showLoading({
      title: '加载中',
      mask:'true'
    })

    let title = event.currentTarget.dataset.title
    // console.log(title)
    wx.cloud.callFunction({
      name:"collectionGetLessons",
      data:{
        title:title
      }
    }).then(res =>{

      this.setData({
        clickCourseInfo:res.result.data[0]
      })

      // 点击量增加
      // 先把本地数据增加
      this.setData({
        ['clickCourseInfo.click_num']:this.data.clickCourseInfo.click_num+1
      })
      // 调运云函数把数据库数据增加
      wx.cloud.callFunction({
        name:"addClickNumber",
        data:{
          title:this.data.clickCourseInfo.course_title
        }
      })
      wx.hideLoading()

      // 把点击的课程缓存到课程详情页获取
      wx.setStorageSync('courseInfo', this.data.clickCourseInfo)
      wx.navigateTo({ url: '/pages/videoPlay/videoPlay' });


    })


  },

  // 删除课程收藏
  deleteCourse(event){

    wx.showLoading({
      title: '加载中',
      mask:'true'
    })

    let title = event.currentTarget.dataset.title
    let userInfo = getApp().globalData.userinfo
    // console.log(userInfo)

    wx.cloud.callFunction({
      name:"deleteCollection",
      data:{
        title:title,
        collector:userInfo.name
      }
    }).then(res =>{
      wx.hideLoading()
      // console.log(res)
      this.onLoad()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    wx.showLoading({
      title: '加载中',
      mask:'true'
    })

    // 获取个人收藏
    let user = getApp().globalData.userinfo
    wx.cloud.callFunction({
      name:"getPersonalCollection",
      data:{
        collector:user.name
      }
    }).then(res=>{
      // console.log(res)
      this.setData({
        collectionList:res.result.data
      })

      wx.hideLoading()
    })
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