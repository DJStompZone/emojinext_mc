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
  if (!data.message) {
    return;
  }
  if (data.message.startsWith("!run") || data.message.startsWith("~run")) {
    onRun(data);
    return;
  }
  try {
    console.log(`CSZE - Chat message received: ${data.message}`);
    handleTranslation(data);
  } catch (error) {
    console.warn(`CSZE - Error ${error},${error.stack}`);
    data.cancel = false;
    return;
  }
}
