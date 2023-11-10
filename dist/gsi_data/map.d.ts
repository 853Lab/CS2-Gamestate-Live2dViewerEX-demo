import { PhaseType } from "./round";
/**
 * 地图数据
 */
export interface MapData {
    /**
     * 地图模式
     */
    mode: MapMode;
    /**
     * 地图名称
     *
     * 例如：de_dust2
     */
    name: string;
    /**
     * 地图状态
     */
    phase: PhaseType;
    /**
     * 回合数
     */
    round: number;
    /**
     * CT 队伍信息
     */
    team_ct: MapTeamData;
    /**
     * T 队伍信息
     */
    team_t: MapTeamData;
    /**
     * 胜利回合数
     */
    num_matches_to_win_series: number;
    /**
     * 观众人数
     */
    current_spectators: number;
    /**
     * 纪念品总数
     */
    souvenirs_total: number;
    /**
     * 回合获胜信息
     */
    round_wins?: {
        [key: string]: MapRoundWinsType;
    };
}
/**
 * 队伍信息
 */
export interface MapTeamData {
    /**
     * 分数
     */
    score: number;
    /**
     * 连续回合失败数
     */
    consecutive_round_losses: number;
    /**
     * 剩余暂停次数
     */
    timeouts_remaining: number;
    /**
     * 本系列赛获胜回合数
     */
    matches_won_this_series: number;
}
/**
 * 回合获胜类型
 */
export type MapRoundWinsType = "ct_win_time" | "ct_win_elimination" | "t_win_elimination" | "t_win_bomb" | "ct_win_defuse";
/**
 * 地图模式
 */
export type MapMode = string | "casual" | "competitive" | "scrimcomp2v2" | "scrimcomp5v5" | "gungameprogressive" | "gungametrbomb" | "deathmatch" | "training" | "custom" | "cooperative" | "coopmission" | "skirmish" | "survival";
