const fs = require("fs");

function fixPath(path) {
  const isUnixPath = path.includes("/");
  const isWindowsPath = path.includes("\\");

  if (isUnixPath) {
    if (!path.endsWith("/")) {
      path = path + "/";
    }
  } else if (isWindowsPath) {
    if (!path.endsWith("\\")) {
      path = path + "\\";
    }
  } else {
    // Use the default separator '/'
    if (!path.endsWith("/")) {
      path = path + "/";
    }
  }

  return path;
}

function getParentPath() {
  const parent = process.cwd();
  return fixPath(parent);
}

export function readConf() {
  let ConfFile = 'frontend_conf.json';
  const parent = getParentPath();
  const potentialPaths = [ConfFile, '/frontend/frontend_conf.json', parent + ConfFile];

  for (const path of potentialPaths) {
    try {
      fs.accessSync(path);
      ConfFile = path; // Update ConfFile with the valid path
      break; // Exit the loop since a valid path is found
    } catch (err) {
      console.log('Unable to use : ' + path);
    }
  }

  const fileData = fs.readFileSync(ConfFile, "utf8");
  const configuration = JSON.parse(fileData);

  for ( const key in configuration) {
    if (configuration.hasOwnProperty(key) && key.endsWith("_link")) {
      const value = configuration[key];
      if (typeof value === "string" && value[value.length - 1] !== "/") {
        configuration[key] = value + "/";
      }
    }
  }

  return configuration;
}

module.exports = {
    readConf
  };