const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { PORT } = require("./utils/config");

console.log(process.env.NODE_ENV);
server.listen(PORT || 3001, () => {
  console.log(`Server running on port ${PORT}`);
});
