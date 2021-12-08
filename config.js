const bmap = require('./libs/bmap-wx.js');
const config = {
    develop: {
        oss_timeout: 1, //单位小时
        oss_file_size: 18, //单位MB
    },
    trial: {
        oss_timeout: 1, //单位小时
        oss_file_size: 18, //单位MB
    },
    release: {
        oss_timeout: 1, //单位小时
        oss_file_size: 18, //单位MB
    }
};

/**
 * 初始化全局配置
 * @param _
 */
const init_config = _ => {
    const accountInfo = wx.getAccountInfoSync();
    const env = accountInfo.miniProgram.envVersion;
    wx.config = config[env];
    wx.map = new bmap.BMapWX({ak: "ULVVCQnqsyyn7bzXiBQfQ39fRk06MCIr"});
}

export default init_config;