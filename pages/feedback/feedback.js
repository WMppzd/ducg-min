// pages/feedback/feedback.js
import CustomPage from "../../base/CustomPage";
import validator from 'validator';


const rules = [
    {
        name: 'desc',
        rules: {required: true, message: '请输入意见或内容'},
    }, {
        name: 'title',
        rules: {required: true, message: '请输入标题'},
    }, {
        name: 'contact',
        rules: [{required: true, message: '请输入手机号'}],
    }
];

CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        showTopTips: false,
        formData: {},
        rules: rules
    },

    formInputChange(e) {
        const {field} = e.currentTarget.dataset;
        this.setData({[`formData.${field}`]: e.detail.value});
    },

    submitForm() {
        const that = this;
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
                const phoneNum = that.data.formData['contact'];
                const valid = validator.isMobilePhone(phoneNum ? phoneNum : "", "zh-CN");
                if (!valid) {
                    this.setData({error: "手机号格式不对"})
                } else {
                    const data = that.data.formData;
                    wx.api.postUserFeedback(data)
                        .then(res => {
                            const {code, msg} = res;
                            if (0 === code) {
                                wx.showToast({title: '反馈成功'});
                                wx.navigateBack();
                            } else {
                                wx.showModal({
                                    title: '反馈失败',
                                    content: msg,
                                    confirmText: '我知道了',
                                    showCancel: false
                                })
                            }
                        })
                        .catch(err => {
                            that.log_error(err);
                        });
                }
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