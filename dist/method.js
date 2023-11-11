"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RList = exports.snooze = void 0;
/** 异步打盹多少毫秒 */
const snooze = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.snooze = snooze;
/** 异步队列 */
class RList {
    time = 200;
    #list = -1;
    async Push() {
        this.#list++;
        await (0, exports.snooze)(this.#list * this.time);
        Promise.resolve().finally(() => {
            setTimeout(() => { this.#list--; }, (this.#list + 1) * this.time);
        });
    }
}
exports.RList = RList;
