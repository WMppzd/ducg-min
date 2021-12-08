// pages/profile/profile.js
import CustomPage from '../../base/CustomPage';
import Storage from "../../utils/storage";
import {uploadAvatar, getFormOssParams} from '../../utils/upload';

const base64 = require("../../images/base64");

CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        tag: "profile.js",
        phone: "",
        nickname: "",
        avatarUrl: base64.icon20,
        dialogShow: false,
        dialogTitle: "",
        buttons: [{text: '取消'}, {text: '确定'}],
        placeholder: "在此输入...",
        dialogContent: "",
    },

    updateUserAvatar(avatar) {
        const that = this;
        const avatarUrl = that.ossHostShow + "/" + avatar;
        const data = {nickname: that.data.nickname, avatarUrl}
        wx.api.updateUserInfo(data)
            .then(res => {
                const {code, msg, data} = res;
                if (0 === code) {
                    // 将最新的用户信息保存
                    Storage.saveUserInfo(data);
                    // 刷新当前页的用户信息
                    that.showUserInfo();
                } else {
                    that.log_error(msg);
                }
            })
            .catch(err => {
                that.log_error(err);
            });
    },

    onChooseAvatar: function (e) {
        const self = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                self.log_info(res);
                // tempFilePath可以作为img标签的src属性显示图片
                const filePath = res.tempFilePaths;

                uploadAvatar(
                    self.ossHostUpload,
                    filePath[0],
                    self.formOssParams,
                    res => {
                        self.log_info(res);
                        self.updateUserAvatar(res);
                    },
                    err => {
                        self.log_error(err);
                    }
                );
            },
            fail(error) {

            },
            complete(res) {

            }
        })
    },

    modifyNickname(e) {
        const {nickname} = this.data;
        this.setData({dialogShow: true, dialogTitle: "修改昵称", placeholder: nickname});
    },

    modifyPassword(e) {
        this.setData({dialogShow: true, dialogTitle: "修改密码", placeholder: ""});
    },

    formInputChange(e) {
        this.setData({dialogContent: e.detail.value});
    },

    tapDialogButton(e) {
        this.setData({dialogShow: false});
        if (1 !== e.detail.index) return;

        const {dialogContent} = this.data;
        if (!dialogContent) return;

        wx.showLoading({
            title: '修改中',
        });

        const {dialogTitle} = this.data;
        if ("修改昵称" === dialogTitle) {
            const data = {nickname: dialogContent, avatarUrl: this.data.avatarUrl}
            wx.api.updateUserInfo(data)
                .then(res => {
                    const {code, msg, data} = res;
                    if (0 === code) {
                        wx.showToast({title: '修改成功'});
                        // 将最新的用户信息保存
                        Storage.saveUserInfo(data);
                        // 刷新当前页的用户信息
                        this.showUserInfo();
                    } else {
                        wx.showModal({
                            title: '修改失败',
                            content: msg,
                            confirmText: '我知道了',
                            showCancel: false
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(_ => {
                    wx.hideLoading();
                });
        }

        if ("修改密码" === dialogTitle) {

        }
    },

    logout(e) {
        wx.showLoading({
            title: '退出登录中',
        })
        wx.api.logout()
            .then(res => {
                console.log("success", res);
                const {code, msg, data} = res;
                if (0 === code) {
                    wx.showToast({title: '退出成功'});
                    // 清除token和userinfo
                    Storage.clearLoginInfo(data);
                    // 跳转到主页面
                    wx.switchTab({url: '../diagnosis/diagnosis'});
                } else {
                    wx.showModal({
                        title: '退出失败',
                        content: msg,
                        confirmText: '我知道了',
                        showCancel: false
                    });
                }
            })
            .catch(err => {
                console.error(err);
            })
            .finally(_ => {
                wx.hideLoading();
            });
    },

    showUserInfo() {
        const userInfo = Storage.getUserInfo();
        this.setData(userInfo);
    },

    initAliOss() {
        const that = this;
        wx.api.getStsConfig().then(res => {
            console.log(res);
            const {prefixUrl, uploadUrl, stsToken} = res.data;
            that.ossHostUpload = uploadUrl;
            that.ossHostShow = prefixUrl;
            console.log(that.ossHost);
            const {AccessKeyId, AccessKeySecret, SecurityToken} = stsToken;
            that.formOssParams = getFormOssParams(AccessKeyId, AccessKeySecret, SecurityToken);
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initAliOss();
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
        this.showUserInfo();
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