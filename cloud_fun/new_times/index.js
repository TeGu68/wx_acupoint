// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database()
  cloud.init({
    env: 'course-design-9g0tep2cf0411ab9'
  })
  const _=db.command
  try{
    if(event.father_num){
      event.father_num.forEach((item,index) => {
        db.collection(event.father_table).where({id: item.id}).update({
          data: {times: _.inc(item.times)},
          success:function(res){
            console.log(res);
          }
        })
      })
    }
    if(event.child_num){
      event.child_num.forEach((item,index) => {
        db.collection(event.child_table).where({fid: item.fid,id: item.id}).update({
          data: {times: _.inc(item.times)}, 
          success:function(res){
            console.log(res);
          }
        })
      })
    }
  }catch(e){
    console.error(e)
  }
}