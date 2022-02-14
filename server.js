import express from 'express';
import fetch from 'node-fetch';
if(process.env.NODE_ENVIRONMENT === "development") {
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
  const followers = await fetch(`https://api.github.com/users/${username}/followers`,
  {//https://dev.to/gr2m/github-api-authentication-personal-access-tokens-53kd
    headers: {
      authorization: `username:token ${process.env.GITHUB_TOKEN}`//temporarily using personal access token instead of registering an oauth app.
    }
  }).then(r=>r.json())
  const following = await fetch(`https://api.github.com/users/${username}/following`,
  {//https://dev.to/gr2m/github-api-authentication-personal-access-tokens-53kd
    headers: {
      authorization: `username:token ${process.env.GITHUB_TOKEN}`//temporarily using personal access token instead of registering an oauth app.
    }
  }).then(r=>r.json())
  res.render('user', {username, followers,following});
});

app.listen(3000, () => console.log('Listening on 3000'));