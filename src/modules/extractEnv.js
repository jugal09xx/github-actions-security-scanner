import { environments } from "../models/Environments.js";

function extractEnv(data) {
    if(typeof data === 'object') {
        for (const key in data) {
            if(key === 'runs-on') {
                environments.push(data[key]);
            } else {
                extractEnv(data[key]);
            }
        }
    } else if (Array.isArray(data)) {
        data.forEach(item => extractEnv(item));
    }
}

export { extractEnv }
