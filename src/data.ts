import { Rifle, SubmachineGun, Shotgun, MachineGun, SniperRifle, Pistol, Taser, Shield, Grenade, Knife, C4, ZoneRepulsor, Tablet, StackableItem, BreachCharge, BumpMine } from './Weapon/type'
/** CSGO发来的数据 */
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
        activity: 'menu' | 'playing' | 'textinput'
        state?: {
            // 血量
            health: number
            // 甲
            armor: number
            // 头盔
            helmet: boolean
            // 0 - 255
            // 闪
            flashed: number
            // 烟
            smoked: number
            // 烧
            burning: number
            // 钱：0 - 16000
            money: number
            // 此局击杀
            round_kills: number
            // 此局对方死于爆头数量
            round_killhs: number
            round_totaldmg?: number
            // 武器合计金额
            equip_value: number
            // 购买了拆弹器或工具包时出现
            defusekit?: boolean
        }
        weapons?: {
            [key: string]: Rifle
            | SubmachineGun
            | Shotgun
            | MachineGun
            | SniperRifle
            | Pistol
            | Taser
            | Shield
            | Grenade
            | Knife
            | C4
            | ZoneRepulsor
            | Tablet
            | StackableItem
            | BreachCharge
            | BumpMine
        }
        match_stats?: {
            kills: number
            assists: number
            deaths: number
            mvps: number
            score: number
        }
    }
    // 变动时这块会出现，里面我没补充完整，不建议用
    previously?: {
        player?: {
            activity?: 'menu' | 'playing'
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