const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const app = express()
const port=process.env.PORT || 3000

// middleware
app.use(cors({
  origin:[
    'http://localhost:5174',
    
    'https://odd-self.surge.sh',
    'http://odd-self.surge.sh'
  ],
  credentials:true
}));
app.use(express.json());


console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pzjduhk.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    // const serviceCollection=client.db("carr").collection("services");
    const database = client.db("serviceDB");
    const serviceCollaction = database.collection("service");
    // 
    const databaseBooking = client.db("serviceDB");
    const bookingCollaction = databaseBooking.collection("booking");
        // Auth Releted API
        app.post("/jwt",async(req,res)=>{
          const user=req.body;
          console.log(user)
          // const result = await bookingCollaction.insertOne(user);  
          const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
          res
          .cookie('token',token,{
            httpOnly:true,
            secure:false
          })
          .send({success:true});
          
        })

    
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
    console.log(id);
    const query={_id:new ObjectId(id)};
    const result = await serviceCollaction.deleteOne(query); 
    res.send(result);
  })
  // user Update services
  app.get("/services/:id",async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)};
    const result = await serviceCollaction.findOne(query); 
    res.send(result);
  })
  app.put("/services/:id",async(req,res)=>{
    const id=req.params.id;
    const filter={_id:new ObjectId(id)};
    const options={upsert:true};
    const updatedService=req.body;
    const service={
      $set:{
        pictureURL:updatedService.pictureURL,
        serviceName:updatedService.serviceName,
        description:updatedService.description,
        serviceArea:updatedService.serviceArea,
        price:updatedService.price,
        userName:updatedService.userName,
        useremail:updatedService.useremail,
      }
    }
    const result = await serviceCollaction.updateOne(filter,service,options); 
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
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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