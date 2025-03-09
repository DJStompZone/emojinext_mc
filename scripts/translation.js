import { newmoji } from "./newmoji";
import { stickers } from "./stickers";
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
    return newMsg.join("");
};
export function handleTranslation(data) {
    if (["!s", "~s", ".s"].includes(data.message.slice(0, 2).toLowerCase())) {
        if (["s", "sticker"].includes(data.message.slice(1).split(" ")[0].toLowerCase())) {
            let stkrStr = data.message.slice(1).split(" ").slice(1);
            if (stkrStr.length === 1) {
                let stkr = getSticker(stkrStr[0]);
                if (stkr !== null) {
                    data.message = stkr;
                    return;
                }
            }
        }
    }
    if (data.message.includes(":")) {
        let mojed = parseMoji(data.message);
        let scram = getTranslation(mojed);
        data.message = scram;
    }
    else {
        let scram = getTranslation(data.message);
        data.message = scram;
    }
}
const mojex = /:[a-z0-9_]+?:/gi;
export const parseMoji = function (msg) {
    var _a, _b, _c, _d;
    const matches = (_a = msg.match(mojex)) !== null && _a !== void 0 ? _a : [];
    if (!matches) {
        return;
    }
    for (const i of Array((_b = matches === null || matches === void 0 ? void 0 : matches.length) !== null && _b !== void 0 ? _b : 0).keys()) {
        let matched = newmoji[(_d = (_c = matches[i]) === null || _c === void 0 ? void 0 : _c.replace(/:/g, "")) === null || _d === void 0 ? void 0 : _d.toLowerCase()];
        if (!!matched) {
            msg = msg.replace(matches[i], String.fromCharCode(matched));
        }
    }
    return msg;
};
export const getSticker = function (stkrString) {
    if (stickers.hasOwnProperty(stkrString)) {
        return `\n\n\n\n\n\n${String.fromCharCode(stickers[stkrString])}\n\n\n\n\n\n`;
    }
    else {
        return null;
    }
};
