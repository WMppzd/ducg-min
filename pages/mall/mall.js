// pages/mall/mall.js
import CustomPage from '../../base/CustomPage';
import axios from "axios";
import Storage from "../../utils/storage";
import Const from "../../utils/const";

CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        tag: "mall.js",
        products: []
    },

    navigate2Services(e) {
        const {service} = e.currentTarget.dataset;
        console.log(service);
        const {itemType, itemId} = service;
        if ("ServicePlan" === itemType && itemId === 2) {
            // 宠物版
        }
        if ("ServicePlan" === itemType && itemId === 3) {
            // 企业版
            this.getExpertenterpriseisList();
        }
        if ("ExpertService" === itemType && itemId === 1) {
            // 专家诊断
            this.getExpertDiagnosisList();
        }
        if ("ExpertService" === itemType && itemId === 2) {
            // 专家指导
            this.getExpertServicesEnterDiagnosisList();
        }
    },
    getExpertenterpriseisList(){
        const that = this;
        const app = getApp();

        if (app.globalData.expertService) {
            wx.navigateTo({url: `../record/MemberIn/MemberIn?sourceType=${Const.SourceType.DIAGNOSIS}`});
            return;
        }
        wx.api.getExpertServiceList()
            .then(res => {
                const {code, msg, data} = res;
                const {expertServices} = data;

                if (0 === code) {
                    app.globalData.expertService = expertServices[1];
                    wx.navigateTo({url: `../record/MemberIn/MemberIn?sourceType=${Const.SourceType.DIAGNOSIS}`});
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
            });
    },
    getExpertDiagnosisList(){
        const that = this;
        const app = getApp();

        if (app.globalData.expertService) {
            wx.navigateTo({url: `../record/organization/organization?sourceType=${Const.SourceType.DIAGNOSIS}`});
            return;
        }
        wx.api.getExpertServiceList()
            .then(res => {
                const {code, msg, data} = res;
                const {expertServices} = data;

                if (0 === code) {
                    app.globalData.expertService = expertServices[1];
                    wx.navigateTo({url: `../record/organization/organization?sourceType=${Const.SourceType.DIAGNOSIS}`});
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
            });
    },

    @wx.api.auth
    getExpertServicesEnterDiagnosisList() {
        const that = this;
        const app = getApp();

        if (app.globalData.expertService) {
            wx.navigateTo({url: `../record/guidance/guidance?sourceType=${Const.SourceType.DIAGNOSIS}`});
            return;
        }
        wx.api.getExpertServiceList()
            .then(res => {
                const {code, msg, data} = res;
                const {expertServices} = data;

                if (0 === code) {
                    app.globalData.expertService = expertServices[1];
                    wx.navigateTo({url: `../record/guidance/guidance?sourceType=${Const.SourceType.DIAGNOSIS}`});
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
            });
    },


    navigate2MiniShop() {
        wx.navigateToMiniProgram({
            appId: 'wxbc1868a8f3c0e540',
            success(res) {
                console.log("打开成功", res);
            },
            fail(err) {
                console.error("打开失败", err);
            },
            complete(res) {
                console.info("操作完成", res);
            }
        });
    },

    getServicesAndVips() {
        const that = this;
        axios.all([wx.api.getVips(), wx.api.getServices()])
            .then(axios.spread(function (vips, services) {
                if (0 === vips.code && 0 === services.code) { // TODO 缓存
                    const {servicePlans} = vips.data;
                    const {expertServices} = services.data;
                    // 展示数据
                    const pros = servicePlans.concat(expertServices);
                    const products = pros.filter(item => item.code !== "Free");
                    that.setData({products});
                    // 缓存数据
                    // Storage.saveBannerList(blogs);
                    // Storage.saveAnimalList(categories);
                } else {
                    that.log_warn(animals.msg, banners.msg);
                }
            }))
            .catch(err => {
                that.log_error(err);
            })
            .finally(_ => {

            });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getServicesAndVips();
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
