import { run } from "./run";
export function skyRats(event) {
    if (event && event.entity) {
        let mobs = ["phantom", "minecraft:phantom", "fox", "minecraft:fox"];
        if (mobs.includes(event.entity.typeId)) {
            let mob_loc = event.entity.getHeadLocation();
            mob_loc.y = -64;
            event.entity.teleport({
                x: mob_loc.x,
                y: -200,
                z: mob_loc.z,
            });
            event.entity.kill();
            for (let c of mobs) {
                try {
                    run(`kill @e[type=${c}]`, event.entity.dimension);
                }
                catch (_a) { }
            }
        }
    }
}
