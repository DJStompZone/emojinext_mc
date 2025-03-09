var _a, _b, _c, _d, _e, _f, _g, _h;
import { world } from "@minecraft/server";
import { skyRats } from "./skyRats";
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
if ((_f = (_e = world.afterEvents) === null || _e === void 0 ? void 0 : _e.entitySpawn) !== null && _f !== void 0 ? _f : null) {
    try {
        (_g = world.afterEvents) === null || _g === void 0 ? void 0 : _g.entitySpawn.subscribe(skyRats);
        console.log("Subscribed to entity spawn event");
    }
    catch (e) {
        console.error(`CSZE - Error in entity spawn subscription ${e}\n${(_h = e === null || e === void 0 ? void 0 : e.stack) !== null && _h !== void 0 ? _h : ""}`);
    }
}
else {
    console.error("Unable to subscribe to entity spawning event! (Event not found)");
}
