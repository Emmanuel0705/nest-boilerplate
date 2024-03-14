import { HttpStatus } from '@nestjs/common';
import logger from './logger';
import { createHash } from 'crypto';

export interface IFileValidation {
  isSupported: boolean;
  message: string;
  fileType?: 'images' | 'docs';
  fileSize?: string;
}

export interface IRes<T> {
  data?: T;
  status: boolean;
  message: string;
  page?: number;
  total?: number;
  statusCode?: number;
  token?: string;
  limit?: number;
}

export function resError(e: ErrorHandlerX, status_code?: number): IRes<null> {
  new logger().error(e);
  return {
    data: null,
    status: false,
    statusCode: status_code ?? (e?.statusCode || HttpStatus.NOT_IMPLEMENTED),
    message: resolveCustomMessage(e.message),
  };
}

export function resSuccess<T>(dt: {
  message: string;
  data?: T;
  token?: string;
  page?: number;
  total?: number;
  limit?: number;
}): IRes<T> {
  return {
    data: dt.data ?? null,
    status: true,
    statusCode: HttpStatus.OK,
    message: dt.message,
    token: dt.token ?? undefined,
    limit: dt.limit ?? undefined,
    page: dt.page ?? undefined,
    total: dt.total ?? undefined,
  };
}
export const ECUSTOM_ERROR_PREFIX = 'ECUSTOM';

export const setCustomMessage = (msg: string): string => {
  return ECUSTOM_ERROR_PREFIX + ' ' + msg;
};

export const resolveCustomMessage = (e: string): string => {
  if (e.substring(0, 7).trim() === ECUSTOM_ERROR_PREFIX) {
    return e.substring(7).trim();
  } else {
    //add to log file
    new logger().error(e);

    return 'Sorry!, something went wrong.';
  }
};

export default class ErrorHandlerX extends Error {
  statusCode: number;
  constructor(eDt: { message: string; statusCode: number }, ...params: any) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorHandlerX);
    }

    this.name = 'ErrorHandlerX';
    this.statusCode = eDt.statusCode;
    this.message = setCustomMessage(eDt.message);
  }
}

const validMediaExtenstions = {
  docs: {
    pdf: 'pdf',
  },
  image: {
    jpeg: 'jpeg',
    png: 'png',
    jpg: 'jpg',
    webp: 'webp',
  },
  video: {
    mp4: 'mp4',
  },
};

const getFileExtenstion = (file: Express.Multer.File): string => {
  return file.originalname.split('.').pop();
};

export const isImage = (file: Express.Multer.File): boolean => {
  if (!file) {
    return false;
  }
  const fileType = getFileExtenstion(file);

  if (validMediaExtenstions['image'][fileType]) {
    return true;
  } else return false;
};

export const isVideo = (file: Express.Multer.File): boolean => {
  if (!file) {
    return false;
  }
  const fileType = getFileExtenstion(file);

  if (validMediaExtenstions['video'][fileType]) {
    return true;
  } else return false;
};

export const isPdf = (file: Express.Multer.File): boolean => {
  if (!file) {
    return false;
  }
  const fileType = getFileExtenstion(file);

  if (validMediaExtenstions['docs'][fileType]) {
    return true;
  } else return false;
};

export const isStringUUId = (str: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return regexExp.test(str);
};

export const generateStr = (length: number): string => {
  let result = '';
  const characters =
    'AIJK' +
    Date.now() +
    'B4567CDEcdefghijkFG238HLMN' +
    Date.now() +
    'OPQRSTUVWXYZablm' +
    Date.now() +
    'nopqrstuvwxyz019';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toUpperCase();
};

export class GUID {
  Generate() {
    const hex = '0123456789ABCDEF';
    const model = 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx';
    let str = '';
    for (let i = 0; i < model.length; i++) {
      const rnd = Math.floor(Math.random() * hex.length);
      str += model[i] == 'x' ? hex[rnd] : model[i];
    }
    return str.toLowerCase();
  }
}

export function hashString(input: string): string {
  const hash = createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

export function unhashString(hashed: string, value: string): string | null {
  const newHash = hashString(value);

  if (hashed == newHash) {
    return value;
  }

  return null; // No match found
}

export function addMinutesToCurrentTime(minutes: number): Date {
  const currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + minutes);
  return currentTime;
}

export const isDate = (date: any) => {
  return (
    new Date(date) !== ('Invalid Date' as any) && !isNaN(new Date(date) as any)
  );
};

export function randomSortArray(arr: Array<any>): Array<any> {
  // Use the Fisher-Yates Shuffle algorithm to shuffle the array randomly
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}
