# DUCG 小程序项目说明

### 微信内置库

* [WeUI](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/)
* [WePay](https://pay.weixin.qq.com/wiki/doc/api/index.html)

### 引用三方库

> EasyUI 库直接复制代码引用即可

* [EasyUI](https://github.com/qq865738120/easyUI) 

* [JS函数防抖和节流工具库(ThrottleDebounce)](https://github.com/niksy/throttle-debounce) 

* [Coordtransform 坐标转换](https://github.com/wandergis/coordtransform) —— 百度地图与腾讯地图地标之间的转换

* [OSS-JS-SDK](https://github.com/ali-sdk/ali-oss) —— [阿里云 OSS 存储 SDK 示例](https://help.aliyun.com/document_detail/92883.html)

* [JavaScript MD5](https://github.com/blueimp/JavaScript-MD5) 

* [crypto-js](https://github.com/brix/crypto-js) 

* [js-base64](https://github.com/dankogai/js-base64) 


### 合法域名 | 业务域名

1. 微信小程序网络请求的合法域名
   
    * https://aiducg.oss-cn-qingdao.aliyuncs.com  上传图片 【开发】=>【开发设置】=>【uploadFile合法域名】
    
    * https://assets.ducg.aiphsn.com/ 展示图片（通用）
    
    *  https://api-prd.ducg.aiphsn.com/  接口域名(生产)
    
    *  https://api-dev.ducg.aiphsn.com/  接口域名(开发)
    
2. 微信小程序 web-view 组件的业务域名

    * 知识库提供的网页页面需要设置业务域名
      
        *  https://api-dev.ducg.aiphsn.com
        *  https://api-prd.ducg.aiphsn.com
    
    * DUCG提供的H5版的动物诊断功能页面需要设置业务域名
      
        *  https://animaldev.tsingruitech.com
        *  https://animal.tsingruitech.com
    
    * 用户隐私政策以及用户协议需要设置阿里云OSS CDN域名
      
        *  https://assets.ducg.aiphsn.com
    
3. TODO

### 跳转3方小程序

* [wx.navigateToMiniProgram(Object object)](https://developers.weixin.qq.com/miniprogram/dev/api/navigate/wx.navigateToMiniProgram.html)
* [复制任意微信小程序页面路径](https://developers.weixin.qq.com/community/develop/article/doc/0008066531c28043d2185a4d356813)

### 资料

* [反向代理解决微信小程序业务域名限制问题](http://lyyljs.site/2019/06/05/%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86%E8%A7%A3%E5%86%B3%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%B8%9A%E5%8A%A1%E5%9F%9F%E5%90%8D%E9%99%90%E5%88%B6%E9%97%AE%E9%A2%98/)

### 待解决问题

* [访问CDN加速域名报错“You are forbidden to list buckets”](https://help.aliyun.com/document_detail/206224.html) 参考 [阿里云 OSS 存储 SDK 示例](https://help.aliyun.com/document_detail/92883.html)

### 测试数据

```json
{
  "errcode":40163,
  "errmsg":"code been used, rid: 613033ae-4a5a9224-3a2b9999"
}

// 小程序登录结果——wx.login()
{
  "errMsg": "login:ok",
  "code": "081pVmGa1YykHB0oWtFa1ppAmK2pVmGO"
}

// 登录凭证校验。
// 通过 wx.login 接口获得临时登录凭证 code 后传到开发者服务器调用此接口完成登录流程。
// https://api.weixin.qq.com/sns/jscode2session
{
  "session_key":"JnEQvLpN8rh81xB5aCFwkQ==",
  "openid":"otNkE5EjC2khirZoro3jLMEpIS1A"
}

// 小程序发起支付——wx.requestPayment
{
  "errMsg": "requestPayment:ok",  // 支付成功回调
  "errMsg": "requestPayment:fail cancel"  // 支付取消回调
}

```

[微信支付统一下单接口返回的数据](https://api.mch.weixin.qq.com/pay/unifiedorder)

```xml

<xml>

    <return_code><![CDATA[SUCCESS]]></return_code>
    
    <return_msg><![CDATA[OK]]></return_msg>
    
    <result_code><![CDATA[SUCCESS]]></result_code>
    
    <mch_id><![CDATA[1575679631]]></mch_id>
    
    <appid><![CDATA[wx13e46827bd5d850c]]></appid>
    
    <device_info><![CDATA[WEB]]></device_info>
    
    <nonce_str><![CDATA[AICB39NUQxDAl7X1]]></nonce_str>
    
    <sign><![CDATA[E8DC392402CBB17D30902F9EB67BEEB6]]></sign>
    
    <prepay_id><![CDATA[wx02103920085732f577df713e2283860000]]></prepay_id>
    
    <trade_type><![CDATA[JSAPI]]></trade_type>

</xml>
```

### HTTPS证书

```text

# 小程序专用

Certificate Name: api-dev.ducg.aiphsn.com
    Domains: api-dev.ducg.aiphsn.com
    Expiry Date: 2021-12-04 07:28:11+00:00 (VALID: 89 days)
    Certificate Path: /etc/letsencrypt/live/api-dev.ducg.aiphsn.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/api-dev.ducg.aiphsn.com/privkey.pem

```

### 腾讯音视频

```text
实时音视频后台：https://console.cloud.tencent.com/

SDKAppID:1400596792
秘钥：b75de67d705a771d0d5a682e8fbab7f7dd869e3d5c0ee40a0e47711fde64fff5
```

* [微信小程序音视频解决方案](https://cloud.tencent.com/solution/wx-video?from=14588)
* [微信小程序音视频解决方案 Demo](https://github.com/tencentyun/TRTCSDK/tree/master/WXMini)
* 

