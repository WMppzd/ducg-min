// pages/login/login.js
import validator from 'validator';
import md5 from 'blueimp-md5';
import Storage from '../../utils/storage';
import CustomPage from '../../base/CustomPage';

const timeNum = 60; //60秒倒计时
let countDownTime = timeNum;

const rulesSms = [{
    name: 'phone',
    rules: [{required: true, message: '请输入手机号'}, {phone: true, message: '手机号格式不对'}],
}, {
    name: 'vcode',
    rules: {required: true, message: '请填写验证码'},
}];

const rulesPwd = [{
    name: 'phone',
    rules: [{required: true, message: '请输入手机号'}, {phone: true, message: '手机号格式不对'}],
}, {
    name: 'password',
    rules: {required: true, message: '请填写登录密码'},
}];

CustomPage({

    data: {
        showTopTips: false,
        codeText: "发送验证码",
        codeAble: false,
        formData: {},
        loginType: 'password',
        loginTypeDesc: "验证码登录",
        rules: rulesPwd
    },

    formInputChange(e) {
        const {field} = e.currentTarget.dataset;
        console.log(field);
        this.setData({
            [`formData.${field}`]: e.detail.value
        })
    },

    enterRegisterPage: function (_) {
        wx.navigateTo({url: '../register/register'});
    },

    switchLoginType: function (_) {
        if ('smsCode' === this.data.loginType) {
            this.setData({
                loginType: 'password',
                loginTypeDesc: "验证码登录",
                rules: rulesPwd
            });
        } else if ('password' === this.data.loginType) {
            this.setData({
                loginType: 'smsCode',
                loginTypeDesc: "密码登录",
                rules: rulesSms
            });
        }

    },

    setInterval: function () {
        const that = this;
        this.timer = setInterval(function () { // 设置定时器
            countDownTime--;
            if (countDownTime < 2) {
                clearInterval(that.timer);
                that.setData({codeAble: false, codeText: "发送验证码"});
                countDownTime = timeNum;
            } else {
                that.setData({codeAble: true, codeText: countDownTime + "s"});
            }
            console.log(countDownTime + "s");
        }, 1000);
    },

    sendSmsCode: function (e) {
        const phoneNum = this.data.formData['phone'];
        const result = validator.isMobilePhone(phoneNum ? phoneNum : "", "zh-CN");
        if (result) {
            wx.showLoading({
                title: '发送中',
            })
            const data = {phone: this.data.formData['phone']}
            const that = this;
            wx.api.getSmsCode(data)
                .then(response => {
                    console.log(response);
                    const {code, msg} = response;

                    if (0 === code) {
                        wx.showToast({title: '发送成功'});
                        that.setInterval();
                    } else {
                        wx.showModal({
                            title: '发送失败',
                            content: msg,
                            confirmText: '我知道了',
                            showCancel: false
                        })
                    }
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(_ => {
                    wx.hideLoading();
                });
        } else {
            wx.showModal({
                title: '操作提示',
                content: "请检查手机号是否正确",
                confirmText: '我知道了',
                showCancel: false
            })
        }
    },

    submitVcodeLoginForm() {
        this.selectComponent('#form').validate((valid, errors) => {
            console.log('valid', valid, errors)
            if (!valid) {
                const firstError = Object.keys(errors)
                if (firstError.length) {
                    this.setData({
                        error: errors[firstError[0]].message
                    })
                }
            } else {
                wx.showLoading({
                    title: '登录中',
                })

                const loginType = this.data.loginType;
                const data = {loginType, phone: this.data.formData['phone']}
                if ('password' === loginType) {
                    data['password'] = md5(this.data.formData['password']);
                }
                if ('smsCode' === loginType) {
                    data['smsCode'] = this.data.formData['vcode'];
                }

                wx.api.login(data)
                    .then(res => {
                        const {code, msg, data} = res;
                        if (0 === code) {
                            wx.showToast({title: '登录成功'});
                            // 存储token和userinfo
                            Storage.setLoginInfo(data);
                            // 跳转到主页面
                            wx.navigateBack();
                        } else {
                            wx.showModal({
                                title: '登录失败',
                                content: msg,
                                confirmText: '我知道了',
                                showCancel: false
                            })
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    })
                    .finally(_ => {
                        wx.hideLoading();
                    });
            }
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    }
    ,

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    ,

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    }
    ,

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    }
    ,

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }
    ,

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})