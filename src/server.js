import express from 'express';
import bodyParser from 'body-parser';

const app = express(); 
// once we have the app created that way we can define the end-points and what do we want to do once we hit one of those end points

app.use(bodyParser.json());
// this will parse the JSON object that we included in the body of our POST request and it adds a body property to the request parameter of whatever the matching route is

app.get('/hello', (req, res) => res.send('Hello!'));
app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}!`));

app.listen(8000, () => console.log('Listening on port 8000'));




// ▶ npx babel-node src/server.js -> run this command in the console to start the node server  -> should get :
// Listening on port 8000