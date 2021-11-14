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
        /** 玩家SteamID */
        steamid: string
        /** 玩家的组 */
        clan?: string
        /** 玩家Steam名称 */
        name: string
        /** 阵营 */
        team?: 'T' | 'CT'
        /** 玩家所在的操作 */
        activity: 'menu' | 'playing' | 'textinput'
        /** 玩家状态 */
        state?: {
            /** 血量 */
            health: number
            /** 甲 */
            armor: number
            /** 头盔 */
            helmet: boolean
            /** 
             * 闪
             * 
             * 0 - 255
             */
            flashed: number
            /** 
             * 烟
             * 
             * 0 - 255
             */
            smoked: number
            /** 
             * 烧
             * 
             * 0 - 255
             */
            burning: number
            /** 
             * 钱
             * 
             * 0 - 16000
             */
            money: number
            /** 此局击杀 */
            round_kills: number
            /** 此局对方死于爆头数量 */
            round_killhs: number
            round_totaldmg?: number
            /** 武器合计金额 */
            equip_value: number
            /** 购买了拆弹器或工具包时出现 */
            defusekit?: boolean
        }
        /** 武器 */
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
            /** 击杀 */
            kills: number
            /** 助攻 */
            assists: number
            /** 阵亡 */
            deaths: number
            /** MVP */
            mvps: number
            /** 分数 */
            score: number
        }
    }
    /** 变动时这块会出现，里面我没补充完整，不建议用 */
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