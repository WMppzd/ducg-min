// pages/ailist/ailist.js
import CustomPage from '../../../base/CustomPage'
import moment from "../../../libs/moment.min";
import {debounce} from "throttle-debounce";
import Const from "../../../utils/const"
import AilistLogic from "./logic";

CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        tag: "ailist.js",
        action: "查看",
        hasMore: true,
        diagnosis: [],
        selectedDiagnosis: {},
        expertService: null,
        totalPageNumber: 0,
        pageNumber: 1,
        pageSize: 20,
        dialogShow: false,
        dialogTitle: "",
        buttons: [{text: '取消'}, {text: '确定'}],
        dialogContent: "",
    },

    tapDialogButton(e) {
        this.setData({dialogShow: false});
        if (1 !== e.detail.index) return;

        const {selectedDiagnosis, expertService} = this.data;
        AilistLogic.makeWechatOrder(selectedDiagnosis, expertService)
            .then(res => {
                console.log("AilistLogic then res.");
                console.log(res);
                if (res && 0 === res.code) {
                    wx.navigateBack();
                    wx.showModal({
                        title: '专家诊断服务创建成功',
                        content: "请到小程序首页-我的-专家诊断记录-查看详情",
                        confirmText: '我知道了',
                        showCancel: false
                    });
                }
            })
            .catch(err => {
                console.error("AilistLogic catch err.");
                console.error(err);
            });
    },

    generateAuthUrl(diagnosis) {
        const app = getApp();
        const {diagnosisSN, animalID, animalModelID} = diagnosis;
        wx.api.getDucgAuthUrl({animalID, animalModelID, diagnosisSN}).then(res => {
            const {code, msg, data} = res;
            if (0 === code) {
                app.globalData.ducgUrl = encodeURI(data.url);
                wx.navigateTo({url: `../../webpage/webpage`});
            } else {
                wx.showToast({title: msg})
            }
        }).catch(err => {
            console.error(err);
        });
    },

    enterDiagnosisDetailOrMakeOrder(e) {
        const {diagnosis} = e.currentTarget.dataset;
        if ("选择" === this.data.action) {
            this.setData({dialogShow: true, selectedDiagnosis: diagnosis});
        }
        if ("查看" === this.data.action) {
            this.generateAuthUrl(diagnosis);
        }
    },

    getDiagnosisList(upDown = true) {
        const that = this;
        let requestData = {pageSize:this.data.pageSize};
        if (upDown) { // 下拉刷新还原默认值
            that.setData({hasMore: true, pageNumber: 1});
        } else { // 加载更多则显示loading
            const {pageNumber, pageSize} = that.data;
            requestData = Object.assign(requestData, {pageNumber: pageNumber + 1, pageSize});
        }
        if (!upDown && !this.data.hasMore) return;
        wx.api.getDiagnosisList(requestData)
            .then(res => {
                const {code, msg, data} = res;
                const {diagnosis, total} = data;

                if (0 === code) {
                    // 处理数据
                    if (diagnosis && Array.isArray(diagnosis)) {
                        for (const item of diagnosis) {  //"2020-09-26 15:12:29"
                            item.createdAt = moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
                        }
                    }
                    // 添加数据
                    if (upDown) {
                        const {pageSize} = that.data;
                        let totalPageNumber = parseInt(total / pageSize);
                        if (total % pageSize !== 0) totalPageNumber += 1;
                        that.setData({diagnosis, totalPageNumber});
                    } else {
                        that.setData({
                            diagnosis: that.data.diagnosis.concat(diagnosis),
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
        const {sourceType} = options;
        if (Const.SourceType.DIAGNOSIS === sourceType) {
            const {expertService} = getApp().globalData;
            this.setData({action: "选择", expertService});
        }
        if (Const.SourceType.MINE === sourceType) {
            this.setData({action: "查看"});
        }
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