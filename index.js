const express = require('express');
const app = express();
const cors =  require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Body Parser Middleware and Cors
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// Set api routes
app.use('/users', require('./routes/users'));
app.use('/refreshToken', require('./routes/refreshToken'));
app.use('/messages', require('./routes/messages'));
app.get("/", (req,res) => {
  console.log("Received get request on root.");
  console.log(req);
  res.send('Welcome to Meerssenger server. This is the root.'); 
})

main();
async function main(){
  // Connect to dababase
  console.log("Connecting to database...");
  connection = await mongoose.connect(process.env.MONGODB);
  if(connection)
    console.log("OK - Successfully connected to database.");
  else
    console.error("ERR - Failed to connect to database.");
  app.listen(process.env.PORT, () => {
    console.log(`OK - Server started on port ${process.env.PORT}.`);
  });
}




