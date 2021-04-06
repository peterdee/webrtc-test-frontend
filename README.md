## webrtc-test-frontend

Testing WebRTC capabilities

Stack: [Express](http://expressjs.com), [jQuery](https://jquery.com), [Socket.IO](https://socket.io)

DEV: http://localhost:2021

STAGE: https://webrtc-test-frontend.herokuapp.com

### Deploy

```shell script
git clone https://github.com/peterdee/webrtc-test-frontend
cd ./webrtc-test-frontend
nvm use 14
npm i
```

### Launch

```shell script
npm run dev
```

### Heroku

The `stage` branch is deployed to Heroku automatically

### TURN server

This application uses a free TURN server, thus there is no guarantee that it is going to work
