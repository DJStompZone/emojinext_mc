import { Dimension } from "@minecraft/server";
import { onRun } from "./run";
import { handleTranslation } from "./translation";

export interface ChatData {
  message: string;
  sender: {
    name: string;
    dimension: Dimension;
    sendMessage: (msg: string) => void;
    playSound: (sound: string) => void;
  };
  cancel: boolean;
}

export function onChat(data: ChatData): void {
  if (!data.message && !data.message.includes("!run")) {
    return;
  }
  if (data.message.startsWith("!run")) {
    onRun(data);
    return;
  }
  try {
    handleTranslation(data);
  } catch (error) {
    console.warn(`CSZE - Error ${error},${error.stack}`);
    data.cancel = false;
    return;
  }
}
