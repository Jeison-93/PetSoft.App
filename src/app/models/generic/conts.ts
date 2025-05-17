import * as CryptoJS from 'crypto-js';

//(key - storageType - exact) Config
export const TOKEN_LS_NAME = '{95BC6275-19ED-41D5-AD94-DB7905368E25}';
//(key - storageType - exact) Config
export const CONFIG_LS_NAME = '{B33118FB-5512-448D-A6E5-32C244FDFFAB}';
// (key - storageType - exact) Sesión de usuario
export const SESSION_LS_NAME = '{9c3b1eaa-3bcc-4514-8cc8-5da5fee9ad40}';
// (key - storageType - exact) Usuario seleccionado
export const STORAGE_LS_USER = '{27118745-4EE3-4EAB-905E-0E106622B1CE}';
// (key - storageType - exact) SessionStorageType

//Constantes de los roles
export const STORAGE_LS_ADMON = 'ADM';
export const STORAGE_LS_AUX = 'AUX';
export const STORAGE_LS_VET = 'VET';
export const STORAGE_LS_CLI = 'CLI';

export const STORAGE_SECRET_KEY = CryptoJS.enc.Utf8.parse('CL4V3S3G2R4');
export const STORAGE_SECRET_IV = CryptoJS.enc.Utf8.parse('S3C2R1T7K3Y'); // IV de 16 bytes

///Constante de los estados de las citas AGENDADO
export const STATE_SERVICE_AGD = 'AGD';
///Constante de los estados de las citas CONFIRMADO
export const STATE_SERVICE_CONF = 'CONF';
///Constante de los estados de las citas ATENDIDO
export const STATE_SERVICE_ATEN = 'ATEN';
