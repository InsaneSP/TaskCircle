import { io } from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
