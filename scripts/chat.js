import { onRun } from "./run";
import { handleTranslation } from "./translation";
export function onChat(data) {
    if (!data.message && !data.message.includes("!run")) {
        return;
    }
    if (data.message.startsWith("!run") || data.message.startsWith("!run")) {
        onRun(data);
        return;
    }
    try {
        console.log(`CSZE - Chat message received: ${data.message}`);
        handleTranslation(data);
    }
    catch (error) {
        console.warn(`CSZE - Error ${error},${error.stack}`);
        data.cancel = false;
        return;
    }
}
