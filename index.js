const express = require("express")

const app = express();

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index', {greeting: 'Hello'});
  });
  
  app.listen(3000, () => console.log('Listening on 3000'));