"use server"

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

export function readConf(ConfFile) {
  try {
    fs.accessSync(ConfFile);
  } catch (err) {
    const parent = getParentPath();
    const path = parent + ConfFile;
    try {
      fs.accessSync(path);
      ConfFile = path;
    } catch (err) {
      throw new Error("Conf file not found");
    }
  }
  const fileData = fs.readFileSync(ConfFile, "utf8");
  const configuration = JSON.parse(fileData);
  return configuration;
}

module.exports = {
    readConf
  };