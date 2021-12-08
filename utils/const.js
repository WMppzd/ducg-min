export default class Const {

    static SourceType = {
        MINE: "MINE",
        DIAGNOSIS: "DIAGNOSIS"
    }

    static OrderType = {
        ExpertService: "ExpertService",
        ServicePlan: "ServicePlan"
    }

    static OrderState = {
        Created: "Created",
        Aborted: "Aborted",
        Paid: "Paid"
    }

    static OrderStateMap = {
        Created: "已创建",
        Aborted: "已取消",
        Paid: "已支付"
    }

    static PayType = {
        WeChat: "wechat",
        AliPay: "alipay"
    }

    static PayTypeMap = {
        wechat: "微信",
        alipay: "支付宝"
    }

    static DiagnosisStateMap = {
        InProgress: "诊断中",
        Done: "诊断完成"
    }

}