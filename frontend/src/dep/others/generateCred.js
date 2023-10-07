import { readConf } from './confHandler';

function generateCoreCred(username, password) {
  const conf = readConf('frontend_conf.json');
  const credentials = Buffer.from(
    `${conf.core_password}:${username}&&${password}`,
  ).toString('base64');
  return credentials;
}

function generateKmsCred(username, password) {
  const conf = readConf('frontend_conf.json');
  const credentials = Buffer.from(
    `${conf.kms_password}:${username}&&${password}`,
  ).toString('base64');
  return credentials;
}

module.exports = {
  generateCoreCred,
  generateKmsCred,
};
