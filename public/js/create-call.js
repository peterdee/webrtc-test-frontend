let localStream = null;
let remoteStream = null;

async function createCall(anchor = '') {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  remoteStream = new MediaStream();

  $(`#${anchor}`).empty().append(`
<div class="call">
  <div class="title">
    Your call ID: <span id="call-id">...</span>
  </div>
  <div class="streams mt-16">
    <video id="local-stream" autoplay playsinline></video>
    <video id="remote-stream" autoplay playsinline></video>
  </div>
</div>
  `);

  const RTCConnection = createRTCConnection();
  const SocketConnection = await createSocketConnection();

  localStream.getTracks().forEach((track) => {
    RTCConnection.addTrack(track, localStream);
  });

  RTCConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  SocketConnection.on('connect', async () => {
    $('#call-id').empty().append(SocketConnection.id);

    document.getElementById('local-stream').srcObject = localStream;
    document.getElementById('remote-stream').srcObject = remoteStream;

    RTCConnection.onicecandidate = (event) => {
      if (event.candidate) {
        SocketConnection.emit(
          'create-offer-candidate',
          {
            data: event.candidate.toJSON(),
          },
        );
      }
    };

    const offerDescription = await RTCConnection.createOffer();
    await RTCConnection.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await SocketConnection.emit('create-offer', { offer });

    SocketConnection.on('added-answer', ({ answer }) => {
      if (!RTCConnection.currentRemoteDescription && answer) {
        RTCConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    SocketConnection.on('create-answer-candidate', ({ data }) => {
      if (RTCConnection.remoteDescription && RTCConnection.remoteDescription.type) {
        const candidate = new RTCIceCandidate(JSON.parse(data));
        return RTCConnection.addIceCandidate(candidate);
      }
    });
  });
}
