// pages/lore/lore.js
import CustomPage from '../../../base/CustomPage';
import moment from "../../../libs/moment.min";
// import {setLastPage} from '../../utils/util';
import {debounce} from 'throttle-debounce';
import Const from "../../../utils/const";


CustomPage({


    /**
     * 页面的初始数据
     */
    data: {
        tag: "lore.js",
        tabs: [],
        // activeTab: true,
        hasMore: true,
        blogs: [],
        totalPageNumber: 0,
        pageNumber: 1,
        categoryId: 1,
        pageSize: 10,
        tabIndex:0
    },

    onTabClick(e) {
        const  tabIndex = e.detail.currentTarget.dataset.index;
        // const activeTab = tabIndex === 0;
        console.log(tabIndex);
        let categoryId = this.data.categoryId;
        if (tabIndex === 0) categoryId = 1;
        if (tabIndex === 1) categoryId = 2;
        if (tabIndex === 2) categoryId = 3;
        this.setData({categoryId,tabIndex,blogs:[]});
        this.getKnowledgeList(true);
    },

    // @wx.api.auth
    onLoreItemClick(e) {
        const {detailUrl} = e.currentTarget.dataset.set;
        console.log(detailUrl);
        const url = encodeURIComponent(detailUrl);
        wx.navigateTo({url: `../webpage/webpage?url=${url}`});
    },

    // @wx.api.auth
    getExpertServicesEnterDiagnosisList(e) {
        const that = this;
        const app = getApp();

        if (app.globalData.expertService) {
            wx.navigateTo({url: `../record/ailist/ailist?sourceType=${Const.SourceType.DIAGNOSIS}`});
            return;
        }
        wx.api.getExpertServiceList()
            .then(res => {
                const {code, msg, data} = res;
                const {expertServices} = data;

                if (0 === code) {
                    app.globalData.expertService = expertServices[0];
                    wx.navigateTo({url: `../record/ailist/ailist?sourceType=${Const.SourceType.DIAGNOSIS}`});
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
            });
    },

    getKnowledgeList(upDown = true) {
        const that = this;
        let requestData = {categoryId: this.data.categoryId};
        if (upDown) { // 下拉刷新还原默认值
            that.setData({hasMore: true, pageNumber: 1});
        } else { // 加载更多则显示loading
            const {pageNumber, pageSize} = that.data;
            requestData = Object.assign(requestData, {pageNumber: pageNumber + 1, pageSize});
        }
        if (!upDown && !this.data.hasMore) return;
        wx.api.getBlogList(requestData)
            .then(res => {
                const {code, msg, data} = res;
                const {blogs, total} = data;

                if (0 === code) {
                    // 处理数据
                    if (blogs && Array.isArray(blogs)) {
                        for (const blog of blogs) {  //"2020-09-26 15:12:29"
                            blog.createdAt = moment(blog.createdAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
                        }
                    }
                    // 添加数据
                    if (upDown) {
                        const {pageSize} = that.data;
                        let totalPageNumber = parseInt(total / pageSize);
                        if (total % pageSize !== 0) totalPageNumber += 1;
                        that.setData({blogs, totalPageNumber});
                    } else {
                        that.setData({blogs: that.data.blogs.concat(blogs), pageNumber: requestData.pageNumber});
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

    searchLores(e) {
        wx.navigateTo({url: `./search/search`});
    },
    toClassDetail(a){
        console.log(a);
        wx.navigateTo({
          url: '../classdetail/classdetail',
        })
    },

     // @wx.api.auth
     onLoreItemClick(e) {
         console.log(e)
        const {detailUrl} = e.currentTarget.dataset.set;
        console.log(detailUrl);
        const url = encodeURIComponent(detailUrl);
        wx.navigateTo({url: `../../webpage/webpage?url=${url}`});
    },
    
    // onTabItemTap(item) {
    //     const {pagePath} = item;
    //     setLastPage(pagePath);
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getKnowledgeList(true);
        this.getKnowsDebounce = debounce(500, false, this.getKnowledgeList);
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
        this.getKnowledgeList(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getKnowsDebounce(false);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
