import { TeamType } from "./player";
/**
 * 回合数据
 */
export interface RoundData {
    /**
     * 回合状态
     */
    phase?: PhaseType;
    /**
     * 胜利队伍
     */
    win_team?: string | TeamType;
    /**
     * 炸弹状态
     */
    bomb?: RoundBombType;
}
/**
 * 回合状态
 */
export type PhaseType = string | "live" | "bomb" | "over" | "freezetime" | "paused" | "defuse" | "timeout_t" | "timeout_ct" | "warmup" | "intermission" | "gameover";
/**
 * 炸弹状态
 */
export type RoundBombType = "planted" | "exploded" | "defused";
