// pages/record/edlist/detail/detail.js
import CustomPage from '../../../../base/CustomPage'

CustomPage({

    data: {
        tag: "detail.js",
        diagnosisInfo: {},
        activeds:0
    },
    // 解决
    contentResult: function(e){
       let activeds = e.currentTarget.dataset.index
        this.setData({activeds})
    },


    enterAIDiagosisPage(e) {
        const app = getApp();
        const {animalID, animalModelID, diagnosisSN} = this.data.diagnosisInfo.recognition;
        wx.api.getDucgAuthUrl({animalID, animalModelID, diagnosisSN}).then(res => {
            const {code, msg, data} = res;
            if (0 === code) {
                app.globalData.ducgUrl = encodeURI(data.url);
                wx.navigateTo({url: `../../../webpage/webpage`});
            } else {
                wx.showToast({title: msg})
            }
        }).catch(err => {
            console.error(err);
        });
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {diagnosisResult} = getApp().globalData;
        console.log(diagnosisResult);
        this.setData({diagnosisInfo: diagnosisResult})
    },

})