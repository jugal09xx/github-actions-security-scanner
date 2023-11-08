const keysToCheck = ['name', 'runs-on', 'run', 'uses', 'on'];

function checkKeysPresence(data) {
  const missingKeys = [];

  function traverseObject(obj) {
    for (const key in obj) {
      if (keysToCheck.includes(key)) {
        // Key found, remove it from the keysToCheck array
        const index = keysToCheck.indexOf(key);
        keysToCheck.splice(index, 1);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        traverseObject(obj[key]);
      }
    }
  }

  if (typeof data === 'object') {
    traverseObject(data);
  }

  // Add any missing keys to the missingKeys array
  keysToCheck.forEach(key => missingKeys.push(key));

  return missingKeys;
}

export { checkKeysPresence };