var userinfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    avatar:'',
    collectionNum:0,
    studyDurations:0, //毫秒的本次学习时长
    studyDuration:0,//本次学习时长
    totalStudyDuration:0,//总学习时长
    totalStudyDurations:''//用于上传的毫秒总学习时长

  },

// 改变时间格式
  changeTimeFormat(Time){
    var learnedTime
    if(Time >= 3600000){
      learnedTime = Math.floor(Time/(60*60*1000)*10)/10 +'h'
    }else if(60000<Time){
      learnedTime = Math.floor(Time/(60*1000)*10)/10 + 'min'
    }else if(1000<Time){
      learnedTime = 1 + 'min'
    }else{
      learnedTime = 0
    }
    return learnedTime;
  },


// 跳转收藏
  navToMyCollectionPage(){
    wx.navigateTo({ url: '/pages/myCollection/myCollection' });
  },
  // 跳转历史
  navToLearningHistoryPage(){
    wx.navigateTo({ url: '/pages/learningHistory/learningHistory' });
  },
  // 跳转关于
  navToAboutPage(){
    wx.navigateTo({ url: '/pages/about/about' });
  },
  // 跳转反馈
  navToFeedbackPage(){
    wx.navigateTo({ url: '/pages/feedback/feedback' });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    userinfo = getApp().globalData.userinfo

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

    wx.showLoading({
      title: '加载中',
      mask:'true'
    })

    // 获取用户头像昵称
    this.setData({
      userName:userinfo.name,
      avatar:userinfo.avatar,
    })

    // 获取收藏个数
    wx.cloud.callFunction({
      name:"getPersonalCollection",
      data:{
        collector:userinfo.name
      }
    }).then(res=>{
      // console.log(res)
      this.setData({
        collectionNum:res.result.data.length
      })
    })

// 获取学习时长
  let stayTime= wx.getStorageSync('stayTime')
  //  console.log(stayTime)
   if(stayTime!=''){
    //  console.log(stayTime)
    this.setData({
      studyDurations:this.data.studyDurations + stayTime
    })
    let restime= this.changeTimeFormat(this.data.studyDurations)
    this.setData({
      studyDuration:restime
    })

       //获取总学习时长
    wx.cloud.callFunction({
      name:"getLearnedTime",
      data:{
        nickName:userinfo.name
      }
    }).then(res=>{
      let totalrestime= this.changeTimeFormat(res.result.data[0].study_duration)
      this.setData({
        totalStudyDuration:totalrestime,
        totalStudyDurations:res.result.data[0].study_duration + stayTime,
     })
     wx.removeStorageSync('stayTime')
        //  更新总学习时长
      wx.cloud.callFunction({
        name:"updateLearnedTime",
        data:{
          nickName:userinfo.name,
          study_duration:this.data.totalStudyDurations
        }
      })

      wx.hideLoading()
    })

   }else{
    wx.cloud.callFunction({
      name:"getLearnedTime",
      data:{
        nickName:userinfo.name
      }
    }).then(res=>{
      // console.log(res)
      let totalrestime= this.changeTimeFormat(res.result.data[0].study_duration)
      this.setData({
        totalStudyDuration:totalrestime,
      })

      wx.hideLoading()
    })

   }


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