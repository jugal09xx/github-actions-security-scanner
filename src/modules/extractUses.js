import { uses } from "../models/Uses.js";

function extractUses(data) {
    if(typeof data === 'object') {
        for (const key in data) {
            if(key === 'uses') {
                uses.push(data[key]);
            } else {
                extractUses(data[key]);
            }
        }
    } else if (Array.isArray(data)) {
        data.forEach(item => extractUses(item));
    }
}

export {extractUses} 