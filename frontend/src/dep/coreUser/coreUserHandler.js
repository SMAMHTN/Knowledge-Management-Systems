"use server"
import { readConf } from '../others/confHandler';
import { generateCoreCred } from '../others/generateCred';


export async function Login(Username, Password) {
    const conf = readConf('conf.json');
    const credentials = generateCoreCred(Username,Password);

    try {
      const response = await fetch(conf.core_link, {
        headers: {
          Authorization: `Basic ${credentials}`,
          Accept: '*/*',
        },
      });

      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error
    }
  }

module.exports = {
  Login
  };