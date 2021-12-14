import wxp from "../../../utils/wxp";
import {getLogger} from "../../../utils/log";
import Const from "../../../utils/const";

const logger = getLogger("ailist-logic.js");

export default class AilistLogic {

    static async makeWechatOrder(diagnosis, expertService) {
        if (!expertService) {
            wx.showModal({
                title: '提示',
                content: "请检查网络并重启小程序重试",
                confirmText: '我知道了',
                showCancel: false
            });
            return Promise.reject("请检查网络并重启小程序重试");
        }
        // ① 获取微信授权码
        const resLogin = await wxp.login();
        logger.info(resLogin);
        if (!resLogin.errMsg.includes("login:ok")) {
            return Promise.reject(resLogin.errMsg);
        }


        // ② 登录微信获取openid并下单
        const orderParams = Object.assign({authCode: resLogin.code}, expertService);
        const resOrder = await wx.api.makeOrder(orderParams);
        logger.info(resOrder);

        const {code, msg, data} = resOrder;
        const {order, wechatPayParams} = data;
        if (0 !== code) {
            wx.showModal({
                title: '提示',
                content: msg,
                confirmText: '我知道了',
                showCancel: false
            });
            return Promise.reject(msg);
        }

        // ③ 下单成功后返回支付参数并发起微信支付
        const resPay = await wxp.requestPayment(wechatPayParams);
        logger.info(resPay);
        if (resPay.errMsg.includes("requestPayment:ok")) {
            wx.showToast({title: "支付成功"});
        }
        if (resPay.errMsg.includes("requestPayment:fail cancel")) {
            wx.showToast({title: "支付取消"});
            return Promise.reject(resPay.errMsg);
        }

        // ④ 支付成功则验证业务服务器订单是否回调成功
        const paramsCheck = {orderId: order.orderId}
        const resCheck = await wx.api.getOrderDetail(paramsCheck);
        const {state} = resCheck.data.orderInfo;
        if (state !== Const.OrderState.Paid) return Promise.reject(resCheck.msg);

        // ⑤ 订单验证支付成功后则创建专家诊断服务项目并将其与订单关联
        const paramsED = {orderId: order.orderId, recognitionId: diagnosis.id};
        return wx.api.makeExpertDiagnosis(paramsED);
    }

}