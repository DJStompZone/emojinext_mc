import { CommandResult, Dimension, world } from "@minecraft/server";
import { ChatData } from "./chat";
import { CSZEError } from "./CSZEError";

let dimension = null;

export class Commands {
  public static run(
    cmd: string,
    dimension: Dimension = world.getDimension("overworld")
  ): CommandResult {
    return dimension.runCommand(cmd);
  }
}

export const run = Commands.run;

export const runC = function (cmd: string): CommandResult {
  const dimension = world.getDimension("overworld");
  return dimension.runCommand(cmd);
};

function onCommandSuccess(data: ChatData): void {
  try {
    runC(
      `playsound random.levelup @a[name="${data.sender.name}"] ~~~ 1.0 0.8 1.0`
    );
    data.sender.sendMessage("Command execution success");

    data.cancel = true;
    return;
  } catch (e) {
    try {
      data.sender.playSound("random.levelup");
      data.sender.sendMessage("Command execution success");
      data.cancel = true;
      return;
    } catch (e) {
      CSZEError(e);
    }
    CSZEError(e);
  }
}

function onCommandFailure(data: ChatData): void {
  try {
    data.sender.playSound("mob.horse.death");
    data.sender.sendMessage(
      "You are not authorized to use Tectonix developer functions!"
    );
    return;
  } catch (e) {
    CSZEError(e);
  }
  data.cancel = false;
}

export function onRun(data: ChatData): void {
  if (
    ["DJ Stomp", "Realmscord", "RailgunFired"].includes(data.sender.name) ||
    (data.message.includes("DJ Stomp") &&
      data.sender.name === "TectonixB0T" &&
      data.message.includes("§8[§9Discord§8]§f"))
  ) {
    try {
      var message = data.message;
      let cmd = message.split("!run ")[1];
      runC(cmd);
      onCommandSuccess(data);
      return;
    } catch (e) {
      try {
        let dimension = world.getDimension("overworld");
        const runC = function (cmd: string): void {
          dimension.runCommand(cmd);
        };
        var message = data.message;
        let cmd = message.split("!run ")[1];
        runC(cmd);
        onCommandSuccess(data);
        return;
      } catch (e) {
        onCommandFailure(data);
        CSZEError(e);
        return;
      }
    }
  } else {
    onCommandFailure(data);
  }
}
