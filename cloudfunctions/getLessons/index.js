// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();

  // 云函数入口函数
exports.main = async (event, context) => {
  const type = event.type
  if(type=="全部"){
    return db.collection("videoCourse").orderBy('click_num', 'desc').get();
  }else{
  return db.collection("videoCourse")
  .where({
    course_type:type
  })
  .get();
  }
  
}