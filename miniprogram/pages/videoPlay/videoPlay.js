const db = wx.cloud.database();
var startTime, endTime
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseInfo:'',
    lessonList:'',
    courseCommend:'',
    navId:1,//选中导航标识
    playId:'0',//选择的的小节标识
    inputValue: '',
  },
// 评论框输入事件
  evaluateInput(event){
    this.setData({
      inputValue:event.detail.value
    })
  },

  // 发送评价
  sendEvaluate(){
    if(this.data.inputValue == '' ){
      wx.showToast({
        title: '内容不能为空',
        icon: 'error',
        duration: 1000,
        mask:true
      })
    }else{
      let userinfo = getApp().globalData.userinfo
      // console.log(userinfo)
      wx.cloud.callFunction({
        name:"addCourseCommend",
        data:{
          course_title:this.data.courseInfo.course_title,
          content:this.data.inputValue,
          commentator_img:userinfo.avatar,
          commentator:userinfo.name,
          commend_time:new Date()
        }
      }).then(res=>{

        wx.showToast({
          title: '评价成功',
          icon: 'success',
          duration: 1000,
          mask:true
        })
        this.setData({
          inputValue:''
        })
        let that = this
        setTimeout(function() {
          that.getcommend()
         }, 1000);

      })

    }
  },
  //改变导航
  changeNav(event){
    let navId = event.currentTarget.id;
    this.setData({
      navId :navId*1
    })
  },

  // 改变当前播放视频
  changeLesson(event){
    let playId = event.currentTarget.id
    // console.log(playId)
    this.setData({
      playId:playId*1
    })
  },
  // 获取课程评价
  getcommend(){

    wx.showLoading({
      title: '加载中',
      mask:'true'
    })

    wx.cloud.callFunction({
      name:"getCourseCommend",
      data:{
        title:this.data.courseInfo.course_title
      }
    }).then(res=>{
      // 把课程评价中的日期格式转换再存储
      var result = res.result.data
      // console.log(res)
      for(let i=0;i<result.length;i++){
        let data = result[i].commend_time
        let dateee = new Date(data).toJSON();
        let res = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        // console.log(res)
        result[i].commend_time = res
      }
      this.setData({
        courseCommend:result
      })

      wx.hideLoading()
    })


  },
// 加入收藏
  addtocollection(){

    wx.showLoading({
      title: '加载中',
      mask:'true'
    })

    let userinfo = getApp().globalData.userinfo
    // console.log(userinfo.name)
    wx.cloud.callFunction({
      name:"addPersonalCollection",
      data:{
        course_title:this.data.courseInfo.course_title,
        collector:userinfo.name
      }
    }).then(res=>{
      // console.log(res)
      if(res.result.data.length >= 1){
      wx.showToast({
        title: '该课程已经在收藏夹！',
        icon: 'none',
        duration: 1000,
        mask:true
      })

      // wx.hideLoading()

      }else{
      db.collection("personalCollection").add({
        data:{
          collector:userinfo.name,
          course_title:this.data.courseInfo.course_title,
          click_num:this.data.courseInfo.click_num,
          collect_time:new Date(),
          course_imgurl:this.data.courseInfo.course_imgurl,
          course_type:this.data.courseInfo.course_type
        }
      })
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 1000,
        mask:true
      })

      // wx.hideLoading()
      }
    })

  },

  // 添加学习历史
  addtoHistory(){
    
    let userinfo = getApp().globalData.userinfo
    // console.log(userinfo.name)
    wx.cloud.callFunction({
      name:"addPersonalHistory",
      data:{
        course_title:this.data.courseInfo.course_title,
        learner:userinfo.name
      }
    }).then(res=>{
      // console.log(res)
      if(res.result.data.length >= 1){
        db.collection('learningHistory').where({
          course_title:this.data.courseInfo.course_title,
          learner:userinfo.name
        }).update({
          data:{
            learned_time:new Date(),
          }
        })
      }else{
      db.collection("learningHistory").add({
        data:{
          learner:userinfo.name,
          course_title:this.data.courseInfo.course_title,
          learned_time:new Date(),
          course_imgurl:this.data.courseInfo.course_imgurl,
          course_type:this.data.courseInfo.course_type
        }
      })

      }
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

    // 接收课程页传来的课程数据
    let courseInfo = wx.getStorageSync('courseInfo')
    // console.log(courseInfo.course_title)
    // 获取课程目录
    wx.cloud.callFunction({
      name:"getSmallLessons",
      data:{
        title:courseInfo.course_title
      }
    }).then(res=>{
      // console.log(res.result.data)
      this.setData({
        lessonList:res.result.data
      })

      wx.hideLoading()
    })

    this.setData({
      courseInfo
    })
    // 添加学习历史
    this.addtoHistory()

    wx.removeStorageSync('courseInfo')

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

    // setTimeout(function(){
    startTime = new Date();
    // },200)


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
    endTime = new Date();
    let stayTime =Number(endTime - startTime) ;
// 新方法
    wx.setStorageSync('stayTime', stayTime)
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
    // return {
    //   title:'飞鱼学习站：'+ this.data.courseInfo.course_title + '课程分享',
    //   path:'pages/lesson/lesson'
    // }
  }
})