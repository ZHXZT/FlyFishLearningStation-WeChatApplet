
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionType:'',
    question:[]
  },

  // 跳转到题目解答页
  navToQuestionDetailPage(event){
    // target为触发事件的组件(触发事件的源头)，currentTarget为当前组件
    // 保存当前点击组件内容
    let item = event.currentTarget.dataset.item
    // 设置缓存
    wx.setStorageSync('questionDetail', item)

    wx.navigateTo({
      url: '/pages/questionDetail/questionDetail',
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

    // 接受页面跳转传递来的题目类型
    let questionType = options.type
    // console.log(questionType)
    this.setData({
      questionType
    })

    // 设置导航头标题
    wx.setNavigationBarTitle({
      title: questionType,
    })
    
    // 通过传递来的类型获取题目列表
    wx.cloud.callFunction({
      name:"getQuestion",
      data:{
        questionType:this.data.questionType
      }
    }).then(res=>{
      this.setData({
        question:res.result.data
      })

      wx.hideLoading()
      // console.log(res)
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