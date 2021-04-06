const createSocketConnection = () => io.connect(
  'https://webrtc-test-ws.herokuapp.com',
  {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    withCredentials: true,
  },
);
