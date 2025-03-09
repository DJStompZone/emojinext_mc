import { world, system, Vector3 } from "@minecraft/server";
import { newmoji } from "./newmoji";
import { stickers } from "./stickers";

let dimension = null;
const mojex = /:[a-z0-9_]+?:/gi;

class Commands {
  static run(cmd, dimension = world.getDimension("overworld")) {
    return dimension.runCommand(cmd);
  }
}
const run = Commands.run;

const runC = function (cmd) {
  dimension.runCommandAsync(cmd);
};

if (world.afterEvents?.entitySpawn ?? null) {
  try {
    world.afterEvents?.entitySpawn.subscribe((entityEvent) => {
      if (entityEvent && entityEvent.entity) {
        let skyrats = ["phantom", "minecraft:phantom", "fox", "minecraft:fox"];
        if (skyrats.includes(entityEvent.entity.typeId)) {
          let phantom_loc = entityEvent.entity.getHeadLocation();
          phantom_loc.y = -64;
          entityEvent.entity.teleport({
            x: phantom_loc.x,
            y: -200,
            z: phantom_loc.z,
          });
          entityEvent.entity.kill();
          for (let c of skyrats) {
            try {
              run(`kill @e[type=${c}]`, entityEvent.entity.dimension);
            } catch {}
          }
        }
      }
    });
  } catch (e) {
    console.error(
      `CSZE - Error in entity spawn subscription ${e}\n${e?.stack ?? ""}`
    );
  }
} else {
  console.error("Unable to subscribe to entity spawning event!");
}

const parseMoji = function (msg) {
  const matches = msg.match(mojex) ?? [];
  if (!matches) {
    return;
  }
  for (const i of Array(matches?.length ?? 0).keys()) {
    let matched = newmoji[matches[i]?.replaceAll(":", "")?.toLowerCase()];
    if (!!matched) {
      msg = msg.replace(matches[i], String.fromCharCode(matched));
    }
  }
  return msg;
};

const getSticker = function (stkrString) {
  if (stickers.hasOwnProperty(stkrString)) {
    return `\n\n\n\n\n\n${String.fromCharCode(
      stickers[stkrString]
    )}\n\n\n\n\n\n`;
  } else {
    return null;
  }
};

interface TranslationFunction {
    (msg: string): string;
}

const getTranslation: TranslationFunction = function (msg: string): string {
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

const CSZEError = function (e) {
  console.error(`CSZE - Error ${e}\n${e?.stack ?? ""}`);
};

world.beforeEvents.chatSend.subscribe((data) => {
  if (!data.message || !data.message.includes("!run")) {
    return;
  }
  if (data.message.startsWith("!run")) {
    if (["DJ Stomp", "Realmscord", "RailgunFired"].includes(data.sender.name)) {
      let dimension = data.sender.dimension;

      try {
        var message = data.message;
        let cmd = message.split("!run ")[1];
        runC(cmd);
      } catch (e) {
        CSZEError(e);
      }
      try {
        runC(
          `playsound random.levelup @a[name="${data.sender.name}"] ~~~ 1.0 0.8 1.0`
        );
        data.sender.sendMessage("Command execution success");
      } catch (e) {
        CSZEError(e);
      }
      data.cancel = true;
      return;
    } else {
      try {
        data.sender.playSound("mob.horse.death");
        data.sender.sendMessage(
          "You are not authorized to use Tectonix developer functions!"
        );
        return;
      } catch (e) {
        CSZEError(e);
      }
    }
  } else if (
    data.message.includes("DJ Stomp") &&
    data.sender.name === "TectonixB0T" &&
    data.message.includes("§8[§9Discord§8]§f")
  ) {
    try {
      let dimension = world.getDimension("overworld");
      const runC = function (cmd) {
        dimension.runCommandAsync(cmd);
      };
      var message = data.message;
      let cmd = message.split("!run ")[1];
      runC(cmd);
    } catch (e) {
      CSZEError(e);
    }
    try {
      runC(`playsound random.levelup @a[name="DJ Stomp"] ~~~ 1.0 0.8 1.0`);
      runC('w "DJ Stomp" Command execution success');
    } catch (e) {
      CSZEError(e);
    }
    data.cancel = true;
    return;
  } else {
    try {
      const mojex = /:[a-z0-9_]+?:/gi;

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
    } catch (error) {
      console.warn(`CSZE - Error ${error},${error.stack}`);
      return (data.cancel = false);
    }
  }
});
