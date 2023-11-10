/**
 * 游戏客户端的基本信息
 */
export interface ProviderData {
    /**
     * 游戏名称
     */
    name: string;
    /**
     * 游戏 appid
     */
    appid: number;
    /**
     * 游戏版本
     */
    version: number;
    /**
     * 玩家 steamid
     */
    steamid: string;
    /**
     * 时间戳
     */
    timestamp: number;
}
