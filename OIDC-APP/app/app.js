const express = require('express')
const session = require('express-session');
const { setupOIDC } = require('./oidc-config');


const app = express()

const version = '25MAR/01'


app.disable('x-powered-by');
app.set('view engine', 'ejs')
app.use(function(req, res, next) {
  res.setHeader('server', 'unknown')
  next();
});

app.use(express.static(__dirname + '/'))

app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true,
}));

// Setup OIDC routes and client
setupOIDC(app);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SAGE test</title>
        <link rel="stylesheet" href="static/css/main.css">
      </head>
      <body>
        <h1>OIDC test</h1>
        <a href="/login" class="button-blue-border">Login with EGI Check-in<a>
        <a href="/profile">View Profile</a><br>
      </body>
    </html>
    `);
});


app.listen(8081, () => {
  console.log('App running on http://localhost:8081');
});