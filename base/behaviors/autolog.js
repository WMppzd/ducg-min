import * as Log from "../../utils/log";

/**
 * 本 Behavior 会在小程序 methods 中每个方法调用前添加一个 Log 说明
 * 需要在 Component 的 data 属性中添加 tag，用于描述当前页面
 */
export default Behavior({
    definitionFilter(defFields) {
        // 获取定义的方法
        Object.keys(defFields.methods || {}).forEach(methodName => {
            const originMethod = defFields.methods[methodName];
            // 遍历更新每个方法
            defFields.methods[methodName] = function (ev, ...args) {
                if (ev && ev.target && ev.currentTarget && ev.currentTarget.dataset) {
                    // 如果是事件类型，则只需要记录 dataset 数据
                    Log.info(defFields.data.tag, `${methodName} invoke, event dataset = `, ev.currentTarget.dataset, "params = ", ...args);
                } else {
                    // 其他情况下，则都记录日志
                    Log.info(defFields.data.tag, `${methodName} invoke, params = `, ev, ...args);
                }
                // 触发原有的方法
                originMethod.call(this, ev, ...args);
            };
        });
    }
});