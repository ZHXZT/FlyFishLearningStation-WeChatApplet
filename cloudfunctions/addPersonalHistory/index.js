const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const _ = db.command

  // 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('learningHistory').where({
    course_title:event.course_title,
    learner:event.learner
  }).get({})



  }