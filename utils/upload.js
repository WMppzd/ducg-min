import crypto from 'crypto-js';
import md5 from "blueimp-md5";
import {Base64} from 'js-base64';


/**
 * 获取策略 - Policy
 * @returns {string}
 */
function getPolicyBase64() {
    const date = new Date();
    date.setHours(date.getHours() + wx.config.oss_timeout);
    const policyText = { //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
        "expiration": date.toISOString(),
        "conditions": [ // 设置上传文件的大小限制-18MB
            ["content-length-range", 0, wx.config.oss_file_size * 1024 * 1024]
        ]
    };
    return Base64.encode(JSON.stringify(policyText));
}

/**
 * 计算签名
 * @param accessKeySecret
 * @param canonicalString
 * @returns {*}
 */
function computeSignature(accessKeySecret, canonicalString) {
    return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret));
}

/**
 * 获取OSS请求数据
 * @param accessKeyId
 * @param accessKeySecret
 * @param securityToken
 * @returns {{OSSAccessKeyId: *, signature: *, "x-oss-security-token": *, policy: string}}
 */
export function getFormOssParams(accessKeyId, accessKeySecret, securityToken) {
    const policy = getPolicyBase64(); // policy 必须为 base64 的字符串。
    const signature = computeSignature(accessKeySecret, policy)
    return {OSSAccessKeyId: accessKeyId, signature, policy, 'x-oss-security-token': securityToken};
}


/**
 *
 *上传文件到阿里云oss
 * @param filePath 图片的本地资源路径(待上传文件的文件路径)
 * @param key 上传OSS哪个路径下
 * @param form 策略表单数据
 * @param success 上传成功回调
 * @param fail  上传失败回调
 */
export function uploadFile(host, filePath, key, form, success, fail) {
    const formData = Object.assign({key}, form);
    console.log(formData);

    wx.uploadFile({
        url: host, // 开发者服务器的URL。
        filePath: filePath,
        name: 'file', // 必须填file。
        formData,
        success: res => {
            if (res.statusCode === 204) {
                if (success) success(key);
            } else {
                if (fail) fail(res);
            }
        },
        fail: err => {
            if (fail) fail(err);
        }
    });
}

function randomString(e) {
    e = e || 32;
    const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    const a = t.length;
    let n = "";
    for (let i = 0; i < e; i++) {
        n += t.charAt(Math.floor(Math.random() * a));
    }
    return n;
}

/**
 * 上传头像
 *
 * @param host
 * @param filePath
 * @param form
 * @param success
 * @param fail
 */
export function uploadAvatar(host, filePath, form, success, fail) {
    const {userId} = getApp().globalData.userInfo;
    const avatarPath = md5(userId);
    const randomFileName = randomString(8);
    let extFile = "jpg";
    if (filePath && filePath.includes(".")) {
        extFile = filePath.split(".").pop();
    }
    const key = `user-content/avatar/${avatarPath}/${randomFileName}.${extFile}`;
    console.log(key);
    return uploadFile(host, filePath, key, form, success, fail);
}