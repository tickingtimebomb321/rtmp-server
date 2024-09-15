const NodeMediaServer = require("node-media-server");
const fs = require("fs");

const config = {
  rtmp: {
    port: 80,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: "https://ninecw-radio-test1.onrender.com",
    ssl: {
      port: 8443,
      key: "/path/to/privkey.pem",
      cert: "/path/to/fullchain.pem",
    },
  },
  logType: 2, // Enable logging to console and file
};

const nms = new NodeMediaServer(config);

nms.on("preConnect", (id, args) => {
  console.log(
    "[NodeEvent on preConnect]",
    `id=${id} args=${JSON.stringify(args)}`
  );
  const { app, streamKey } = args;

  // Add your authentication logic here
  if (streamKey !== "validStreamKey") {
    nms.getSession(id).reject();
  }
});

nms.on("prePublish", (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on prePublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
  // Add stream authorization logic here
});

nms.run();

// Graceful shutdown
process.on("SIGINT", () => {
  nms.stop();
  console.log("RTMP Server gracefully shut down");
  process.exit(0);
});
