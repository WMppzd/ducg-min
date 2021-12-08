// app.js
import init_api from './utils/api';
import init_config from './config';
import moment from "./libs/moment.min";

moment.locale('zh-cn');

const themeListeners = []

App({

    globalData: {
        theme: wx.getSystemInfoSync().theme,
        userInfo: null,
        token: "",
        ducgUrl: "",
        lastPage: "pages/diagnosis/diagnosis",
        diagnosisResult: {},
        expertService: null,
        isAuthFinish: false
    },

    onLaunch() {
        init_api();
        init_config();
    },

    onThemeChange({theme}) {
        this.globalData.theme = theme
        themeListeners.forEach((listener) => {
            listener(theme)
        })
    },

    watchThemeChange(listener) {
        if (themeListeners.indexOf(listener) < 0) {
            themeListeners.push(listener)
        }
    },

    unWatchThemeChange(listener) {
        const index = themeListeners.indexOf(listener)
        if (index > -1) {
            themeListeners.splice(index, 1)
        }
    },

})
