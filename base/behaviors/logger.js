import * as Log from "../../utils/log";

module.exports = Behavior({
    data: {
        tag: "logger.js",
    },
    methods: {
        log_info(...args) {
            Log.info(this.data.tag, ...args);
        },

        log_warn(...args) {
            Log.warn(this.data.tag, ...args);
        },

        log_error(...args) {
            Log.warn(this.data.tag, ...args);
        }

    }
})
