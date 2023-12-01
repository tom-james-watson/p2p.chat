# p2p.chat

> [!IMPORTANT]
> Archived due to not being actively maintained. I do not currently have the bandwidth to work on this.

p2p.chat is a peer-to-peer video conferencing application. Think of it as an free and open source Zoom alternative.

## Architecture

p2p.chat uses WebRTC to power all video and data communication between peers. Peers communicate directly in a mesh architecture, with the only server interaction being using the [signalling server](./signalling) to allow peers to discover each other. All data sent over WebRTC is end-to-end encrypted.

## Packages:

- [@p2p.chat/www](./www): The web app.
- [@p2p.chat/signalling](./signalling): The signalling server that powers peer discovery.
