# p2p.chat

---

⚠️ **Currently Unmaintained** ⚠️ This was a hobby project that has not been worked on for some time. I would like to pick this up again in the future and overhaul how the app is architected, specifically peer discovery. I advise using https://meet.jit.si if you are looking for open source, professional video conferencing.

---

p2p.chat is a peer-to-peer video conferencing application. Think of it as an free and open source appear.in alternative.

## Architecture

p2p.chat uses WebRTC to power all video/data communication between peers. Each p2p.chat room creates a unique WebRTC swarm, using [webrtc-swarm](https://github.com/mafintosh/webrtc-swarm). This means all peers communicate to all other peers directly, without the need to pass data between any kind of centralized server. This ensures that all video data is end-to-end encrypted.

A [signalhub](https://github.com/mafintosh/signalhub) is used as a signalling server to initially connect the peers together.

## Development

### Environment setup

```sh
  $ npm install
```

### Running

Start the Webpack server (includes live reloading when you change files):

```sh
  $ npm start
```

Open [http://localhost:3001](http://localhost:3001) in a browser.

### Bundling

```sh
  $ npm run bundle
```
