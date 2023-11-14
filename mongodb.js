const url ="mongodb+srv://doadmin:uc08d9L5QD6y72K1@db-mongodb-blr1-22124-a75039a0.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=db-mongodb-blr1-22124";
const { MongoClient } = require('mongodb');
const client = new MongoClient(url);
const dbName = 'blockchain';
async function connectDB() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  return db;
}

module.exports = {
    connectDB
}

