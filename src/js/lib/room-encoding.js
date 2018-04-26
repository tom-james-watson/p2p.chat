import shorthash from 'shorthash'

function getRoomHash(key, roomName) {
  return shorthash.unique(`${key}${roomName}`)
}

function encodeRoom(roomName) {

  const key = (+new Date).toString(36).slice(-5)
  const hash = getRoomHash(key, roomName)
  const roomCode = `${key}${hash}/${roomName}`

  return roomCode

}

function decodeRoom(roomCode) {

  try {

    const key = roomCode.substr(0, 5)
    const [hash, roomName] = roomCode.slice(5).split('/')

    const computedHash = getRoomHash(key, roomName)

    if (hash !== computedHash) {
      throw 'Bad room hash'
    }

    return roomName

  } catch(e) {

    console.error(e);
    throw 'Invalid room code'

  }

}

export {encodeRoom}
export {decodeRoom}
