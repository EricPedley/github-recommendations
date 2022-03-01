const express = require('express');
const { getConnections, getNOrderConnections } = require('./ghapi');

if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const app = express();
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const username = req.query.username;
  res.render('index', {username});
});

app.get('/user', async (req, res) => {
  const username = req.query.username||"";
  const connections = await getNOrderConnections(username,req.query.depth);
  console.log(connections);
  res.render('user', {username, connections: Object.values(connections)});
});

app.listen(process.env.PORT||3000, () => console.log('Listening on 3000'));