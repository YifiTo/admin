import CryptoJS from 'crypto-js';

const secreateKey = "JIOFENJR"

export function encrypt(text) {
    return CryptoJS.HmacMD5(text, secreateKey).toString();
  }