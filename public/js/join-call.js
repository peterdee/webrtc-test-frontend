let localJoinStream = null;
let remoteJoinStream = null;

async function connect(callId = '', anchor = '') {
  localJoinStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  remoteJoinStream = new MediaStream();

  const RTCConnection = createRTCConnection();
  const SocketConnection = await createSocketConnection();

  $(`#${anchor}`).empty().append(`
<div class="call">
  <div class="title">
    Call ${callId}
  </div>
  <div class="streams mt-16">
    <video id="local-join-stream" autoplay playsinline></video>
    <video id="remote-join-stream" autoplay playsinline></video>
  </div>
</div>
  `);

  SocketConnection.emit('join-call', { callId });

  SocketConnection.on('invalid-call-id', () => {
    localJoinStream.getTracks().forEach((track) => track.stop());
    $(`#${anchor}`).empty().append(`
<div class="call">
  <div class="title">
    Call with this ID does not exist!
  </div>
  <div class="link-centered">
    <a href="/">Back</a>
  </div>
</div>
    `);
    return SocketConnection.disconnect();
  });

  SocketConnection.on('missing-call-id', () => {
    localJoinStream.getTracks().forEach((track) => track.stop());
    $(`#${anchor}`).empty().append(`
<div class="call">
  <div class="title">
    Call ID is missing!
  </div>
  <a
    class="mt-16"
    href="/"
  >
    Back
  </a>
</div>
    `);
    return SocketConnection.disconnect();
  });

  localJoinStream.getTracks().forEach((track) => {
    RTCConnection.addTrack(track, localJoinStream);
  });

  RTCConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteJoinStream.addTrack(track);
    });
  };

  SocketConnection.on('join-call', async ({ offer }) => {
    document.getElementById('local-join-stream').srcObject = localJoinStream;
    document.getElementById('remote-join-stream').srcObject = remoteJoinStream;

    RTCConnection.onicecandidate = (event) => {
      if (event.candidate) {
        SocketConnection.emit(
          'create-answer-candidate',
          {
            callId,
            data: JSON.stringify(event.candidate),
          },
        );
      }
    };

    await RTCConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answerDescription = await RTCConnection.createAnswer();
    await RTCConnection.setLocalDescription(answerDescription);
  
    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    SocketConnection.emit('create-answer', { answer, callId });

    SocketConnection.on('create-offer-candidate', ({ data }) => {
      RTCConnection.addIceCandidate(new RTCIceCandidate(data));
    });
  });
}

async function joinCall(anchor = '') {
  $(`#${anchor}`).empty().append(`
<div class="call">
  <div class="title">
    Please provide Call ID
  </div>
  <form
    class="call"
    id="connect-form"
  >
    <input
      class="mt-16"
      id="call-id-input"
      type="text"
    />
    <button
      class="mt-16"
      type="submit"
    >
      Connect
    </button>
  </form>
  <div
    class="error mt-16"
    id="error"
  ></div>
</div>
  `);

  $('#connect-form').on('submit', (event) => {
    event.preventDefault();
    const value = $('#call-id-input').val();
    if (value && value.trim()) {
      return connect(value, anchor);
    }

    return $('#error').empty().append('Please provide Call ID!');
  });
}
