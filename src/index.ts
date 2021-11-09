import http = require('http')
import { WebSocketServer, WebSocket } from 'ws'

export interface Data {
    map?: {
        mode: string | 'deathmatch'
        name: string
        phase: 'live'
        | 'bomb'
        | 'over'
        | 'freezetime'
        | 'paused'
        | 'defuse'
        | 'timeout_t'
        | 'timeout_ct'
        | 'warmup'
        round: number
        team_ct: {
            score: number
            consecutive_round_losses: number
            timeouts_remaining: number
            matches_won_this_series: number
        },
        team_t: {
            score: number
            consecutive_round_losses: number
            timeouts_remaining: number
            matches_won_this_series: number
        },
        num_matches_to_win_series: number
        current_spectators: number
        souvenirs_total: number
    }
    round?: {
        phase: 'live'
        | 'bomb'
        | 'over'
        | 'freezetime'
        | 'paused'
        | 'defuse'
        | 'timeout_t'
        | 'timeout_ct'
        | 'warmup'
    }
    player: {
        steamid: string
        clan?: string
        name: string
        team?: 'T' | 'CT'
        activity: 'menu' | 'playing'
        state?: {
            health: number
            armor: number
            helmet: boolean
            flashed: number
            smoked: number
            burning: number
            money: number
            round_kills: number
            round_killhs: number
            round_totaldmg: number
            equip_value: number
        }
        weapons?: {
            [key: string]: {
                name: string
                paintkit: string
                type: 'Knife'
                state: 'holstered' | 'active'
            } | {
                name: string
                paintkit: string
                type: 'Pistol' | 'Rifle'
                ammo_clip: number
                ammo_clip_max: number
                ammo_reserve: number
                state: 'holstered' | 'active'
            } | {
                name: 'weapon_taser'
                paintkit: string
                ammo_clip: number
                ammo_clip_max: number
                ammo_reserve: number
                state: 'holstered' | 'active'
            } | {
                name: 'weapon_hegrenade' | 'weapon_flashbang' | 'weapon_smokegrenade' | 'weapon_decoy' | 'weapon_incgrenade' | 'weapon_molotov'
                paintkit: string
                type: 'Grenade'
                ammo_reserve: number
                state: 'holstered' | 'active'
            }
        }
        match_stats?: {
            kills: number
            assists: number
            deaths: number
            mvps: number
            score: number
        }
    }
    previously?: {
        player?: {
            activity: 'menu' | 'playing'
        }
    }
    added?: {
        player?: {
            state: boolean
            weapons: boolean
            match_stats: boolean
        }
    }
    auth: {
        the853: 'rtx3070ti'
    }
}

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
// 建立监听CSGO发来的数据
export class HServer extends Event {
    port = 8532
    host = '127.0.0.1'
    server: http.Server
    conf = {
        wss: {
            enable: false,
            port: 8523,
        }
    }
    wss: WebSocketServer
    body = ''
    Start() {
        if (this.server) return console.log('is Listening at http://' + this.host + ':' + this.port)
        this.server = http.createServer((req, res) => {
            this.createServer(req, res)
        })
        this.server.listen(this.port, this.host)
        console.log('Listening at http://' + this.host + ':' + this.port)
        if (!this.wss && this.conf.wss.enable) {
            this.wss = new WebSocketServer({
                port: this.conf.wss.port,
            })
        }
        this.emit('open', 'Listening')
    }
    async Stop() {
        await new Promise((resolve) => {
            this.server.close(e => resolve(e))
        })
        await new Promise((resolve) => {
            this.wss.close(e => resolve(e))
        })
        this.emit('close', 'closed')
    }
    createServer(req: http.IncomingMessage, res: http.ServerResponse) {
        if (req.method == 'POST') {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            let body = ''
            req.on('data', (data) => {
                body += data
            })
            req.on('end', () => {
                if (typeof body === 'string') {
                    if (this.body != body) {
                        this.body = body
                        let response: Data = JSON.parse(body)
                        let msg = JSON.stringify(response)
                        this.emit('message', response)
                        if (this.conf.wss.enable) this.wss.clients.forEach(client => client.send(msg))
                        console.log('POST payload: ', response)
                    }
                }
                res.end('')
            })
        }
        else {
            console.log('Not expecting other request types...')
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end('<html><body>HTTP Server at http://' + this.host + ':' + this.port + '</body></html>')
        }
    }
}

// 建立与Live2dViewerEx的连接
class LVEX extends Event {
    port = 10086
    host = '127.0.0.1'
    path = 'api'
    ws: WebSocket
    connected = false
    retry = false
    modelId = 0
    async Start() {
        if (this.connected) return
        if (this.ws) {
            try {
                this.ws.close()
            } catch (error) {
                console.error(error)
            }
            this.ws = null
        }
        this.ws = new WebSocket(`ws://${this.host}:${this.port}/${this.path}`)
        await new Promise((resolve) => {
            this.ws.on('open', () => {
                console.log('LVEX已连接！')
                resolve(this.connected = true)
            })
        })
        this.ws.on('close', () => {
            console.log('LVEX已断开！')
            this.connected = false
            if (this.retry) this.Start()
        })
        this.ws.on('message', response => {
            console.log('LVEX：', response.toString())
            this.emit('message', response)
        })
        return this.connected
    }
    Stop() {
        this.retry = false
        this.ws.close()
    }
    async SetMotion(mtn = '', type = 1, id = this.modelId) {
        if (mtn === '' || !this.connected) return
        const msg = JSON.stringify({
            msg: 13200,
            msgId: 1,
            data: {
                id,
                type,
                mtn
            }
        })
        console.log('发送LVEX：', msg);
        await new Promise((resolve) => {
            this.ws.send(msg, e => resolve(e))
        })
    }
}

// 自己的class
class Sonic853 {
    lvex: LVEX
    #boobs = false
    get Boobs() {
        return this.#boobs
    }
    set Boobs(val) {
        if (this.#boobs !== val) {
            this.#boobs = val
            this.lvex.SetMotion(this.#boobs ? 'motions/ShowBoobs1.motion3.json' : 'motions/ShowBoobs0.motion3.json')
        }
    }
    #glasses = true
    get Glasses() {
        return this.#glasses
    }
    set Glasses(val) {
        if (this.#glasses !== val) {
            this.#glasses = val
            this.lvex.SetMotion(this.#glasses ? 'motions/ShowGlasses1.motion3.json' : 'motions/ShowGlasses0.motion3.json')
        }
    }
    constructor(id?: number, lvex?: LVEX) {
        this.lvex = lvex ?? new LVEX()
        if (typeof id === 'number') this.lvex.modelId = id
        this.lvex.Start()
    }
}

let lvex = new LVEX()
let sonic853 = new Sonic853(0, lvex)
let hServer = new HServer()
// 与 this.emit('message', response) 对应
hServer.on('message', (response: Data) => {
    // console.log('getdata', response)
    if (response.player.activity === 'menu') {
        sonic853.Boobs = false
        sonic853.Glasses = true
    }
    else if (response.player.activity === 'playing') {
        console.log('playing')
        console.log(typeof response.player.state?.money)
        if (typeof response.player.state?.money === 'number') {
            if (response.player.state.money >= 3000) {
                console.log('大于3000！')
                sonic853.Boobs = true
            }
            else {
                console.log('小于3000！')
                sonic853.Boobs = false
            }
        }
        if (typeof response.player.state?.helmet === 'boolean') {
            sonic853.Glasses = response.player.state.helmet
        }
    }
})
hServer.Start()
