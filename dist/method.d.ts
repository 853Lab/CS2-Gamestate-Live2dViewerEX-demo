/** 异步打盹多少毫秒 */
export declare const snooze: (ms: number) => Promise<unknown>;
/** 异步队列 */
export declare class RList {
    #private;
    time: number;
    Push(): Promise<void>;
}
/** Event触发 */
export declare class Event {
    events: any;
    constructor();
    on(name: string, fn: Function): this;
    emit(name: string, ...args: any): this;
    off(name: string, fn: Function): this;
    once(name: string, fn: Function): this;
}
