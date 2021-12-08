const version = "0.0.1"; // 业务代码版本号，用户灰度过程中观察问题

const logger = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;

export function info(file, ...args) {
    console.info(file, " | ", ...args);
    logger && logger.info(`[${version}]`, file, " | ", ...args);
}

export function warn(file, ...args) {
    console.warn(file, " | ", ...args);
    logger && logger.warn(`[${version}]`, file, " | ", ...args);
}

export function error(file, ...args) {
    console.error(file, " | ", ...args);
    logger && logger.error(`[${version}]`, file, " | ", ...args);
}

// 方便将页面名字自动打印
export function getLogger(fileName) {
    return {
        info: function (...args) {
            info(fileName, ...args);
        },
        warn: function (...args) {
            warn(fileName, ...args);
        },
        error: function (...args) {
            error(fileName, ...args);
        }
    };
}