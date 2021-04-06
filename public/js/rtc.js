const createRTCConnection = () => new RTCPeerConnection({
  iceCandidatePoolSize: 10,
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302', 
        'stun:stun2.l.google.com:19302',
      ],
    },
    {
      urls: 'turn:relay.backups.cz',
      password: 'webrtc',
      username: 'webrtc'
    },
  ],
});
