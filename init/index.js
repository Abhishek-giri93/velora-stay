const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require("../models/listing.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/veloraStay";
async function main(){
  await mongoose.connect(MONGO_URL); 
}

// Calling Main Function
main()
.then(() =>{
  console.log("Database connected successfully !!");
})
.catch((err) => {
  console.log(err);
});

const initDb = async () => {
  await Listing.deleteMany({});   // deleting data
  initData.data = initData.data.map((obj) => ({...obj, owner : '6a376a73d64cddc7269e62df'}));
  await Listing.insertMany(initData.data);
  console.log("Data was inserted successfully !!");
}

initDb();
