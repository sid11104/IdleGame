import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("clientEvent")
export class clientEvent {
    private static _handlers: { [key: string]: any[] } = {};

    public static on(eventName: string, handler: Function, target: any) {
        var objHandler: {} = { handler: handler, target: target };
        var handlerList: Array<any> = clientEvent._handlers[eventName];
        if (!handlerList) {
            handlerList = [];
            clientEvent._handlers[eventName] = handlerList;
        }

        for (var i = 0; i < handlerList.length; i++) {
            if (!handlerList[i]) {
                handlerList[i] = objHandler;
                return i;
            }
        }

        handlerList.push(objHandler);

        return handlerList.length;
    };

    public static off(eventName: string, handler: Function, target: any) {
        var handlerList = clientEvent._handlers[eventName];

        if (!handlerList) {
            return;
        }

        for (var i = 0; i < handlerList.length; i++) {
            var oldObj = handlerList[i];
            if (oldObj.handler === handler && (!target || target === oldObj.target)) {
                handlerList.splice(i, 1);
                break;
            }
        }
    };

    public static dispatchEvent(eventName: string, ...args: any) {
        var handlerList = clientEvent._handlers[eventName];

        var args1 = [];
        var i;
        for (i = 1; i < arguments.length; i++) {
            args1.push(arguments[i]);
        }

        if (!handlerList) {
            return;
        }

        for (i = 0; i < handlerList.length; i++) {
            var objHandler = handlerList[i];
            if (objHandler.handler) {
                objHandler.handler.apply(objHandler.target, args1);
            }
        }
    };
}
