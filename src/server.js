import express from 'express';

const app = express(); 
// once we have the app created that way we can define the end-points and what do we want to do once we hit one of those end points

app.get('/hello', (req, res) => res.send('Hello!'));

app.listen(8000, () => console.log('Listening on port 8000'));

// ▶ npx babel-node src/server.js -> run this command in the console to start the node server  -> should get :
// Listening on port 8000