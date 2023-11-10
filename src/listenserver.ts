
import http = require('http')
import { Event } from './method'
import { WebSocketServer } from 'ws'
import { GameStateData } from 'cs2-gamestate-integration-data/dist/main'
/** 建立监听CSGO发来的数据 */
export class ListenServer extends Event {
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
    // 处理csgo发来的信息，csgo是一股脑的向程序发送post来达到数据实时，就很mmp
    createServer(req: http.IncomingMessage, res: http.ServerResponse) {
        if (req.method == 'POST') {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            let body = ''
            req.on('data', (data) => {
                body += data
            })
            req.on('end', () => {
                if (typeof body === 'string') {
                    // 判断发来的数据是否有更新
                    if (this.body != body) {
                        this.body = body
                        const response: GameStateData = JSON.parse(body)
                        const msg = JSON.stringify(response)
                        // emit：数据更新了，内容是response
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