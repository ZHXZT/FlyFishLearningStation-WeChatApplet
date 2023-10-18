// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputval:'',
    textval:'',
  },

  // 评论框输入事件
  inputchange(event){
    this.setData({
      inputval:event.detail.value
    })
  },
  
  // 文段框输入事件
  textchange(event){
    this.setData({
      textval:event.detail.value
    })
  },


  // 提交
  submit(){
    if(this.data.inputval==''||this.data.textval==''){
      wx.showToast({
        title: '内容不能为空',
        icon: 'error',
        duration: 1000,
        mask:true
      })
    }else{

      wx.showLoading({
        title: '加载中',
        mask:'true'
      })

      let userinfo = getApp().globalData.userinfo
      wx.cloud.callFunction({
        name:"addFeedback",
        data:{
          title:this.data.inputval,
          detail:this.data.textval,
          people:userinfo.name,
          time:new Date()
        }
      }).then(res=>{
        wx.showToast({
          title: '感谢您的意见!',
          icon: 'success',
          duration: 1500,
          mask:true
        })
        setTimeout(function() {
          wx.reLaunch({
            url: '/pages/personal/personal',
          })
         }, 1500);
      })
    }
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