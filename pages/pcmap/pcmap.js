// pages/pcmap/pcmap.js
import CustomPage from '../../base/CustomPage';
import {authorize} from '../../utils/util';
import coordtransform from "coordtransform";

const shopMarker = {
    id: 0,
    latitude: 0,
    longitude: 0,
    iconPath: '../../images/location.png',
    width: 40,
    height: 40
};
const shopMarkerCallout = {
    content: '门店名称',
    color: '#3ec93e',
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#3ec93e',
    bgColor: '#ffffff',
    padding: 8,
    display: 'BYCLICK',
    textAlign: 'center'
};


CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        tag: "pcmap.js",
        latitude: 36.79251706672237,
        longitude: 119.96648890873284,
        markers: [],
        customCalloutMarkerIds: [1, 2, 3],
        dialogShow: false,
        buttons: [{text: '取消'}, {text: '确定'}],
    },

    getStoreList(data) {
        // if (!this.isContiue) return;
        const that = this;
        wx.api.getStoreList(data)
            .then(res => {
                const {code, msg, data} = res;
                if (0 === code) {
                    const {merchants, recognitions} = data;
                    if (merchants && Array.isArray(merchants)) {
                        const shops = [];  // 合并成地图要求的指定格式的数据,
                        merchants.forEach(item => {
                            //百度经纬度坐标转国测局坐标
                            const bd09togcj02 = coordtransform.bd09togcj02(item.longitude, item.latitude);
                            let callout = Object.assign({}, shopMarkerCallout, {content: item.name});
                            shops.push(Object.assign({}, shopMarker, item, {callout}, {
                                longitude: bd09togcj02[0],
                                latitude: bd09togcj02[1]
                            }));
                        });
                        that.setData({markers: shops});
                    }
                } else {
                    that.log_error(code, msg);
                }
            })
            .catch(err => {
                that.log_error(err);
            })
            .finally(_ => {
                that.log_info("API GetShopList Finish.");
            });
    },

    getLocation() {
        const that = this;
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                const {longitude, latitude} = res;
                //国测局坐标转百度经纬度坐标
                const gcj02tobd09 = coordtransform.gcj02tobd09(longitude, latitude);
                const data = {longitude: gcj02tobd09[0], latitude: gcj02tobd09[1]};
                console.log("----", data);
                // const data = {longitude, latitude};
                that.setData(data);
                that.getStoreList(data);
            }
        });
    },

    regionchange(e) {
        this.log_info("视野发生变化时触发", e);
        const {type, detail} = e;
        if ('end' !== type) return;
        const {longitude, latitude} = detail.centerLocation;
        //国测局坐标转百度经纬度坐标
        const gcj02tobd09 = coordtransform.gcj02tobd09(longitude, latitude);
        const data = {longitude: gcj02tobd09[0], latitude: gcj02tobd09[1]};
        this.getStoreList(data);
    },

    markertap(e) {
        this.log_info("点击地图标记点触发", e);
    },

    @wx.api.auth
    callouttap(e) {
        this.log_info("点击标记点对应的气泡时触发", e);
        const markerId = encodeURIComponent(e.detail.markerId);
        wx.navigateTo({url: `../store/store?mid=${markerId}`});
    },

    labeltap(e) {
        console.log('@@@ labeltap', e);
    },

    // onTabItemTap(item) {
    //     const {pagePath} = item;
    //     setLastPage(pagePath);
    // },

    openSetting(e) {
        this.setData({dialogShow: false});
        if (1 !== e.detail.index) return;
        wx.openSetting();
    },

    // onLocationChangeFn(res) {
    //     console.log('位置变化', res);
    //     const {latitude, longitude,} = res;
    //     this.setData({latitude, longitude});
    //     this.getStoreList({latitude, longitude});
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
        this.mapCtx = wx.createMapContext('ducg_map')
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        authorize(this.getLocation, "您的位置信息将用于获取附近商家门店的信息展示").then(console.log).catch(console.error);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        /*
        wx.stopLocationUpdate();
        wx.offLocationChange(this.onLocationChangeFn);
        */
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
});
