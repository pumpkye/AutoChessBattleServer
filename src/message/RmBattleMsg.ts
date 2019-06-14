import { MessageBase } from "./MessagegBase";

export class RmReqBattleResult extends MessageBase {
    name = "rmReqBattleResult";
    data: {
        //唯一id
        battleId: number;
        matchInfo: Array<{
            playerAId: number,
            playerBId: number,
        }>;
        layoutList: Array<{
            playerId: number,
            npcList: Array<ChessNpcInfo>,
        }>
    }
}

export class RmResBattleResult extends MessageBase {
    name = "rmResBattleResult";
    data: {
        battleId: number;
        resultList: Array<Result>;
    }
}

export interface Result {
    /**
     * 主场玩家id
     */
    playerId: number;
    /**
     * 客场玩家id
     */
    enemyId: number;
    /**
     * true为赢，false为平或输
     */
    win: boolean;
    /**
     * 比分，代表获胜一方剩余npc数量
     */
    point: number;
}

export interface ChessNpcInfo {
    thisId: number;
    baseId: number;
    level: number;
    pos: {
        x: number,
        y: number,
    }
}