import axios from 'axios';
import mpAdapter from 'axios-miniprogram-adapter';
import Storage from "./storage";
import {getLogger} from "./log";
import Const from "./const";

// 接口日志记录
const logger = getLogger('api.js');

// 获取当前帐号信息
const accountInfo = wx.getAccountInfoSync();

// env类型
export const env = accountInfo.miniProgram.envVersion;

const baseApi = {
    // 开发版
    // develop: "http://192.168.110.141:45678",
    develop: "https://api-dev.ducg.aiphsn.com",
    // 体验版
    trial: "https://api-dev.ducg.aiphsn.com",
    // 正式版
    release: "https://api-prd.ducg.aiphsn.com"
};

const HOST_URL = baseApi[env] + "/api";
axios.defaults.adapter = mpAdapter;
axios.defaults.baseURL = HOST_URL;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    try {
        const {url, method} = config;
        logger.info("request", method, url,);
    } catch (error) {
        logger.error('request', error);
    }

    // 在发送请求之前做些什么
    config.headers["x-ducg-token"] = Storage.getToken();
    config.headers["x-ducg-channel"] = Storage.getChannel();
    return config;
}, function (error) {
    // 对请求错误做些什么
    logger.error(error);
    return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    try {
        const {data} = response;
        logger.info('response', data);
    } catch (error) {
        logger.error('response', error);
    }

    // 对响应数据做点什么
    if (response.status === 200) {
        const {code} = response.data;
        if (10001 === code) { // 未登录则跳转到登录页面
            Storage.clearLoginInfo();
            if (getApp().globalData.isAuthFinish)
                wx.redirectTo({url: '/pages/login/login'});
        }
        return response.data;
    } else {
        return Promise.reject(new Error('error'))
    }
}, function (error) {
    // 对响应错误做点什么
    logger.error(error);
    if (error && error.message && error.message.includes("Network Error")) {
        wx.showToast({title: '网络异常'});
    }
    return Promise.reject(error);
});

/**
 * 获取验证码
 */
const getSmsCode = data => axios.post('/v1/account/get_sms_code', data)

/**
 * 用户登录
 */
const login = data => axios.post('/v1/account/login', data)

/**
 * 用户登出
 */
const logout = data => axios.post('/v1/account/logout', data)

/**
 * 用户注册
 */
const register = data => axios.post('/v1/account/register', data);


/**
 *  获取用户信息
 */
const getUserInfo = data => axios.post('/v1/account/get_user_info', data);


/**
 * 更新用户信息
 *
 * @param data
 *      {
 *           "avatarUrl": "https://assets.plt.aiphsn.com/user-content/avatar/37693cfc748049e45d87b8c7d8b9aacd/XLbDIViN.png",
 *          "nickname": "静水流深"
 *      }
 * @returns {Promise<AxiosResponse<any>>}
 */
const updateUserInfo = data => axios.post('/v1/account/update', data);


/**
 *  获取动物列表
 */
const getAnimalList = data => axios.post('/v1/animal/get_list', data);

/**
 * 订阅动物（免费版仅限使用3种）
 */
const subscription = data => axios.post('/v1/order/subscription', data);

/**
 * 获取专家服务商品
 */
const getServices = _ => axios.post('/v1/commodity/expert_service/get_list');

/**
 * 获取用户套餐商品
 */
const getVips = _ => axios.post('/v1/commodity/service_plan/get_list');

/**
 * 获取知识内容列表
 {
        "pageNumber":0,
        "pageSize":10,
        "categoryId":0
    }
 */
const getBlogList = data => axios.post('/v1/blog/get_list', data);


/**
 * 获取商家信息
 *
 * @param data
    {
        "merchantId" : "1"
    }
 */
const getStoreInfo = data => axios.post('/v1/control/get_detail', data);


/**
 * 获取商家信息列表
 *
 * @param data
    {
        "longitude"： "23.12345678", 经度
        "latitude": "23.12345678", 纬度
        "scale" : 1  缩放比例
    }
 */
const getStoreList = data => axios.post('/v1/control/get_list', data);


/**
 * 诊断列表
 * @param data
    {
        "pageNumber":0,
        "pageSize":10
}
 */
const getDiagnosisList = data => axios.post('/v1/diagnosis/get_list', data);


/**
 * 订单列表
 * @param data
    {
        "pageNumber" : 0,
        "pageSize" : 10,
        "itemType" : "ServicePlan | ExpertService"
}
 */
const getOrderList = data => axios.post('/v1/order/list', data);


/**
 * 订单下单
 * @param data
    {
    "itemId":8,
    "itemType":"ServicePlan",
    "payType": "wechat",
    "price": 3
}
 */
const makeOrder = data => axios.post('/v1/wechat/order/make', Object.assign({payType: Const.PayType.WeChat}, data));


/**
 * 专家服务商品列表
 * @param data
 */
const getExpertServiceList = data => axios.post('/v1/commodity/expert_service/get_list', data);


/**
 * 订单详情
 * @param data
    {
        "orderId" : 0
    }
 */
const getOrderDetail = data => axios.post('/v1/order/detail', data);


/**
 * 专家诊断记录
 * @param data
    {
        "orderId" : 0
    }
 */
const getExpertDiagnosis = data => axios.post('/v1/expert_service/get_list', data);


/**
 * 专家诊断记录
 * @param data
    {
        "orderId" : 1
        "recognitionId" : 2
    }
 */
const makeExpertDiagnosis = data => axios.post('/v1/expert_service/create', data);


const getStsConfig = _ => axios.post('/v1/common/get_sts');

/**
 * 获取 DUCG 三方支持的配置信息
 */
const getDucgAuthUrl = params => axios.get('/v1/ducg/get_auth_url', {params});

/**
 * 用户反馈
 * @param data
 */
const postUserFeedback = data => axios.post('/v1/common/feedback',data);

/**
 * 用户鉴权函数
 *
 * @param target
 * @param name
 * @param descriptor
 * @returns {*}
 */
function auth(target, name, descriptor) {
    const original = descriptor.value;
    if (typeof original === 'function') {
        descriptor.value = function (...args) {
            const app = getApp();
            let token = app.globalData.token || wx.getStorageSync('token', token);
            if (token) {
                return original.apply(this, args);
            } else {
                wx.navigateTo({url: "/pages/login/login"});
            }
        }
    }
    return descriptor;
}

const init_api = _ => {
    // 初始化全局API接口的引用
    wx.api = {
        auth,
        login,
        logout,
        register,
        getSmsCode,
        getUserInfo,
        updateUserInfo,
        getAnimalList,
        subscription,
        getVips,
        getServices,
        getBlogList,
        getStoreList,
        getStsConfig,
        getStoreInfo,
        getDiagnosisList,
        makeExpertDiagnosis,
        getOrderList,
        makeOrder,
        getOrderDetail,
        getExpertDiagnosis,
        getExpertServiceList,
        postUserFeedback,
        getDucgAuthUrl
        // getToken3,
        // generateRedirectURL3,
        // getAnimalMedicalRecord3
    }

    // 验证Token是否有效，有效则获取用户信息并更新，无效则清空本地登录信息
    // 部分逻辑写在axios拦截器里面，此处为应用初始启动的一个触发点
    getUserInfo().then(res => {
        const {code, data} = res;
        if (0 === code) Storage.saveUserInfo(data);
    }).catch(err => {
        console.error(err);
    }).finally(_ => {
        getApp().globalData.isAuthFinish = true;
    });

}


export default init_api;
