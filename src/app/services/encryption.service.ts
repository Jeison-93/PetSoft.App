import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { STORAGE_SECRET_IV, STORAGE_SECRET_KEY } from '../models/generic/conts';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {

  private secretKey = 'CL4V3S3G2R4PETSOFT'; 
  constructor() {}

  // Método para encriptar
  encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, this.secretKey).toString();
  }

  // Método para desencriptar
  decryptToken(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private SECRET_KEY = CryptoJS.enc.Utf8.parse('1234567890123456'); // 🔹 16 caracteres
  private IV = CryptoJS.enc.Utf8.parse('1234567890123456');
  
 // 🔐 Encriptar
 encryptPassword(password: string): string {
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(password), this.SECRET_KEY, {
    iv: this.IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString(); // 🔹 Resultado en Base64
}

// 🔓 Desencriptar
decryptPassword(encryptedText: string): string {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, this.SECRET_KEY, {
      iv: this.IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8); // 🔹 Devuelve la contraseña original
  } catch (error) {
    console.error('Error al desencriptar:', error);
    return ''; // 🔹 Devuelve una cadena vacía en caso de error
  }
}
}
