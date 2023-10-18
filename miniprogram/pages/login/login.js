const db = wx.cloud.database();
const app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temporaryUrl:defaultAvatarUrl,//临时头像路径
    nickname:'',//昵称
  },

  onChooseAvatar(res){
    this.setData({
      temporaryUrl:res.detail.avatarUrl
    })
  },

  // 点击进入系统保存用户信息到云端
  login(){
    // 判断是否填写完整
    if(this.data.temporaryUrl==defaultAvatarUrl||this.data.nickname==''){
      wx.showToast({
        title: '请填写完整信息',
        icon: 'error',
        duration: 1000,
        mask:true
      })
      return;
    }

    wx.showLoading({
      title: '加载中...',
      mask:'true'
    })

    // 查询数据库呢称是否重复
    wx.cloud.callFunction({
      name:"checkNickname",
      data:{
        nickName:this.data.nickname
      }
    }).then(res=>{
      // console.log(res)
      // 呢称不存在
      if(res.result.data.length === 0){
        wx.cloud.uploadFile({
          // 云存储位置
          cloudPath:'userimg/' + this.data.nickname + this.data.temporaryUrl.substring(this.data.temporaryUrl.lastIndexOf(".")),
          // 上传文件位置
          filePath: this.data.temporaryUrl,

          success:res=>{
            // 保存用户信息到本地
            let user = {
              avatar:res.fileID,
              name:this.data.nickname,
            }
            getApp().globalData.userinfo = user;
            // 添加用户信息到数据库
            db.collection('users').add({
              data:{
                avatarUrl:res.fileID,
                nickName:this.data.nickname,
                study_duration:0
              }
            })

            wx.hideLoading()

            .then(res=>{
              wx.reLaunch({
                url: '/pages/index/index',
              })
            })

          }
        })
      }else{

        wx.hideLoading()

        wx.showToast({
          title: '昵称已被使用',
          icon: 'error',
          duration: 1500,
          mask:true
        })
      }

    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // // 查询数据库是否有注册记录,有就跳到主页
    wx.cloud.callFunction({
      name:'isRegister',
    }).then(res=>{
      if(res.result.data.length > 0){
        let user = {
          avatar:res.result.data[0].avatarUrl,
          name:res.result.data[0].nickName
        }
         // 保存用户信息到本地
        getApp().globalData.userinfo = user;
        wx.showToast({
          title: '欢迎回来！',
          icon: 'success',
          duration: 1500,
          mask:true
        })

        setTimeout(function() {
          //要实现延迟执行效果的代码快
          wx.reLaunch({
            url: '/pages/index/index',
          })
         }, 1500);
      }else{
        wx.showToast({
          title: '首次进入请先完善个人信息！',
          icon: 'none',
          duration: 2000,
          mask:true
        })
      }
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