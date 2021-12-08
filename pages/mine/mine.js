// pages/mine/mine.js
import CustomPage from '../../base/CustomPage';
import Storage from '../../utils/storage';
// import {setLastPage} from '../../utils/util';
import Const from "../../utils/const";

const base64 = require("../../images/base64");

CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        tag: "mine.js",
        avatarUrl: base64.icon20,
        phone: "",
        nickname: "",
        show_phone: false
    },

    // onTabItemTap(item) {
    //     const {pagePath} = item;
    //     setLastPage(pagePath);
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        const userInfo = Storage.getUserInfo();
        if (userInfo) this.setData({show_phone: true, ...userInfo});
        else this.setData({nickname: "未登录", show_phone: false})
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

    },

    @wx.api.auth
    enterOrderPage(e) {
        wx.navigateTo({url: `../order/list/list`});
    },

    @wx.api.auth
    enterPackagePage(e) {
        wx.navigateTo({url: `../package/package`});
    },

    @wx.api.auth
    enterFavoritesPage(e) {
        wx.navigateTo({url: `../favorites/favorites`});
    },

    @wx.api.auth
    enterProfilePage(e) {
        wx.navigateTo({url: `../profile/profile`});
    },

    @wx.api.auth
    enterAINoteList(e) {
        wx.navigateTo({url: `../record/ailist/ailist?sourceType=${Const.SourceType.MINE}`});
    },

    @wx.api.auth
    enterEDNoteList(e) {
        wx.navigateTo({url: `../record/edlist/edlist`});
    },

    enterFeedback(e) {
        wx.navigateTo({url: `../feedback/feedback`});
    },

    enterCourse(e) {
        wx.navigateToMiniProgram({
            appId: 'wx8abaf00ee8c3202e',
            extraData: {
                id : "361372"
            },
            success(res) {
                console.log("兔小巢打开成功", res);
            },
            fail(err) {
                console.error("兔小巢打开失败", err);
            },
            complete(res) {
                console.info("兔小巢操作完成", res);
            }
        });
    },

    enterPrivacyPolicy(e) {
        const url = "https://assets.ducg.aiphsn.com/user-content/docs/privacy-policy.html";
        wx.navigateTo({url: `../webpage/webpage?url=${url}`});
    },

    enterUserAgreement(e) {
        const url = "https://assets.ducg.aiphsn.com/user-content/docs/termsof-service.html";
        wx.navigateTo({url: `../webpage/webpage?url=${url}`});
    }

});
