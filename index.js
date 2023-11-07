const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use (cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.izczxgs.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // jobs
    const JobCollection = client.db('OnlineMarketingDB').collection('jobs');
    //mybids
    const BidCollection = client.db('OnlineMarketingDB').collection('mybids');
    // user
    const userCollection = client.db('OnlineMarketingDB').collection('user');

    // add jobs
    app.post('/addJobs', async (req, res) => {
      const bids = req.body;
      console.log(bids);
      const result = await JobCollection.insertOne(bids);
      res.send(result);
  })

  

    app.get('/addJobs', async (req, res) => {
      try{
        const query ={};
        if(req.query.email){
          query.email = req.query.email;
        }
      const result = await JobCollection.find(query).toArray();
      res.send(result)
      }
      catch(error)
      {
        console.log(error);
        res.status(500).send("server error")
      }
  })

  app.get('/addJobs/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await JobCollection.findOne(query)
    res.send(result)
   })
  
      //    updated work here
      app.put('/addJobs/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const UpdateJob = req.body;
        const job = {
          $set: {
              email: UpdateJob.email, 
              jobTitle: UpdateJob.jobTitle, 
              DeadLine: UpdateJob.DeadLine, 
              category: UpdateJob.category, 
            Description : UpdateJob.Description, 
            MaximumPrice: UpdateJob.MaximumPrice, 
              MinumumPrice: UpdateJob.MinumumPrice
          }
            }

        const result = await JobCollection.updateOne(filter, job, options);
        res.send(result);
      })
      // 
      app.delete('/addJobs/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await JobCollection.deleteOne(query);
        res.send(result);
    })

    // my bids
    app.post('/mybids', async (req, res) => {
      const bid = req.body;
      console.log(bid);
      const result = await BidCollection.insertOne(bid);
      res.send(result);
  })

  app.get('/mybids', async (req, res) => {
    const bid = req.body;
    console.log(bid);
    const result = await BidCollection.insertOne(bid);
    res.send(result);
})


    // user api
    app.get('/user', async (req, res) => {
        const cursor = userCollection.find();
        const users = await cursor.toArray();
        res.send(users);
    })
    
    app.post('/user', async (req, res) => {
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Online  marketing is processing')
})

app.listen(port, () =>{
    console.log(`Online  marketing server is running on port: ${port}`);
})