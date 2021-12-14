// pages/order/order.js
import CustomPage from '../../../base/CustomPage';
import moment from "../../../libs/moment.min";
import {debounce} from "throttle-debounce";
import Const from "../../../utils/const";

CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        tag: "order/list.js",
        activeTab: true,
        has_more: false,
        hasMore: true,
        orders: [],
        totalPageNumber: 0,
        pageNumber: 1,
        pageSize: 10,
        tabIndex:0
    },

    onTabClick(e) {
        // const {index} = e.detail.currentTarget.dataset;

        const  tabIndex = e.detail.currentTarget.dataset.index;
        // const activeTab = tabIndex === 0;
        console.log(tabIndex);
        // let categoryId = this.data.categoryId;
        // if (tabIndex === 0) categoryId = 1;
        // if (tabIndex === 1) categoryId = 2;
        // if (tabIndex === 2) categoryId = 3;

        // console.log(e)
        // const activeTab = index === 0;
        
        // const activeTab = tabIndex ;
        this.setData({tabIndex});
    },

    onOrderClick(e) {
        const {order} = e.currentTarget.dataset;
        wx.navigateTo({url: `../detail/detail?orderId=${order.orderId}`});
    },


    getOrderList(upDown = true) {
        const that = this;
        let requestData = {itemType: Const.OrderType.ExpertService};
        if (upDown) { // 下拉刷新还原默认值
            that.setData({hasMore: true, pageNumber: 1});
        } else { // 加载更多则显示loading
            const {pageNumber, pageSize} = that.data;
            requestData = Object.assign(requestData, {pageNumber: pageNumber + 1, pageSize});
        }
        if (!upDown && !this.data.hasMore) return;
        wx.api.getOrderList(requestData)
            .then(res => {
                const {code, msg, data} = res;
                const {orders, total} = data;

                if (0 === code) {
                    // 处理数据
                    if (orders && Array.isArray(orders)) {
                        for (const item of orders) {  //"2020-09-26 15:12:29"
                            item.createdAt = moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
                        }
                    }
                    // 添加数据
                    if (upDown) {
                        const {pageSize} = that.data;
                        let totalPageNumber = parseInt(total / pageSize);
                        if (total % pageSize !== 0) totalPageNumber += 1;
                        that.setData({orders, totalPageNumber});
                    } else {
                        that.setData({
                            orders: that.data.orders.concat(orders),
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
        this.getOrderList(true);
        this.getOrderDebounce = debounce(500, false, this.getOrderList);
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
        this.getOrderList(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getOrderDebounce(false);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})