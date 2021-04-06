const iceServers = [
  {
    urls: [
      'stun:stun1.l.google.com:19302', 
      'stun:stun2.l.google.com:19302',
    ],
  },
];

if (window.location.hostname !== 'localhost') {
  iceServers.push({
      urls: 'turn:relay.backups.cz',
      credential: 'webrtc',
      username: 'webrtc',
  });
}

const createRTCConnection = () => new RTCPeerConnection({
  iceCandidatePoolSize: 10,
  iceServers,
});
