// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();

  // 云函数入口函数
exports.main = async (event, context) => {
  const title = event.title

  return db.collection("video_list")
  .where({
    course_title:title
  }).orderBy('video_num','asc')
  .get();
  }