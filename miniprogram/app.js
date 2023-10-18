// app.js 小程序项目的入口文件
App({
  onLaunch: function () {

      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'learningsite-5g6ary5s3e8e01bb',
        traceUser: true,
      });

    this.globalData = {
      userinfo:{
        studyDuration:'',
        avatar:'',
        name:''
      }
    };

    this.overShare()

  },


    //重写分享方法
	overShare() {
		//监听路由切换
		//间接实现全局设置分享内容
		wx.onAppRoute(function(res) {
			//获取加载的页面
			let pages = getCurrentPages(),
				//获取当前页面的对象
				view = pages[pages.length - 1],
				data;
			if (view) {
				data = view.data;
				// console.log('是否重写分享方法', data.isOverShare);
				if (!data.isOverShare) {
					data.isOverShare = true;
					view.onShareAppMessage = function() {
						//你的分享配置
						return {
							title: '欢迎使用飞鱼学习站！',
							path: '/pages/login/login',
						};
					}
				}
			}
		})
	},
});
