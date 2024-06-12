const http = require("http");
const app = require("../app");

const server = http.createServer(app);

server.listen(3004);

server.on("listening", () => {
  console.log("el server esta escuchando el puerto 3004");
});
