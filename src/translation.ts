import { world } from "@minecraft/server";
import { ChatData } from "./chat";
import { newmoji } from "./newmoji";
import { stickers } from "./stickers";
import { NetherConverter } from "./netherConverter";

const mojex = /:[a-z0-9_]+?:/gi;

export interface TranslationFunction {
  (msg: string, data: ChatData): string;
}

export function handleNetherConversion(command: string, args: string[], data: ChatData): string {
    let x: number, z: number;
    
    if (args.length === 1) {
      // No coordinates provided, use current position
      const pos = data.sender.getHeadLocation();
      x = Math.floor(pos.x);
      z = Math.floor(pos.z);
    } else if (args.length === 3) {
      // Coordinates provided (command + x + z)
      x = parseFloat(args[1]);
      z = parseFloat(args[2]);
      
      if (isNaN(x) || isNaN(z)) {
        return "§cInvalid coordinates provided";
      }
    } else {
      return "§cUsage: .[tonether|fromnether] [x <y?> z]";
    }
    
    NetherConverter.convert(data.sender, command, x, z);
    data.cancel = true;
    return "";
  }

export const getTranslation: TranslationFunction = function (
  msg: string,
  data: ChatData
): string {
  if (msg.startsWith(".") || msg.startsWith("!") || msg.startsWith("~")) {
    const args = msg.split(" ");
    const command = args[0].toLowerCase();
    
    // Handle nether conversion commands
    if (NetherConverter.isNetherCommand(command)) {
      data.cancel = true;
      return handleNetherConversion(command, args, data);
    }
  }

  // Handle regular message translation
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
  console.log("Debug: (translation::getTranslation)" + `${msg} -> ${newMsg.join("")}`);
  return newMsg.join("");
};

export function handleTranslation(data: ChatData): void {
  console.log(`CSZE - (translation::handleTranslation) - Chat message received: ${data.message}`);
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
    let scram = getTranslation(mojed, data);
    data.cancel = true;
    if (scram !== "") {
      world.sendMessage({"rawtext": [{"text": `<${data.sender.name}> ${scram}`}]} )
    }
  } else {
    let scram = getTranslation(data.message, data);
    if (scram !== "") { 
      world.sendMessage({"rawtext": [{"text": `<${data.sender.name}> ${scram}`}]} )
    }
    data.cancel = true;
  }
}

interface ParseMojiFunction {
  (msg: string): string | undefined;
}

export const parseMoji: ParseMojiFunction = function (
  msg: string
): string | undefined {
  let newMsg: string = msg;
  console.log("Debug: (translation::parseMoji) - Parsing emoji: " + msg);
  const matches: string[] = msg.match(mojex) ?? [];
  if (!matches) {
    console.error("Debug: (translation::parseMoji) - No emoji found in message");
    return;
  }
  for (const match of matches) {
    let matched: number | undefined =
      newmoji[match.replace(/:/g, "")?.toLowerCase()];
    if (!!matched) {
      newMsg = newMsg.replace(match, String.fromCharCode(matched));
    }
  }
  console.log("Debug: (translation::parseMoji) - Emoji parsed: " + newMsg);
  return newMsg;
};

interface GetStickerFunction {
  (stkrString: string): string | null;
}

export const getSticker: GetStickerFunction = function (stkrString: string): string | null {
  if (stickers.hasOwnProperty(stkrString)) {
    return `\n\n\n\n\n${String.fromCharCode(
      stickers[stkrString]
    )}\n\n\n\n\n`;
  } else {
    console.error(`Sticker ${stkrString} not found`);
    return null;
  }
};
