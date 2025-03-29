import { world } from "@minecraft/server";
export class NetherConverter {
    /**
     * Checks if a command is a nether conversion command
     * @param {string} command The command to check
     * @returns {boolean} Whether the command is a nether command
     */
    static isNetherCommand(command) {
        return [...this.COMMANDS.TONETHER, ...this.COMMANDS.FROMNETHER].includes(command);
    }
    /**
     * Determines if a command should convert to nether
     * @param {string} command The command to check
     * @returns {boolean} Whether the command should convert to nether
     */
    static shouldConvertToNether(command) {
        return this.COMMANDS.TONETHER.includes(command);
    }
    /**
     * Converts Overworld coordinates to Nether and broadcasts the result.
     * @param {Player} player
     * @param {number} x
     * @param {number} z
     */
    static tonether(player, x, z) {
        let netherX = Math.floor(x / 8);
        let netherZ = Math.floor(z / 8);
        NetherConverter.broadcast(player, this.COMMANDS.TONETHER[0], netherX, netherZ);
    }
    /**
     * Converts Nether coordinates to Overworld and broadcasts the result.
     * @param {Player} player
     * @param {number} x
     * @param {number} z
     */
    static fromnether(player, x, z) {
        let overworldX = Math.floor(x * 8);
        let overworldZ = Math.floor(z * 8);
        NetherConverter.broadcast(player, this.COMMANDS.FROMNETHER[0], overworldX, overworldZ);
    }
    /**
     * Converts coordinates based on current dimension and command
     * @param {Player} player
     * @param {string} command
     * @param {number} x
     * @param {number} z
     */
    static convert(player, command, x, z) {
        const isInNether = player.dimension.id === "minecraft:nether";
        const shouldConvertToNether = this.shouldConvertToNether(command);
        if (isInNether && shouldConvertToNether) {
            return this.fromnether(player, x, z);
        }
        if (!isInNether && !shouldConvertToNether) {
            return this.tonether(player, x, z);
        }
        return shouldConvertToNether ? this.tonether(player, x, z) : this.fromnether(player, x, z);
    }
    /**
     * Sends a rawtext broadcast message.
     * @param {Player} player
     * @param {string} command
     * @param {number} x
     * @param {number} z
     */
    static broadcast(player, command, x, z) {
        let rawtext = {
            rawtext: [
                { text: `§6${player.name} used §4${command}§r: [` },
                { text: `§4${x}§r, ` },
                { text: `§k§2Y§r, ` },
                { text: `§4${z}§r]` }
            ]
        };
        world.sendMessage(rawtext);
    }
}
NetherConverter.COMMANDS = {
    TONETHER: [".tonether", ".toneither", ".neither", ".nether", "!tonether", "!toneither", "!neither", "!nether"],
    FROMNETHER: [".fromnether", ".fromneither", ".fneither", ".fnether", "!fromnether", "!fromneither", "!fneither", "!fnether"]
};
