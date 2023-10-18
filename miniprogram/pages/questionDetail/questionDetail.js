// pages/questionDetail/questionDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionDetail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取缓存
    let item = wx.getStorageSync('questionDetail')
    this.setData({
      questionDetail:item
    })
    // 设置导航头
    wx.setNavigationBarTitle({
      title: item.questionType,
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
    // 删除缓存
    wx.removeStorageSync('questionDetail')
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