import { world } from "@minecraft/server";
import { onChat } from "./chat";

if (world.beforeEvents?.chatSend ?? null) {
  try {
    world.beforeEvents?.chatSend.subscribe(onChat);
    console.log("Subscribed to chat message event");
  } catch (e) {
    console.error(
      `CSZE - Error in chat event subscription ${e}\n${e?.stack ?? ""}`
    );
  }
} else {
  console.error("Unable to subscribe to chat message event! (Event not found)");
}
