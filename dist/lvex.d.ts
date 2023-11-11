/// <reference types="node" />
import { WebSocket } from "ws";
import { EventEmitter } from "events";
/** 建立与Live2dViewerEx的连接 */
export declare class LVEX extends EventEmitter {
    /** 域名或IP */
    host: string;
    /** 端口 */
    port: number;
    /** 路径 */
    path: string;
    ws: WebSocket;
    /** 是否连接上 */
    connected: boolean;
    /** 是否重试 */
    retry: boolean;
    /** 指定模型ID */
    modelId: number;
    Start(): Promise<boolean>;
    Stop(): void;
    SetMotion(mtn?: string, type?: number, id?: number): Promise<void>;
    SetExpId(expId?: number, id?: number): Promise<void>;
    SendMsg(msg: string): Promise<unknown>;
}
