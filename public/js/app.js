const anchor = 'app-contents';

$(document).ready(() => {
  $('#root').empty().append(`
<div
  class="wrap"
  id="${anchor}"
>
  <div class="title">
    Video calls with WebRTC & Websockets
  </div>
  <button
    class="mt-16"
    id="create-call"
    type="button"
  >
    Create a call
  </button>
  <button
    class="mt-16"
    id="join-call"
    type="button"
  >
    Join a call
  </button>
</div>
<footer>
  <a href="https://github.com/peterdee">Peter Dyumin</a>, ${new Date().getFullYear()}
</footer>
  `);

  $('#create-call').on('click', () => createCall(anchor));
  $('#join-call').on('click', () => joinCall(anchor));
});
