import { system } from "@minecraft/server";
import { run } from "./run";

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message } = event;

  if (id === "moo:ki") {
    const [firstWord] = message.trim().split(/\s+/);

    const command =
      firstWord.toLowerCase() === "on"
        ? "gamerule keepinventory true"
        : firstWord.toLowerCase() === "off"
        ? "gamerule keepinventory false"
        : null;

    if (command) {
      run(command)
        .then(() => {
          console.log(
            `Successfully set keepInventory to ${firstWord.toLowerCase()}.`
          );
        })
        .catch((error) => {
          console.error(`Failed to set keepInventory: ${error}`);
        });
    } else {
      console.error(
        `Invalid command: '${firstWord}'. Use 'on' or 'off' as the first word.`
      );
    }
  }
}); 