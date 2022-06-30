// pages/acupoint/acupoint.js
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    me: [],
    ac: [],
    ac_detail: [],     //穴位细节
    ac_open: false,    //穴位展开
    list_open: false,  //列表展开
    me_num: [],        //经脉点击频次
    ac_num: [],        //穴位点击频次
  },
  onLoad(options) {
    //判断本地是否有数据
    const meridian_list=wx.getStorageSync('meridian_list');
    if(!meridian_list){
      var that=this;
      wx.cloud.init({
        traceUser: true,
        env: 'course-design-9g0tep2cf0411ab9'
      });
      const db=wx.cloud.database();
      const _=db.command; //查询指令  
      db.collection('meridian').where({id: _.gt(0)}).get({
        success:function(res) {
          that.setData({me: res.data});
          wx.setStorageSync('meridian_list', res.data); //存储到本地 
        }
      })
    // 通过本地存储加载数据
    }else{
      this.setData({'me': meridian_list});
    }
    /**
     * 新增缓存格式
     * 为数据分析提供数据
     */
  },
  /**
   * 5.27 18.32
   * 选择本经脉下穴位
   */
  chooseMe(e){
    var that=this;
    if(that.data.list_open==true){
      that.setData({list_open: false});
    }else{
      const index=e.currentTarget.dataset.index;
      const meridian=wx.getStorageSync('me'+index); //获取本地经脉下穴位缓存
      //如果存在本地存储则使用本地进行渲染
      if(meridian){
        that.setData({
          ac: meridian,  //返回给ac，渲染ac列表
          list_open: true //列表展开
        }); 
      }else{
        wx.cloud.init({
          env: 'course-design-9g0tep2cf0411ab9'
        })
        wx.cloud.callFunction({
          name: 'get_acup',
          data: { meid: index },
          success: function(res){
            that.setData({
              ac: res.result.data, 
              list_open: true 
            })
            wx.setStorageSync('me'+index, res.result.data)
          }
        })
      }
      /**
       * 5/28 12.42
       * 获取本地经脉点击次数
       * 存在加一，不存在设置为1
       * 设置本地经脉点击次数
       * 添加至点击集合
       */
      let me_count_local=wx.getStorageSync('me_num'+index)
      if(me_count_local){
        me_count_local++
      }else{
        me_count_local=1
      }
      wx.setStorageSync('me_num'+index, me_count_local)
      that.data.me_num.push({id:index,times: me_count_local})
    }
  },
  /**
   * 5.27 22.21
   * 查看具体穴位
   */
  chooseAc(e){
    const index=e.currentTarget.dataset.index //穴位id
    const father=e.currentTarget.dataset.father //所处经脉id
    const meridian=wx.getStorageSync('me'+father) //本地缓存
    this.setData({
      ac_detail: meridian[index], //经脉下穴位信息
      ac_open: true //展开穴位具体信息
    })
    /**
     * 5/28 15.46
     * 获取本地穴位点击次数
     * 有则加1，无则为1
     * 添加至本地穴位点击次数
     * 添加至穴位点击集合
     */
    let ac_count_local=wx.getStorageSync(father+'ac_count'+index);
    if(ac_count_local){
      ac_count_local.times++;
    }else{
      ac_count_local={fid: father,id: index,times: 1}
    }
    wx.setStorageSync(father+'ac_count'+index, ac_count_local)
    this.data.ac_num.push(ac_count_local)
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
    /**
     * 获取当前页面各部分点击次数
     * 通过云函数更新数据库
     * 删除本地点击次数
     */
    if(this.data.me_num||this.data.ac_num){
      wx.cloud.init({env: 'course-design-9g0tep2cf0411ab9'});
      wx.cloud.callFunction({
        name: 'new_times',
        data: {
          father_num: this.data.me_num,
          child_num: this.data.ac_num,
          father_table: 'meridian',
          child_table: 'acupoint'
        },
        success:function(res){
          //console.log(res);
        },
        fail: console.error
      })
      wx.clearStorageSync() //清除缓存
    }
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