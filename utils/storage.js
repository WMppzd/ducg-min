const setLoginInfo = info => {
    const {token, userInfo} = info;
    const app = getApp();
    app.globalData.token = token;
    app.globalData.userInfo = userInfo;
    wx.setStorageSync('token', token);
    wx.setStorageSync('userInfo', userInfo);
}

const clearLoginInfo = _ => {
    const app = getApp();
    app.globalData.token = null;
    app.globalData.userInfo = null;
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
}

const getToken = _ => {
    const app = getApp();
    let token = app.globalData.token;
    if (token) return token;
    token = wx.getStorageSync('token');
    if (token) {
        app.globalData.token = token;
        return token;
    }
    return "";
};

// TODO 完善渠道信息
const getChannel = _ => {
    const app = getApp();
    let channel = app.globalData.channel;
    if (channel) return channel;
    channel = wx.getStorageSync('channel');
    if (channel) {
        app.globalData.token = channel;
        return channel;
    }
    return "";
};

const getUserInfo = _ => {
    const app = getApp();
    let userInfo = app.globalData.userInfo;
    if (userInfo) return userInfo;
    userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
        app.globalData.userInfo = userInfo;
        return userInfo;
    }
    return null;
};

const saveUserInfo = info => {
    const {userInfo} = info;
    const app = getApp();
    app.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
};

const saveAnimalList = data => {
    wx.setStorageSync('ducg_animals', data);
};

const getAnimalList = _ => {
    const animals = wx.getStorageSync('ducg_animals');
    if(animals) return animals;
    else return null;
};

const saveBannerList = data => {
    wx.setStorageSync('ducg_banners', data);
};

const getBannerList = _ => {
    const banners = wx.getStorageSync('ducg_banners');
    if(banners) return banners;
    else return null;

};

export default {
    setLoginInfo,
    getToken,
    getChannel,
    getUserInfo,
    saveUserInfo,
    getAnimalList,
    saveAnimalList,
    getBannerList,
    saveBannerList,
    clearLoginInfo
}