import { MapData } from "./map";
import { RoundData } from "./round";
import { PlayerData } from "./player";
import { ProviderData } from "./provider";
import { AddedData } from "./added";
/** CSGO发来的数据 */
export interface GameStateData extends PreviouslyData {
    /**
     * 游戏客户端的基本信息
     */
    provider?: ProviderData;
    /**
     * 之前的数据，变动时这块会出现
     */
    previously?: PreviouslyData;
    /**
     * 新增的数据，变动时这块会出现
     */
    added?: AddedData;
    /**
     * 验证信息
     */
    auth: {
        [key: string]: string;
    };
}
/**
 * 之前的数据
 */
export interface PreviouslyData {
    /**
     * 地图数据
     */
    map?: MapData;
    /**
     * 回合数据
     */
    round?: RoundData;
    /**
     * 玩家数据
     */
    player?: PlayerData;
}
