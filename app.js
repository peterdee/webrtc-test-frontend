const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const PORT = Number(process.env.PORT) || 2021;
app.listen(
  PORT,
  () => console.log(`WEBRTC-TEST-FRONTEND is running on port ${PORT}`),
);
