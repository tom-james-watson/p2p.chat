import assert from "assert";
import { Local } from "../../atoms/local";

interface MessageName {
  type: "name";
  name: string;
}

export type Message = MessageName;

const onName = (sid: string, message: MessageName) => {
  console.debug(`received name sid=[${sid}] name=[${message.name}]`);
};

const sendMessage = (channel: RTCDataChannel, message: Message) => {
  channel.send(JSON.stringify(message));
};

export const registerDataChannel = (
  sid: string,
  channel: RTCDataChannel,
  local: Local
): void => {
  assert(local.status !== "requestingName");

  channel.onopen = () => {
    sendMessage(channel, { type: "name", name: local.name });
  };

  channel.onmessage = function (event) {
    const message: Message = JSON.parse(event.data);

    switch (message.type) {
      case "name": {
        onName(sid, message);
      }
    }
  };
};
