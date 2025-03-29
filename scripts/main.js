var _a, _b, _c, _d;
import { world } from "@minecraft/server";
import { onChat } from "./chat";
if ((_b = (_a = world.beforeEvents) === null || _a === void 0 ? void 0 : _a.chatSend) !== null && _b !== void 0 ? _b : null) {
    try {
        (_c = world.beforeEvents) === null || _c === void 0 ? void 0 : _c.chatSend.subscribe(onChat);
        console.log("Subscribed to chat message event");
    }
    catch (e) {
        console.error(`CSZE - Error in chat event subscription ${e}\n${(_d = e === null || e === void 0 ? void 0 : e.stack) !== null && _d !== void 0 ? _d : ""}`);
    }
}
else {
    console.error("Unable to subscribe to chat message event! (Event not found)");
}
