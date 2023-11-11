/** 异步打盹多少毫秒 */
export declare const snooze: (ms: number) => Promise<unknown>;
/** 异步队列 */
export declare class RList {
    #private;
    time: number;
    Push(): Promise<void>;
}
