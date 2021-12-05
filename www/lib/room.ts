// TODO - replace with something with more recent updates / support?
import shorthash from "shorthash";

const getRoomHash = (key: string, roomName: string): string => {
  return shorthash.unique(`${key}${roomName}`);
};

export const createRoomCode = (roomName: string): string => {
  const key = (+new Date()).toString(36).slice(-5);
  const hash = getRoomHash(key, roomName);
  return key + hash;
};

export const validateRoom = (roomCode: string, roomName: string): void => {
  try {
    const key = roomCode.substr(0, 5);
    const hash = roomCode.substr(5);

    const computedHash = getRoomHash(key, roomName);

    if (hash !== computedHash) {
      throw new Error("Bad room hash");
    }
  } catch (e) {
    console.error(e);
    throw new Error("Invalid room code");
  }
};

export const randomRoomName = (): string => {
  return Math.random().toString(16).substr(2, 8);
};
