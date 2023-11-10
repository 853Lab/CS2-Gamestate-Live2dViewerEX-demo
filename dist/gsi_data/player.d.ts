import { BreachCharge, BumpMine, C4, Grenade, Knife, MachineGun, Pistol, Rifle, Shield, Shotgun, SniperRifle, StackableItem, SubmachineGun, Tablet, Taser, ZoneRepulsor } from "./weapon/type";
/**
 * 玩家数据
 */
export interface PlayerData {
    /**
     * 玩家 steamid
     */
    steamid: string;
    /**
     * 团队
     */
    clan?: string;
    /**
     * 玩家名称
     */
    name: string;
    /**
     * 队伍类型
     */
    team?: TeamType;
    /**
     * 当前状态
     */
    activity: PlayerActivityType;
    /**
     * 玩家状态信息
     */
    state?: PlayerState;
    /**
     * 玩家所有武器
     */
    weapons?: {
        [key: string]: WeaponsType;
    };
    /**
     * 比赛状态
     */
    match_stats?: PlayerMatchStats;
    /**
     * 观察者槽位
     */
    observer_slot: number;
}
/**
 * 玩家状态信息
 */
export interface PlayerState {
    /**
     * 血量
     */
    health: number;
    /**
     * 甲
     */
    armor: number;
    /**
     * 头盔
     */
    helmet: boolean;
    /**
     * 0 - 255
     *
     * 闪，被闪瞬间跳到 255，然后逐渐降低到 0
     */
    flashed: number;
    /**
     * 0 - 255
     *
     * 烟，有趣的是，这个数值能检测到玩家被烟雾弹影响的程度
     */
    smoked: number;
    /**
     * 0 - 255
     *
     * 烧，被烧的瞬间跳到 255，离开燃烧的范围后逐渐降低到 0
     */
    burning: number;
    /**
     * 0 - 16000
     *
     * 钱
     */
    money: number;
    /**
     * 此局击杀
     */
    round_kills: number;
    /**
     * 此局对方死于爆头数量
     */
    round_killhs: number;
    /**
     * 此局伤害
     */
    round_totaldmg?: number;
    /**
     * 武器合计金额
     */
    equip_value: number;
    /**
     * 购买了拆弹器或工具包时出现
     */
    defusekit?: boolean;
}
/**
 * 玩家比赛状态
 */
export interface PlayerMatchStats {
    /**
     * 击杀
     */
    kills: number;
    /**
     * 助攻
     */
    assists: number;
    /**
     * 死亡
     */
    deaths: number;
    /**
     * MVP
     */
    mvps: number;
    /**
     * 分数
     */
    score: number;
}
/**
 * 队伍类型
 */
export type TeamType = "CT" | "T";
/**
 * 当前玩家状态
 */
export type PlayerActivityType = "menu" | "playing" | "textinput";
/**
 * 武器类型
 */
export type WeaponsType = Rifle | SubmachineGun | Shotgun | MachineGun | SniperRifle | Pistol | Taser | Shield | Grenade | Knife | C4 | ZoneRepulsor | Tablet | StackableItem | BreachCharge | BumpMine;
