const express = require('express');
const { getConnections, getNOrderConnections } = require('./ghapi');

if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const app = express();
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/user', async (req, res) => {
  const username = req.query.username;
  const connections = await getNOrderConnections(username,2);
  res.render('user', {username, connections: Object.values(connections)});
});

app.listen(3000, () => console.log('Listening on 3000'));