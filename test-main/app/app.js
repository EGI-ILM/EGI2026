// Test application
const express = require('express')

const app = express()

const version = '25MAR/01'

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>EUreka3D-XR test</title>
      </head>
      <body>
        <h1>EUreka3D-XR test</h1>
        <p>This is a test app</p>
      </body>
    </html>
    `);
});

app.listen(8081)
