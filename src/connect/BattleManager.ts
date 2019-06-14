import { RmReqBattleResult, RmResBattleResult, Result } from "../message/RmBattleMsg";
import { g_Connector } from "./connector";
import { BattleInfo, LayoutInfo } from "../AutoBattle/Input/InputCache";
import { g_AutoBattleManager } from "../AutoBattle/AutoBattleManager";
import { Enum_Mode } from "../AutoBattle/AutoBattleManager";
import { g_OutputCache } from "../AutoBattle/OutPut/OutPutCache";

class BattleManager {
    constructor() {
    }

    rmReqBattleResult(msg: RmReqBattleResult['data'], wsId: number) {
        // dobattle
        let battleId = msg.battleId;
        let battleInfo = this.setBattleInfo(msg);
        let results = this.doAutoBattle(battleInfo);
        //return
        let res = new RmResBattleResult();
        res.data.battleId = battleId;
        res.data.resultList = results;
        g_Connector.sendMsg(wsId, res);
    }

    /**
     * 格式化battleInfo
     * @param msg 
     */
    setBattleInfo(msg: RmReqBattleResult['data']) {
        let battleInfo = new BattleInfo(1);
        for (let i = 0; i < msg.matchInfo.length; i++) {
            const match = msg.matchInfo[i];
            battleInfo.addMatch(match.playerAId, match.playerBId);
        }
        for (let i = 0; i < msg.layoutList.length; i++) {
            const layout = msg.layoutList[i];
            let layoutInfo = new LayoutInfo(layout.playerId);
            for (let j = 0; j < layout.npcList.length; j++) {
                const npc = layout.npcList[j];
                layoutInfo.addChessNpcInfo(npc);
            }
            battleInfo.addLayout(layoutInfo);
        }
        return battleInfo;
        // g_InputCache.setBattleInfo(battleInfo);
    }

    /**
     * 计算战斗结果，1-8场
     * @param battleInfo 
     */
    doAutoBattle(battleInfo: BattleInfo) {
        let result = new Array<Result>();
        g_AutoBattleManager.mode = Enum_Mode.quick;
        for (let i = 0; i < battleInfo.matches.length; i++) {
            let match = battleInfo.matches[i];
            let layoutA = battleInfo.getLayoutByPlayerId(match.playerThisIdA);
            let layoutB = battleInfo.getLayoutByPlayerId(match.playerThisIdB);
            if (layoutA && layoutB) {
                g_AutoBattleManager.start(layoutA, layoutB, i);
            }
            result.push({
                playerId: match.playerThisIdA,
                enemyId: match.playerThisIdB,
                win: g_OutputCache.isWin,
                point: g_OutputCache.point,
            })
        }
        return result;
    }
}

export const g_BattleManager = new BattleManager();