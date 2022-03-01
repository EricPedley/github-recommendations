const express = require('express');
const { getConnections, getNOrderConnections, getFollowers } = require('./ghapi');

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
  const connectionsList = Object.values(connections).sort((a,b) => {//sort in ascending order by number of mutual connections
    return b.mutualConnections.length - a.mutualConnections.length;
  });
  res.render('user', {username, connections: connectionsList});
});
const port = process.env.PORT||3000;
app.listen(port, () => console.log(`Listening on ${port}`));

//check rate limit: curl -H "Authorization: token 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" -X GET https://api.github.com/rate_limit
