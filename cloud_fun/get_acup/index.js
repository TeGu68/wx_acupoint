// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db=cloud.database()
  cloud.init({
    env: 'course-design-9g0tep2cf0411ab9'
  })
  const _=db.command
  try{
    return await db.collection('acupoint').where({ fid: event.meid}).get({
      success: function(res){
        return res
      }
    })
  }catch(e){
    console.error(e)
  }
}