import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb'; // allows us to connect to the local database


const app = express(); 
// once we have the app created that way we can define the end-points and what do we want to do once we hit one of those end points

app.use(bodyParser.json());
// this will parse the JSON object that we included in the body of our POST request and it adds a body property to the request parameter of whatever the matching route is

// app.get('/hello', (req, res) => res.send('Hello!'));
// app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}`))
// app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}!`));

// function responsible for the setup and teardown of our databse communications
const withDB = async (operations, res) => {
    try {
      const client = await MongoClient.connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
      }); // this connect function is asynchornous (returns a promise) -will return a client object that we can use to send queries to database
      const db = client.db("my-blog"); // choose the database we're using

      await operations(db);

      client.close(); // closes our connection to the database
    } catch (error) {
      res.status(500).json({ message: "Error connecting to db", error });
    }
}


// retrieving articles endpoints
app.get('/api/articles/:name', async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
    
        const articleInfo = await db.collection('articles').findOne({ name: articleName});
        res.status(200).json(articleInfo);
    }, res)
})

// sending upvotes endpoints
app.post('/api/articles/:name/upvote', async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
  
        const articleInfo = await db
          .collection("articles")
          .findOne({ name: articleName });
        await db.collection("articles").updateOne(
          { name: articleName },
          {
            $set: {
              upvotes: articleInfo.upvotes + 1,
            },
          }
        );
        const updatedArticleInfo = await db
          .collection("articles")
          .findOne({ name: articleName });
  
        res.status(200).json(updatedArticleInfo);
    }, res)
});    


// sending comments endpoints
app.post('/api/articles/:name/add-comment', (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;

    withDB(async (db) => {
        const articleInfo = await db.collection('articles').findOne({ name: articleName })
        await db.collection('articles').updateOne({ name: articleName }, {
            '$set': {
                comments: articleInfo.comments.concat({ username, text }),
            },
        });
        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName});

        res.status(200).json(updatedArticleInfo);
    }, res);
});

app.listen(8000, () => console.log('Listening on port 8000'));




// ▶ npx babel-node src/server.js -> run this command in the console to start the node server  -> should get :
// Listening on port 8000

// ▶ npx nodemon --exec npx babel-node src/server.js -> run this in the console for the server to restart automatically (so we don't have to do it manually)