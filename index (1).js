import { MongoClient } from "mongodb";
import fs from "fs";

// 🔑 Replace this with your real MongoDB Atlas connection string
const uri = "mongodb+srv://shewregdehana:Hana123@cluster0.zcfax7t.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    // ✅ Use your database and collection
    const database = client.db("cropdb2");
    const collection = database.collection("crops");

    // Read crops from JSON file
    const data = JSON.parse(fs.readFileSync("crops.json", "utf8"));

    // 🗑️ Remove previous documents
    await collection.deleteMany({});
    console.log("✅ Previous documents removed");

    // ➕ Insert all crops from JSON
    const result = await collection.insertMany(data.crops);
    console.log(`✅ ${result.insertedCount} crops inserted into cropdb2.crops`);
  } catch (err) {
    console.error("❌ Error inserting documents:", err);
  } finally {
    await client.close();
  }
}

run();
