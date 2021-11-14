"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.RList = exports.snooze = void 0;
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
/** Event触发 */
class Event {
    events;
    constructor() {
        this.events = Object.create(null);
    }
    // tslint:disable-next-line: ban-types
    on(name, fn) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push(fn);
        return this;
    }
    emit(name, ...args) {
        if (!this.events[name]) {
            return this;
        }
        const fns = this.events[name];
        fns.forEach((fn) => fn.call(this, ...args));
        return this;
    }
    // tslint:disable-next-line: ban-types
    off(name, fn) {
        if (!this.events[name]) {
            return this;
        }
        if (!fn) {
            this.events[name] = null;
            return this;
        }
        const index = this.events[name].indexOf(fn);
        this.events[name].splice(index, 1);
        return this;
    }
    // tslint:disable-next-line: ban-types
    once(name, fn) {
        const only = () => {
            fn.apply(this, arguments);
            this.off(name, only);
        };
        this.on(name, only);
        return this;
    }
}
exports.Event = Event;
