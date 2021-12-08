// pages/order/detail/detail.js
import CustomPage from '../../../base/CustomPage';
import Const from "../../../utils/const";

CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        tag: "order/detail.js",
        orderInfo: {}
    },

    getOrderDetail(orderId) {
        const that = this;
        wx.api.getOrderDetail({orderId})
            .then(res => {
                const {code, msg, data} = res;
                const {orderInfo} = data;

                if (0 === code) {
                    const {state, payType, price} = orderInfo;
                    orderInfo.price = price/100 + "元";
                    orderInfo.state = Const.OrderStateMap[state];
                    orderInfo.payType = Const.PayTypeMap[payType];
                    that.setData({orderInfo});
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

            });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {orderId} = options;
        this.getOrderDetail(orderId);
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