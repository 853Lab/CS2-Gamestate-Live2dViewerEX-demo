"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HServer = exports.Event = void 0;
const http = require("http");
const ws_1 = require("ws");
const RList = new class {
    time = 200;
    #list = -1;
    snooze = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    async Push() {
        this.#list++;
        await this.snooze(this.#list * this.time);
        Promise.resolve().finally(() => {
            setTimeout(() => { this.#list--; }, (this.#list + 1) * this.time);
        });
    }
};
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
        console.log('发送LVEX：', msg);
        await RList.Push();
        return new Promise((resolve) => {
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
    #expressions = 'idle';
    get Exp() {
        return this.#expressions;
    }
    set Exp(val) {
        if (this.#expressions !== val) {
            this.#expressions = val;
            let exp = 0;
            switch (this.#expressions) {
                case 'idle':
                    exp = 0;
                    break;
                case 'eyes1':
                    exp = 1;
                    break;
                case 'eyes2':
                    exp = 2;
                    break;
                case 'eyes3':
                    exp = 3;
                    break;
                case 'eyes4':
                    exp = 4;
                    break;
                case 'eyes5':
                    exp = 5;
                    break;
                case 'eyesX':
                    exp = 6;
                    break;
                case 'eyesBaka':
                    exp = 7;
                    break;
                case 'mouth1':
                    exp = 8;
                    break;
                case 'mouth2':
                    exp = 9;
                    break;
                case 'mouth3':
                    exp = 10;
                    break;
                case 'mouth4':
                    exp = 11;
                    break;
                case 'Baka':
                    exp = 12;
                    break;
                case 'Scary':
                    exp = 13;
                    break;
                case 'XXX':
                    exp = 14;
                    break;
                case 'Ehehe':
                    exp = 15;
                    break;
                default:
                    break;
            }
            this.lvex.SetExpId(exp);
        }
    }
    #red_face = false;
    get RedFace() {
        return this.#red_face;
    }
    set RedFace(val) {
        if (this.#red_face !== val) {
            this.#red_face = val;
            this.lvex.SetMotion(this.#red_face ? 'motions/ShowRedFace1.motion3.json' : 'motions/ShowRedFace0.motion3.json');
        }
    }
    #sweats = false;
    get Sweats() {
        return this.#sweats;
    }
    set Sweats(val) {
        if (this.#sweats !== val) {
            this.#sweats = val;
            this.lvex.SetMotion(this.#sweats ? 'motions/ShowSweats1.motion3.json' : 'motions/ShowSweats0.motion3.json');
        }
    }
    #lines = false;
    get Lines() {
        return this.#lines;
    }
    set Lines(val) {
        if (this.#lines !== val) {
            this.#lines = val;
            this.lvex.SetMotion(this.#lines ? 'motions/ShowLines1.motion3.json' : 'motions/ShowLines0.motion3.json');
        }
    }
    #drop = false;
    get Drop() {
        return this.#drop;
    }
    set Drop(val) {
        if (this.#drop !== val) {
            this.#drop = val;
            this.lvex.SetMotion(this.#drop ? 'motions/ShowDrop1.motion3.json' : 'motions/ShowDrop0.motion3.json');
        }
    }
    #dark_eye = false;
    get DarkEye() {
        return this.#dark_eye;
    }
    set DarkEye(val) {
        if (this.#dark_eye !== val) {
            this.#dark_eye = val;
            this.lvex.SetMotion(this.#dark_eye ? 'motions/ShowDarkEye1.motion3.json' : 'motions/ShowDarkEye0.motion3.json');
        }
    }
    constructor(id, lvex) {
        this.lvex = lvex ?? new LVEX();
        if (typeof id === 'number')
            this.lvex.modelId = id;
        this.lvex.Start();
    }
}
// nomal: idle
// 优先级：1
// death: eyes1
// hp20: eyes3
// hp50: eyes2
// 优先级：2 (做不了)
// 1 v 1-0: Scary
// 5 v 1-0: eyesBaka
// 5 v 3-2 : eyes5
// 2 v 5: normal
// 1 v >5: eyes3 + ShowRedFace1 + Sweats
// 1 v 4-2: idle + Sweats
// 优先级：3
// 0 - 10 : Lines + Sweats
// 10 - 0 : Baka
// playerChange
let lvex = new LVEX();
let sonic853 = new Sonic853(0, lvex);
let hServer = new HServer();
// 与 this.emit('message', response) 对应
hServer.on('message', (response) => {
    // console.log('getdata', response)
    const player = response.player;
    if (player.activity === 'menu') {
        sonic853.Boobs = false;
        sonic853.Glasses = true;
        sonic853.Lines = false;
        sonic853.Sweats = false;
        sonic853.RedFace = false;
        sonic853.Exp = 'idle';
    }
    else if (player.activity === 'playing') {
        console.log('playing');
        if (player.steamid !== '76561198129129355')
            return;
        if (player.state) {
            let Lines = false;
            let Sweats = false;
            let RedFace = false;
            let Boobs = false;
            let Glasses = true;
            let Exp = 'idle';
            const state = player.state;
            if (typeof state.money === 'number') {
                if (state.money >= 5000) {
                    // console.log('大于5000！')
                    Boobs = true;
                }
                else {
                    // console.log('小于5000！')
                    Boobs = false;
                }
            }
            if (typeof state.helmet === 'boolean') {
                Glasses = response.player.state.helmet;
            }
            if (player.team) {
                const [team, enemy_team] = player.team === 'CT' ? ['team_ct', 'team_t'] : ['team_t', 'team_ct'];
                if (response.map) {
                    const score = response.map[team].score;
                    const enemy_score = response.map[enemy_team].score;
                    if (enemy_score - score >= 10) {
                        Lines = true;
                        Sweats = true;
                        Exp = 'idle';
                    }
                    else if (score - enemy_score >= 10) {
                        Lines = false;
                        Sweats = false;
                        Exp = 'Baka';
                    }
                    else {
                        Lines = false;
                        Sweats = false;
                        Exp = 'idle';
                    }
                }
            }
            if (typeof state.health === 'number') {
                switch (true) {
                    case state.health <= 0:
                        {
                            Exp = 'eyes1';
                            sonic853.Glasses = false;
                        }
                        break;
                    case state.health <= 20:
                        {
                            Exp = 'eyes3';
                            RedFace = true;
                        }
                        break;
                    case state.health <= 50:
                        {
                            Exp = 'eyes2';
                        }
                        break;
                    default:
                        break;
                }
            }
            if (typeof state.flashed === 'number') {
                if (state.flashed >= 50)
                    Exp = 'eyesX';
            }
            if (typeof state.smoked === 'number') {
                if (state.smoked >= 50)
                    Exp = 'eyesBaka';
            }
            if (typeof state.burning === 'number') {
                if (state.burning >= 50)
                    Sweats = true;
            }
            sonic853.Boobs = Boobs;
            sonic853.Glasses = Glasses;
            sonic853.Lines = Lines;
            sonic853.Sweats = Sweats;
            sonic853.RedFace = RedFace;
            sonic853.Exp = Exp;
        }
    }
});
hServer.Start();
// setTimeout(() => {
//     console.log('send message')
//     sonic853.Exp = 'eyesBaka'
// }, 3000)
