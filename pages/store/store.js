// pages/store/store.js
import CustomPage from '../../base/CustomPage';


CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        tag: "store.js",
        name: "商家名称",
        phone: "010-65566001",
        address: "商家地址",
        imageURL: "https://assets.plt.aiphsn.com/user-content/apps/default.jpeg"
    },

    getStoreInfo(merchantId) {
        const that = this;
        wx.api.getStoreInfo({merchantId})
            .then(res => {
                const {code, msg, data} = res;
                if (0 === code) {
                    that.setData({...data.merchant});
                } else {
                    that.log_warn(msg);
                }
            })
            .catch(err => {
                that.log_error(err);
            });
    },

    navigateMap(e) {
        const latitude = parseFloat(this.data.latitude);
        const longitude = parseFloat(this.data.longitude);
        wx.openLocation({latitude, longitude, scale: 16})
    },

    dialogPhone(e) {
        wx.makePhoneCall({phoneNumber: this.data.phone});
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {mid} = options;
        const markerId = decodeURIComponent(mid);
        this.getStoreInfo(markerId);
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