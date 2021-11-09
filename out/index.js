"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HServer = void 0;
const http = require("http");
const ws_1 = require("ws");
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
// 建立监听CSGO发来的数据
class HServer extends Event {
    port = 8532;
    host = '127.0.0.1';
    server;
    conf = {
        wss: {
            enable: false,
            port: 8523,
        }
    };
    wss;
    body = '';
    Start() {
        if (this.server)
            return console.log('is Listening at http://' + this.host + ':' + this.port);
        this.server = http.createServer((req, res) => {
            this.createServer(req, res);
        });
        this.server.listen(this.port, this.host);
        console.log('Listening at http://' + this.host + ':' + this.port);
        if (!this.wss && this.conf.wss.enable) {
            this.wss = new ws_1.WebSocketServer({
                port: this.conf.wss.port,
            });
        }
        this.emit('open', 'Listening');
    }
    async Stop() {
        await new Promise((resolve) => {
            this.server.close(e => resolve(e));
        });
        await new Promise((resolve) => {
            this.wss.close(e => resolve(e));
        });
        this.emit('close', 'closed');
    }
    createServer(req, res) {
        if (req.method == 'POST') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            let body = '';
            req.on('data', (data) => {
                body += data;
            });
            req.on('end', () => {
                if (typeof body === 'string') {
                    if (this.body != body) {
                        this.body = body;
                        let response = JSON.parse(body);
                        let msg = JSON.stringify(response);
                        this.emit('message', response);
                        if (this.conf.wss.enable)
                            this.wss.clients.forEach(client => client.send(msg));
                        console.log('POST payload: ', response);
                    }
                }
                res.end('');
            });
        }
        else {
            console.log('Not expecting other request types...');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<html><body>HTTP Server at http://' + this.host + ':' + this.port + '</body></html>');
        }
    }
}
exports.HServer = HServer;
// 建立与Live2dViewerEx的连接
class LVEX extends Event {
    port = 10086;
    host = '127.0.0.1';
    path = 'api';
    ws;
    connected = false;
    retry = false;
    modelId = 0;
    async Start() {
        if (this.connected)
            return;
        if (this.ws) {
            try {
                this.ws.close();
            }
            catch (error) {
                console.error(error);
            }
            this.ws = null;
        }
        this.ws = new ws_1.WebSocket(`ws://${this.host}:${this.port}/${this.path}`);
        await new Promise((resolve) => {
            this.ws.on('open', () => {
                console.log('LVEX已连接！');
                resolve(this.connected = true);
            });
        });
        this.ws.on('close', () => {
            console.log('LVEX已断开！');
            this.connected = false;
            if (this.retry)
                this.Start();
        });
        this.ws.on('message', response => {
            console.log('LVEX：', response.toString());
            this.emit('message', response);
        });
        return this.connected;
    }
    Stop() {
        this.retry = false;
        this.ws.close();
    }
    async SetMotion(mtn = '', type = 1, id = this.modelId) {
        if (mtn === '' || !this.connected)
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
        console.log('发送LVEX：', msg);
        await new Promise((resolve) => {
            this.ws.send(msg, e => resolve(e));
        });
    }
}
// 自己的class
class Sonic853 {
    lvex;
    #boobs = false;
    get Boobs() {
        return this.#boobs;
    }
    set Boobs(val) {
        if (this.#boobs !== val) {
            this.#boobs = val;
            this.lvex.SetMotion(this.#boobs ? 'motions/ShowBoobs1.motion3.json' : 'motions/ShowBoobs0.motion3.json');
        }
    }
    #glasses = true;
    get Glasses() {
        return this.#glasses;
    }
    set Glasses(val) {
        if (this.#glasses !== val) {
            this.#glasses = val;
            this.lvex.SetMotion(this.#glasses ? 'motions/ShowGlasses1.motion3.json' : 'motions/ShowGlasses0.motion3.json');
        }
    }
    constructor(id, lvex) {
        this.lvex = lvex ?? new LVEX();
        if (typeof id === 'number')
            this.lvex.modelId = id;
        this.lvex.Start();
    }
}
let lvex = new LVEX();
let sonic853 = new Sonic853(0, lvex);
let hServer = new HServer();
// 与 this.emit('message', response) 对应
hServer.on('message', (response) => {
    // console.log('getdata', response)
    if (response.player.activity === 'menu') {
        sonic853.Boobs = false;
        sonic853.Glasses = true;
    }
    else if (response.player.activity === 'playing') {
        console.log('playing');
        console.log(typeof response.player.state?.money);
        if (typeof response.player.state?.money === 'number') {
            if (response.player.state.money >= 3000) {
                console.log('大于3000！');
                sonic853.Boobs = true;
            }
            else {
                console.log('小于3000！');
                sonic853.Boobs = false;
            }
        }
        if (typeof response.player.state?.helmet === 'boolean') {
            sonic853.Glasses = response.player.state.helmet;
        }
    }
});
hServer.Start();
