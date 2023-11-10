/**
 * 新增的数据
 */
export interface AddedData {
    /**
     * 地图数据
     */
    map?: AddedMapData;
    /**
     * 玩家数据
     */
    player?: AddedPlayerData;
    /**
     * 回合数据
     */
    round?: AddedRoundData;
}
/**
 * 地图数据
 */
export interface AddedMapData {
    /**
     * 回合胜利情况
     */
    round_wins?: boolean | {
        [key: string]: boolean;
    };
}
/**
 * 玩家数据
 */
export interface AddedPlayerData {
    /**
     * 团队
     */
    clan?: boolean;
    /**
     * 比赛状态
     */
    match_stats?: boolean;
    /**
     * 观察者槽位
     */
    observer_slot?: boolean;
    /**
     * 玩家状态信息
     */
    state?: boolean | {
        /**
         * 购买了拆弹器或工具包时出现
         */
        defusekit: boolean;
    } | {
        [key: string]: boolean;
    };
    /**
     * 队伍类型
     */
    team?: boolean;
    /**
     * 玩家所有武器
     */
    weapons?: boolean | {
        [key: string]: boolean | AddedWeaponData;
    };
}
/**
 * 回合数据
*/
export interface AddedRoundData {
    /**
     * 炸弹状态
     */
    bomb?: boolean;
    /**
     * 胜利队伍
     */
    win_team?: boolean;
}
/**
 * 武器数据
 */
export interface AddedWeaponData {
    /** 当前弹药量 */
    ammo_clip?: boolean;
    /** 最高当前弹药量 */
    ammo_clip_max?: boolean;
    /** 背包弹药量 */
    ammo_reserve?: boolean;
    /** 武器类型 */
    type?: boolean;
}
