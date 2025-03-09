import { world } from "@minecraft/server";
import { newmoji } from "./newmoji";
import { stickers } from "./stickers";
const mojex = /:[a-z0-9_]+?:/gi;
export const getTranslation = function (msg) {
    if (msg.slice(1, 12).includes("fromnether") ||
        msg.slice(1, 12).includes("tonether") ||
        msg.slice(1, 4).includes("fm")) {
        return msg;
    }
    let chrs = Array.from(msg);
    let skipflag = 0;
    let newMsg = [];
    for (const i of Array(chrs.length).keys()) {
        if (chrs[i] == "§") {
            skipflag = 1;
            newMsg.push(chrs[i]);
            continue;
        }
        else if (skipflag === 1) {
            newMsg.push(chrs[i]);
            skipflag = 0;
            continue;
        }
        else if (chrs[i].charCodeAt(0) < 127 && chrs[i].charCodeAt(0) > 32) {
            let cc = chrs[i].charCodeAt(0);
            newMsg.push(String.fromCharCode(10240 + cc));
        }
        else if (chrs[i].charCodeAt(0) > 59647 && chrs[i].charCodeAt(0) < 61550) {
            let stickerspacer = `\n\n\n\n\n\n${chrs[i]}\n\n\n\n\n\n`;
            newMsg.push(...Array.from(stickerspacer));
        }
        else {
            newMsg.push(chrs[i]);
        }
    }
    console.log("Debug: (translation::getTranslation)" + `${msg} -> ${newMsg.join("")}`);
    return newMsg.join("");
};
export function handleTranslation(data) {
    console.log(`CSZE - (translation::handleTranslation) - Chat message received: ${data.message}`);
    if (["!s", "~s", ".s"].includes(data.message.slice(0, 2).toLowerCase())) {
        if (["s", "sticker"].includes(data.message.slice(1).split(" ")[0].toLowerCase())) {
            let stkrStr = data.message.slice(1).split(" ").slice(1);
            if (stkrStr.length === 1) {
                let stkr = getSticker(stkrStr[0]);
                if (stkr !== null) {
                    data.cancel = true;
                    world.sendMessage(stkr);
                    return;
                }
            }
        }
    }
    if (data.message.includes(":")) {
        console.log("Debug: (translation::handleTranslation) - Parsing emoji");
        let mojed = parseMoji(data.message);
        console.log("Debug: (translation::handleTranslation) - Emoji parsed: " + mojed);
        let scram = getTranslation(mojed);
        data.cancel = true;
        world.sendMessage(scram);
    }
    else {
        let scram = getTranslation(data.message);
        data.message = scram;
    }
}
export const parseMoji = function (msg) {
    var _a, _b, _c, _d;
    let newMsg = msg;
    console.log("Debug: (translation::parseMoji) - Parsing emoji: " + msg);
    const matches = (_a = msg.match(mojex)) !== null && _a !== void 0 ? _a : [];
    if (!matches) {
        console.error("Debug: (translation::parseMoji) - No emoji found in message");
        return;
    }
    for (const i of Array((_b = matches === null || matches === void 0 ? void 0 : matches.length) !== null && _b !== void 0 ? _b : 0).keys()) {
        let matched = newmoji[(_d = (_c = matches[i]) === null || _c === void 0 ? void 0 : _c.replace(/:/g, "")) === null || _d === void 0 ? void 0 : _d.toLowerCase()];
        if (!!matched) {
            newMsg = msg.replace(matches[i], String.fromCharCode(matched));
        }
    }
    console.log("Debug: (translation::parseMoji) - Emoji parsed: " + msg);
    return newMsg;
};
export const getSticker = function (stkrString) {
    if (stickers.hasOwnProperty(stkrString)) {
        return `\n\n\n\n\n\n${String.fromCharCode(stickers[stkrString])}\n\n\n\n\n\n`;
    }
    else {
        console.error(`Sticker ${stkrString} not found`);
        return null;
    }
};
