// pages/diagnosis/diagnosis.js
import CustomPage from '../../base/CustomPage'
import Storage from '../../utils/storage';
import {authorize} from '../../utils/util';
import axios from 'axios';
// import {setLastPage} from '../../utils/util';
import coordtransform from "coordtransform";


CustomPage({

    /**
     * 页面的初始数据
     */
    data: {
        tag: "diagnosis.js",
        blogs: [],
        categories: [],
        province: "",
        city: "",
        district: "",
        latitude: 0,
        longitude: 0,
        // height: wx.getSystemInfoSync().screenWidth * 0.5,
    },


    getLocation() {
        const that = this;
        wx.map.regeocoding({
            fail: function (error) {
                console.error(error);
            },
            success: function (data) {
                console.log(data);
                const {result} = data.originalData;
                const {addressComponent, location} = result;

                const {province, city, district} = addressComponent;
                const {lat, lng} = location;

                //国测局坐标转百度经纬度坐标
                const [longitude, latitude] = coordtransform.gcj02tobd09(lng, lat);
                that.setData({province, city, district, latitude, longitude});
            }
        });
    },

    enterAD(e) {
        const {url} = e.currentTarget.dataset;
        wx.navigateTo({url: `../webpage/webpage?url=${encodeURIComponent(url)}`});
    },

    @wx.api.auth
    enterAI(e) {
        const app = getApp();
        const {animal} = e.currentTarget.dataset;
        const {online, animalID, animalModelID} = animal;
        const {province, city, district, latitude, longitude} = this.data;
        if (online) {
            authorize(() => {
                    wx.api.getDucgAuthUrl({animalID, animalModelID, province, city, district, latitude, longitude})
                        .then(res => {
                            const {code, msg, data} = res;
                            if (0 === code) {
                                app.globalData.ducgUrl = encodeURI(data.url);
                                wx.navigateTo({url: `../webpage/webpage`});
                            } else {
                                wx.showToast({title: msg})
                            }
                        })
                        .catch(err => {
                            console.error(err);
                        });
                },
                "您的位置信息将用于为您提供更好的诊断服务,请点击【确定】按钮开启")
                .then(console.log)
                .catch(console.error);

        } else {
            wx.showToast({title: "敬请期待"})
        }
    },

    getAllData(isPullDown) {
        // 优先加载本地缓存数据进行展示
        const blogs = Storage.getBannerList();
        const categories = Storage.getAnimalList();
        if (blogs && categories) this.setData({blogs, categories})

        // 其次请求网络
        let requestData = {categoryId: 3};
        let that = this;
        axios.all([wx.api.getAnimalList(), wx.api.getBlogList(requestData)])
            .then(axios.spread(function (animals, banners) {
                if (0 === animals.code && 0 === banners.code) { // TODO 缓存
                    const {categories} = animals.data;
                    const {blogs} = banners.data;
                    // 展示数据
                    that.setData({categories, blogs});
                    // 缓存数据
                    Storage.saveBannerList(blogs);
                    Storage.saveAnimalList(categories);
                } else {
                    that.log_warn(animals.msg, banners.msg);
                }
            }))
            .catch(err => {
                that.log_error(err);
            })
            .finally(_ => {
                if (isPullDown) wx.stopPullDownRefresh();
            });
    },

    enterMall(e) {
        wx.switchTab({url: `../mall/mall`});
    },

    // onTabItemTap(item) {
    //     const {pagePath} = item;
    //     setLastPage(pagePath);
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAllData(false);
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
        this.getAllData(true);
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
