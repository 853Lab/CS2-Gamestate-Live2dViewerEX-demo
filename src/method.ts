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