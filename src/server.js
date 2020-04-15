import express from 'express';
import bodyParser from 'body-parser';

// this is our fake database which is just a json object
const articlesInfo = {
  "learn-react": {
    upvotes: 0,
    comments: [],
  },
  "learn-node": {
    upvotes: 0,
    comments: [],
  },
  "my-thoughts-on-resumes": {
    upvotes: 0,
    comments: [],
  },
};


const app = express(); 
// once we have the app created that way we can define the end-points and what do we want to do once we hit one of those end points

app.use(bodyParser.json());
// this will parse the JSON object that we included in the body of our POST request and it adds a body property to the request parameter of whatever the matching route is

// app.get('/hello', (req, res) => res.send('Hello!'));
// app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}`))
// app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}!`));

app.post('/api/articles/:name/upvote', (req, res) => {
    const articleName = req.params.name;

    articlesInfo[articleName].upvotes += 1;
    res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes!`)
});

app.post('/api/articles/:name/add-comment', (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;

    articlesInfo[articleName].comments.push({ username, text });

    res.status(200).send(articlesInfo[articleName]);

})

app.listen(8000, () => console.log('Listening on port 8000'));




// ▶ npx babel-node src/server.js -> run this command in the console to start the node server  -> should get :
// Listening on port 8000

// ▶ npx nodemon --exec npx babel-node src/server.js -> run this in the console for the server to restart automatically (so we don't have to do it manually)