"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lvex_1 = require("./lvex");
const listenserver_1 = require("./listenserver");
const sonic853_1 = require("./sonic853");
let lvex = new lvex_1.LVEX();
let sonic853 = new sonic853_1.Sonic853(0, lvex);
let listenServer = new listenserver_1.ListenServer();
// 与 this.emit('message', response) 对应
listenServer.on('message', (response) => {
    // console.log('getdata', response)
    const player = response.player;
    // 玩家回到菜单
    if (player.activity === 'menu') {
        console.log('menu');
        sonic853.Boobs = false;
        sonic853.Glasses = true;
        sonic853.Lines = false;
        sonic853.Sweats = false;
        sonic853.RedFace = false;
        sonic853.Exp = 'idle';
    }
    // 玩家在playing或textinput
    else if (player.activity === 'playing' || player.activity === 'textinput') {
        // 玩家阵亡后切换到其他玩家时会显示其他玩家的状态，故采用steamid过滤
        if (player.steamid !== '76561198129129355')
            return;
        if (player.state) {
            // 开始建立状态，不急着应用到l2d模型上
            let Lines = false;
            let Sweats = false;
            let RedFace = false;
            let Boobs = false;
            let Glasses = true;
            let Exp = 'idle';
            const state = player.state;
            if (player.weapons) {
                const weapons = player.weapons;
                Object.keys(weapons).forEach(key => {
                    const weapon = weapons[key];
                    // 在手上的武器
                    if (weapon.state === 'active') {
                        // console.log(weapon)
                    }
                });
            }
            // 判断钱数
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
            // 判断头盔
            if (typeof state.helmet === 'boolean') {
                Glasses = response.player.state.helmet;
            }
            // 判断分组
            if (player.team) {
                // 判断玩家所在的阵营
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
            // 判断血量
            if (typeof state.health === 'number') {
                switch (true) {
                    case state.health <= 0:
                        {
                            Exp = 'eyes1';
                            Glasses = false;
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
            // 是否混烟，混烟时会跳到255，退出烟雾后逐渐回退到0
            if (typeof state.smoked === 'number') {
                if (state.smoked >= 50)
                    Exp = 'eyesBaka';
            }
            // 是否被烧，被烧时会跳到255，然后逐渐回退到0
            if (typeof state.burning === 'number') {
                if (state.burning >= 50)
                    Sweats = true;
            }
            // 是否被闪，被闪时会跳到255，然后逐渐回退到0
            if (typeof state.flashed === 'number') {
                if (state.flashed >= 50)
                    Exp = 'eyesX';
            }
            // 最后将状态发送给模型
            sonic853.Boobs = Boobs;
            sonic853.Glasses = Glasses;
            sonic853.Lines = Lines;
            sonic853.Sweats = Sweats;
            sonic853.RedFace = RedFace;
            sonic853.Exp = Exp;
        }
    }
});
listenServer.Start();
