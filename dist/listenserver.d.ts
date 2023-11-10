/// <reference types="node" />
import http = require('http');
import { Event } from './method';
import { WebSocketServer } from 'ws';
/** 建立监听CSGO发来的数据 */
export declare class ListenServer extends Event {
    port: number;
    host: string;
    server: http.Server;
    conf: {
        wss: {
            enable: boolean;
            port: number;
        };
    };
    wss: WebSocketServer;
    body: string;
    Start(): void;
    Stop(): Promise<void>;
    createServer(req: http.IncomingMessage, res: http.ServerResponse): void;
}
