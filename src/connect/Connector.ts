import webSocket = require('ws');
import { MessageBase } from '../message/MessagegBase';
import { g_BattleManager } from './BattleManager';

class Connector {
    wss: webSocket.Server;

    wsIdSeed: number;
    wsList: Map<number, webSocket>;

    readonly dispatchList: Array<any> = [
        g_BattleManager,
    ];
    constructor() {
        // this.wsIdSeed = 0;
        this.init();
    }

    init() {
        this.wsIdSeed = 0;
        this.wsList = new Map();
    }

    startWebSocketServer() {
        this.wss = new webSocket.Server({
            port: 3100,
        });
        this.wss.on('connection', function (ws) {
            console.log(`connection()`);
            let id = g_Connector.addWs(ws);
            ws.on('message', function (message: any) {
                g_Connector.dispatchMsg(id, message);
            })
            ws.on('close', function () {
                console.log(`断开链接${id}`);
                g_Connector.removeWs(id);
            })
        });
    }

    addWs(ws: webSocket) {
        this.wsIdSeed++;
        let id = this.wsIdSeed;
        this.wsList.set(id, ws);
        return id;
    }

    removeWs(wsId: number) {
        this.wsList.delete(wsId);
    }

    dispatchMsg(wsId: number, data: any) {
        console.log(`dispatchMsg wsId:${wsId},msg:${data}`);
        let msg = JSON.parse(data);
        for (let i = 0; i < this.dispatchList.length; i++) {
            const data = this.dispatchList[i];
            if (typeof (data[msg.name]) === "function") {
                data[msg.name](msg.data, wsId);
            }
        }
    }

    sendMsg(wsId: number, msg: MessageBase) {
        console.log(`sendMsg wsId:${wsId}, msg:${JSON.stringify(msg)}`);
        let ws = this.wsList.get(wsId);
        if (!ws || ws.readyState !== webSocket.OPEN) {
            // console.log("WebSocket instance wasn't ready...");
            return;
        }
        ws.send(JSON.stringify(msg));
    }
}

export const g_Connector = new Connector();