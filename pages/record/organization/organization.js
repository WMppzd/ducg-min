// pages/edlist/edlist.js
import CustomPage from '../../../base/CustomPage'
import moment from "../../../libs/moment.min";
import {debounce} from "throttle-debounce";
import Const from "../../../utils/const"

CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        tag: "edlist.js",
        hasMore: true,
        expertServices: [],
        totalPageNumber: 0,
        pageNumber: 1,
        pageSize: 20
    },

    //详情
    enterDiagnosisDetail(e) {
        // const {diagnosis} = e.currentTarget.dataset;
        // getApp().globalData.diagnosisResult = diagnosis;
        wx.navigateTo({url: `./stationDetails/stationDetails`});
    },
    // 跳转 专家列表
    enterDiagnosis(e) {
        wx.navigateTo({url: `./detail/detail`});
    },


    getDiagnosisList(upDown = true) {
        const that = this;
        let requestData = {pageSize: this.data.pageSize};
        if (upDown) { // 下拉刷新还原默认值
            that.setData({hasMore: true, pageNumber: 1});
        } else { // 加载更多则显示loading
            const {pageNumber, pageSize} = that.data;
            requestData = Object.assign(requestData, {pageNumber: pageNumber + 1, pageSize});
        }
        if (!upDown && !this.data.hasMore) return;
        wx.api.getExpertDiagnosis(requestData)
            .then(res => {
                const {code, msg, data} = res;
                const {expertServices, total} = data;

                if (0 === code) {
                    // 处理数据
                    if (expertServices && Array.isArray(expertServices)) {
                        for (const item of expertServices) {  //"2020-09-26 15:12:29"
                            item.state = Const.DiagnosisStateMap[item.state]
                            item.createdAt = moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
                        }
                    }
                    // 添加数据
                    if (upDown) {
                        const {pageSize} = that.data;
                        let totalPageNumber = parseInt(total / pageSize);
                        if (total % pageSize !== 0) totalPageNumber += 1;
                        that.setData({expertServices, totalPageNumber});
                    } else {
                        that.setData({
                            expertServices: that.data.expertServices.concat(expertServices),
                            pageNumber: requestData.pageNumber
                        });
                    }
                } else {
                    wx.showModal({
                        title: '提示',
                        content: msg,
                        confirmText: '我知道了',
                        showCancel: false
                    });
                }
            })
            .catch(err => {
                that.log_error(err);
            })
            .finally(_ => {
                if (upDown) wx.stopPullDownRefresh();
                const {pageNumber, totalPageNumber} = that.data;
                if (pageNumber >= totalPageNumber) that.setData({hasMore: false});
                else that.setData({hasMore: true});
            });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getDiagnosisList(true);
        this.getDiagnosisDebounce = debounce(500, false, this.getDiagnosisList);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getDiagnosisList(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getDiagnosisDebounce(false);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})