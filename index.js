const app = require('./app');
// const server = http.createServer(app);
const { PORT } = require('./utils/config');

// console.log(process.env.NODE_ENV);
// server.listen(PORT || 3001, () => {
//   console.log(`Server running on port ${PORT}`);
// });
app.listen(PORT, () => {
  console.log('Server running on port 3001');
});
