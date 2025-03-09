import { world } from "@minecraft/server";
import { skyRats } from "./skyRats";
import { onChat } from "./chat";

if (world.beforeEvents?.chatSend ?? null) {
  try {
    world.beforeEvents?.chatSend.subscribe(onChat);
  } catch (e) {
    console.error(
      `CSZE - Error in chat event subscription ${e}\n${e?.stack ?? ""}`
    );
  }
} else {
  console.error("Unable to subscribe to chat message event! (Event not found)");
}

if (world.afterEvents?.entitySpawn ?? null) {
  try {
    world.afterEvents?.entitySpawn.subscribe(skyRats);
  } catch (e) {
    console.error(
      `CSZE - Error in entity spawn subscription ${e}\n${e?.stack ?? ""}`
    );
  }
} else {
  console.error(
    "Unable to subscribe to entity spawning event! (Event not found)"
  );
}
