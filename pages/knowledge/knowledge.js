// pages/knowledge/knowledge.js
Page({
  data: {
    page_class: [],
    page_times: 0,
    msg_show: true, //首次点击弹出提示
    //page-container
    show: false,
    duration: 300,
    position: 'right',
    overlay: true,
    page_content: [],  //选中后获取文章内容
    page_num: [], //文章浏览量
    page_like: [], //文章点赞数
    page_id: 0, //统计使用
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断本地是否有数据
    const page_class=wx.getStorageSync('page_class');
    if(!page_class){
      var that=this;
      wx.cloud.init({
        traceUser: true,
        env: 'course-design-9g0tep2cf0411ab9'
      });
      const db=wx.cloud.database();
      const _=db.command; //查询指令  
      //该分类下有文章的进行输出
      db.collection('page_class').where({num: _.gt(0)}).get({
        success:function(res) {
          that.setData({page_class: res.data});
          wx.setStorageSync('page_class', res.data); //存储到本地 
        }
      })
    }else{
      this.setData({'page_class': page_class});
    }

  },
  /**
   * page-container弹出 
   */
  popup(e) {
    let duration = this.data.duration
    const index = e.currentTarget.dataset.index
    const times = e.currentTarget.dataset.times
    var that=this
    //获取对应文章内容
    wx.cloud.init({
      traceUser: true,
      env: 'course-design-9g0tep2cf0411ab9'
    })
    const db=wx.cloud.database()
    const _=db.command //查询指令  
    db.collection('pages').where({fid: index}).get({
      success:function(res) {
        that.setData({
          page_content: res.data,
          page_id: index,
          page_times: times,
          show: true,
          duration
        })
      }
    })
    /**文章浏览频次统计 */
    let page_num_local=wx.getStorageSync('page_num'+index)
    if(page_num_local){
      ++page_num_local
    }else{
      page_num_local=1
    }
    wx.setStorageSync('page_num'+index, page_num_local)
    that.data.page_num.push({id: index,times: page_num_local})
    //全部文章分类都显示出后
    //动态改变浏览量
    //++this.data.page_class[index].times
    //this.setData({page_class: this.data.page_class})
    
  },
  /**
   * 点赞文章
   * 只能点一下
   */
  add_like(e){
    const pid=e.currentTarget.dataset.pid
    let page_like_local=wx.getStorageSync('page_like_'+pid)
    page_like_local={fid: this.data.page_id,id:pid,times:1,liked:true}
    wx.setStorageSync('page_like_'+pid, page_like_local)
    this.data.page_like.push(page_like_local)
    ++this.data.page_content[pid].times
    this.setData({page_content: this.data.page_content})
    wx.showToast({
      title: '点赞成功！',
      icon: "success",
      duration: 1500
    })
  },
  /**
   * page-contain退出
   */
  exit() {
    this.setData({show: false})
    // wx.navigateBack()
  },
  onBeforeEnter(res) {
    //console.log()
  },
  onEnter(res) {
    //console.log(res)
  },
  /**
   * 弹出提示
   */
  onAfterEnter(res) {
    if(this.data.msg_show){
      wx.showToast({
        title: '向下拉动屏幕即可退出!',
        icon: 'none',
        duration: 2000
      })
      this.setData({msg_show: false})
    }
  },
  onBeforeLeave(res) {
    //console.log(res)
  },
  onLeave(res) {
    //console.log(res)
  },
  onAfterLeave(res) {
    //console.log(res)
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
    if(this.data.page_num||this.data.page_like){
      wx.cloud.init({env: 'course-design-9g0tep2cf0411ab9'})
      wx.cloud.callFunction({
        name: 'new_times',
        data: {
          father_num: this.data.page_num,
          child_num: this.data.page_like,
          father_table: 'page_class',
          child_table: 'pages'
        },
        success:function(res){
          //console.log(res);
        },
        fail: console.error
      })
      wx.clearStorageSync(); //清除缓存
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