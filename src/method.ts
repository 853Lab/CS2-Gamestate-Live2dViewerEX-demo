/** 异步打盹多少毫秒 */
export const snooze = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
/** 异步队列 */
export class RList {
    time = 200
    #list = -1
    async Push() {
        this.#list++
        await snooze(this.#list * this.time)
        Promise.resolve().finally(() => {
            setTimeout(() => { this.#list-- }, (this.#list + 1) * this.time)
        })
    }
}
/** Event触发 */
export class Event {
    events: any
    constructor() {
        this.events = Object.create(null)
    }
    // tslint:disable-next-line: ban-types
    on(name: string, fn: Function) {
        if (!this.events[name]) {
            this.events[name] = []
        }
        this.events[name].push(fn)
        return this
    }
    emit(name: string, ...args: any) {
        if (!this.events[name]) {
            return this
        }
        const fns = this.events[name]
        fns.forEach((fn: any) => fn.call(this, ...args))
        return this
    }
    // tslint:disable-next-line: ban-types
    off(name: string, fn: Function) {
        if (!this.events[name]) {
            return this
        }
        if (!fn) {
            this.events[name] = null
            return this
        }
        const index = this.events[name].indexOf(fn)
        this.events[name].splice(index, 1)
        return this
    }
    // tslint:disable-next-line: ban-types
    once(name: string, fn: Function) {
        const only = () => {
            fn.apply(this, arguments)
            this.off(name, only)
        }
        this.on(name, only)
        return this
    }
}