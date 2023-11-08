const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port=process.env.PORT || 3000
// user: mdrashadul898
// pass: xKMnvl7I8c6v68vV

// middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://mdrashadul898:xKMnvl7I8c6v68vV@cluster0.pzjduhk.mongodb.net/?retryWrites=true&w=majority";

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

    // const serviceCollection=client.db("carr").collection("services");
    const database = client.db("serviceDB");
    const serviceCollaction = database.collection("service");
    // 
    const databaseBooking = client.db("serviceDB");
    const bookingCollaction = databaseBooking.collection("booking");
    
    // user booking collection data READ
    app.get("/booking",async(req,res)=>{
      const result=await bookingCollaction.find().toArray();
      res.send(result);
      console.log(result);
    })

    // user booking collection data CREATE
    app.post("/booking",async(req,res)=>{
      const user=req.body;
      console.log(user)
      const result = await bookingCollaction.insertOne(user);
      // const result=await serviceCollection.insertOne(user);   
      res.send(result);
      
    })


// user read
app.get("/services",async(req,res)=>{
    const result=await serviceCollaction.find().toArray();
    res.send(result);
    console.log(result);
  })

  // user create
  app.post("/services",async(req,res)=>{
    const user=req.body;
    console.log(user)
    const result = await serviceCollaction.insertOne(user);
    // const result=await serviceCollection.insertOne(user);   
    res.send(result);
    
  })
  // user Delete
  app.delete("/services/:id",async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)};
    const result = await serviceCollaction.deleteOne(query); 
    res.send(result);
    
  })

  app.get('/service/:id', async(req, res) => {
    const id=req.params.id;
    const query={_id:new ObjectId(id)};
    const options = {
      projection: { title: 1, service_id: 1,price: 1,img:1 },
    };

    const result=await serviceCollaction.findOne(query,options);
    res.send(result);
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running')
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})