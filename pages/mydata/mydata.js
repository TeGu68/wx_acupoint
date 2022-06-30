// pages/mydata/mydata.js
import * as echarts from '../../component/ec-canvas/echarts'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    series_meridian: [],
    series_pages: [],
    ec: {
      lazyLoad: true
    },
    ec_pie: {
      lazyLoad: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this
    wx.cloud.init({
      traceUser: true,
      env: 'course-design-9g0tep2cf0411ab9'
    })
    const db=wx.cloud.database()
    const _=db.command
    db.collection('meridian').where({times: _.gt(0)}).get({
      success:function(res) {
        that.setData({series_meridian: res.data})
        that.echartsComponent= that.selectComponent('#mychart_meridian')
        that.init_echarts()
      }
    })
    db.collection('page_class').where({times: _.gt(0)}).get({
      success:function(res) {
        that.setData({series_pages: res.data})
        that.echartsComponent= that.selectComponent('#mychart_pages')
        that.init_echarts_pie()
      }
    })
  },
  init_echarts: function(){
    this.echartsComponent.init((canvas, width, height) => {
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      Chart.setOption(this.getOption())
      return Chart
    })
  },
  //饼图初始化
  init_echarts_pie: function(){
    this.echartsComponent.init((canvas, width, height) => {
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      Chart.setOption(this.getOptionPie())
      return Chart
    })
  },
  getOption: function(){
    var that=this
    var legendListX=[]
    var legendListY=[]
    for (var i in that.data.series_meridian){
      var objname = that.data.series_meridian[i].name
      var objvalue = that.data.series_meridian[i].times
      legendListX.push(objname)
      legendListY.push(objvalue)
    }
    var option = {
      title: {
        x: 'center',
        text: '经络点击次数图',
        subtext: '收集本站一直以来的数据'
      },
      xAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999'
        }
      },
      yAxis: {
        data: legendListX,
        inverse: true,
        axisLabel: {
          inside: true,
          color: '#fff'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        z: 10
      },
      series: [
        {
          type: 'bar',
          showBackground: true,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ])
            }
          },
          data: legendListY
        }
      ]
    }
    return option
  },
  getOptionPie: function(){
    var that=this
    var legendList=[]
    for (var i in that.data.series_pages){
      legendList.push({
        value: that.data.series_pages[i].times,
        name: that.data.series_pages[i].class
      })
    }
    var option = {
      title: {
        text: '按摩文章点击分布图',
        x: 'center'
      },
      legend: {
        top: 'bottom'
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [20, 100],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 5
          },
          data: legendList
        }
      ]
    };
    return option
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      // console.log(chart)
    }, 2000)
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
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/mydata/mydata',
      success: function () { },
      fail: function () { }
    }
  }
})