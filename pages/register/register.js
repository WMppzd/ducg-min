// pages/register/register.js
import CustomPage from '../../base/CustomPage';
import md5 from "blueimp-md5";
import Storage from "../../utils/storage";
import validator from "validator";
import {authorize} from "../../utils/util";

const timeNum = 60; //60秒倒计时
let countDownTime = timeNum;

CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        tag: "register.js",
        codeText: "发送验证码",
        codeAble: false,
        showTopTips: false,
        formData: {},
        rules: [{
            name: 'phone',
            rules: [{required: true, message: '请输入手机号'}, {phone: true, message: '手机号格式不对'}],
        }, {
            name: 'vcode',
            rules: {required: true, message: '请输入验证码'},
        }, {
            name: 'password',
            rules: {required: true, message: '请输入密码'},
        }],
        province: "",
        city: "",
        district: "",
        isAgree: false
    },

    getLocation() {
        const that = this;
        wx.map.regeocoding({
            fail: function (error) {
                console.error(error);
            },
            success: function (data) {
                console.log(data);
                const {province, city, district} = data.originalData.result.addressComponent;
                console.log(province, city, district)
                that.setData({province, city, district});
            }
        });
    },

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
        this.getLocation();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
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

    formInputChange(e) {
        const {field} = e.currentTarget.dataset;
        console.log(field);
        this.setData({
            [`formData.${field}`]: e.detail.value
        })
    },

    bindAgreeChange(e) {
        this.setData({isAgree: !!e.detail.value.length});
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

    registerUser() {
        wx.showLoading({
            title: '注册中',
        });

        const {province, city, district} = this.data;
        const data = {
            phone: this.data.formData['phone'],
            smsCode: this.data.formData['vcode'],
            password: md5(this.data.formData['password']),
            province, city, district
        }
        wx.api.register(data)
            .then(res => {
                const {code, msg, data} = res;
                if (0 === code) {
                    wx.showToast({title: '注册成功'});
                    // 存储Token和UserInfo
                    Storage.setLoginInfo(data);
                    // 跳转到主页面
                    wx.switchTab({url: '../diagnosis/diagnosis'});
                } else {
                    wx.showModal({
                        title: '注册失败',
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

    registerVcodeLoginForm() {
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
                if (!this.data.isAgree) {
                    wx.showModal({
                        title: '用户协议',
                        content: '请认真阅读并勾选用户协议',
                        confirmText: '我知道了',
                        showCancel: false
                    });
                    return;
                }
                authorize(this.registerUser, "您的位置信息将用于为您提供更好的本地化服务,请点击【确定】按钮进行开启吧").then(console.log).catch(console.error);
            }
        })
    }
})