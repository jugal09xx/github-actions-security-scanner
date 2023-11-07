import { commands } from "../models/Commands.js";

function extractCommands(data) {
    if(typeof data === 'object') {
        for (const key in data) {
            if(key === 'run') {
                commands.push(data[key]);
            } else {
                extractCommands(data[key]);
            }
        }
    } else if (Array.isArray(data)) {
        data.forEach(item => extractCommands(item));
    }
}

export {extractCommands} 