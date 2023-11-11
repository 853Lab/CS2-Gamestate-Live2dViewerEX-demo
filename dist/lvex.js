"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LVEX = void 0;
const ws_1 = require("ws");
const events_1 = require("events");
/** 建立与Live2dViewerEx的连接 */
class LVEX extends events_1.EventEmitter {
    /** 域名或IP */
    host = "127.0.0.1";
    /** 端口 */
    port = 10086;
    /** 路径 */
    path = "api";
    ws;
    /** 是否连接上 */
    connected = false;
    /** 是否重试 */
    retry = false;
    /** 指定模型ID */
    modelId = 0;
    async Start() {
        if (this.connected)
            return;
        const retry = this.retry;
        this.retry = false;
        if (this.ws) {
            try {
                this.ws.close();
            }
            catch (error) {
                console.error(error);
            }
            this.ws = null;
        }
        try {
            this.ws = new ws_1.WebSocket(`ws://${this.host}:${this.port}/${this.path}`);
            await new Promise((resolve) => {
                this.ws.on("open", () => {
                    console.log("LVEX已连接！");
                    this.retry = retry;
                    resolve(this.connected = true);
                });
            });
            this.ws.on("close", () => {
                console.log("LVEX已断开！");
                this.connected = false;
                if (this.retry)
                    this.Start();
            });
            this.ws.on("message", response => {
                console.log("LVEX：", response.toString());
                this.emit("message", response);
            });
        }
        catch (error) {
            console.error(error);
        }
        return this.connected;
    }
    Stop() {
        this.retry = false;
        this.ws.close();
    }
    async SetMotion(mtn = "", type = 1, id = this.modelId) {
        if (mtn === "" || !this.connected)
            return;
        const msg = JSON.stringify({
            msg: 13200,
            msgId: 1,
            data: {
                id,
                type,
                mtn
            }
        });
        await this.SendMsg(msg);
    }
    async SetExpId(expId = 0, id = this.modelId) {
        const msg = JSON.stringify({
            msg: 13300,
            msgId: 1,
            data: {
                id,
                expId
            }
        });
        await this.SendMsg(msg);
    }
    async SendMsg(msg) {
        console.log("发送LVEX：", msg);
        return new Promise((resolve) => {
            this.ws.send(msg, e => resolve(e));
        });
    }
}
exports.LVEX = LVEX;
