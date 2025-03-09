import { ChatData } from "./chat";
import { newmoji } from "./newmoji";
import { stickers } from "./stickers";

interface TranslationFunction {
  (msg: string): string;
}
export const getTranslation: TranslationFunction = function (
  msg: string
): string {
  if (
    msg.slice(1, 12).includes("fromnether") ||
    msg.slice(1, 12).includes("tonether") ||
    msg.slice(1, 4).includes("fm")
  ) {
    return msg;
  }
  let chrs: string[] = Array.from(msg);
  let skipflag: number = 0;
  let newMsg: string[] = [];
  for (const i of Array(chrs.length).keys()) {
    if (chrs[i] == "§") {
      skipflag = 1;
      newMsg.push(chrs[i]);
      continue;
    } else if (skipflag === 1) {
      newMsg.push(chrs[i]);
      skipflag = 0;
      continue;
    } else if (chrs[i].charCodeAt(0) < 127 && chrs[i].charCodeAt(0) > 32) {
      let cc: number = chrs[i].charCodeAt(0);
      newMsg.push(String.fromCharCode(10240 + cc));
    } else if (chrs[i].charCodeAt(0) > 59647 && chrs[i].charCodeAt(0) < 61550) {
      let stickerspacer: string = `\n\n\n\n\n\n${chrs[i]}\n\n\n\n\n\n`;
      newMsg.push(...Array.from(stickerspacer));
    } else {
      newMsg.push(chrs[i]);
    }
  }
  return newMsg.join("");
};

export function handleTranslation(data: ChatData): void {
  if (["!s", "~s", ".s"].includes(data.message.slice(0, 2).toLowerCase())) {
    if (
      ["s", "sticker"].includes(
        data.message.slice(1).split(" ")[0].toLowerCase()
      )
    ) {
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
  } else {
    let scram = getTranslation(data.message);
    data.message = scram;
  }
}
const mojex = /:[a-z0-9_]+?:/gi;
interface ParseMojiFunction {
  (msg: string): string | undefined;
}

export const parseMoji: ParseMojiFunction = function (
  msg: string
): string | undefined {
  const matches: string[] = msg.match(mojex) ?? [];
  if (!matches) {
    return;
  }
  for (const i of Array(matches?.length ?? 0).keys()) {
    let matched: number | undefined =
      newmoji[matches[i]?.replace(/:/g, "")?.toLowerCase()];
    if (!!matched) {
      msg = msg.replace(matches[i], String.fromCharCode(matched));
    }
  }
  return msg;
};

export const getSticker = function (stkrString) {
  if (stickers.hasOwnProperty(stkrString)) {
    return `\n\n\n\n\n\n${String.fromCharCode(
      stickers[stkrString]
    )}\n\n\n\n\n\n`;
  } else {
    return null;
  }
};
