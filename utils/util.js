import wxp from "./wxp";
import {getLogger} from "./log";

const logger = getLogger("util.js");

export const setLastPage = pageUrl => {
    getApp().globalData.lastPage = pageUrl;
};

export const getLastPage = _ => {
    return getApp().globalData.lastPage;
};


export const authorize = async (func, desc) => {
        const resSetting = await wxp.getSetting();
        logger.info(resSetting);

        if (!resSetting.authSetting['scope.userLocation']) {
            const resAuthorize = await wxp.authorize({scope: 'scope.userLocation'});
            logger.info(resAuthorize);

            if (resAuthorize && resAuthorize.errMsg.includes("authorize:fail")) {
                const restModal = await wxp.showModal({title: '位置权限使用说明', content: desc});
                if (restModal.confirm) await wxp.openSetting();
                else if (restModal.cancel) return Promise.reject("取消授权");
            }else {
                return Promise.resolve("初次授权");
            }
        } else {
            func();
            return Promise.resolve("已经授权");
        }
};
