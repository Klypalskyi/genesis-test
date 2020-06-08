const startServer = require("./app/server");
const db = require("./app/db/connect");
const port = process.env.PORT || 3000

startServer(port);
db.start();