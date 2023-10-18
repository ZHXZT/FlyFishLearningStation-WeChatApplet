const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const _ = db.command

  // 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('courseCommend').add({
    data:{
      course_title:event.course_title,
      content:event.content,
      commentator_img:event.commentator_img,
      commentator:event.commentator,
      commend_time:event.commend_time
    }
  })



  }