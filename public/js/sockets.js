const endpoint = window.location.hostname === 'localhost'
  ? 'localhost:2121'
  : 'https://webrtc-test-ws.herokuapp.com';

const createSocketConnection = () => io.connect(
  endpoint,
  {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    withCredentials: true,
  },
);
