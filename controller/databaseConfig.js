import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://jalangowashingtone:J51EqSbqBrrlK7LN@cluster0.hq67cut.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

export default db;
// J51EqSbqBrrlK7LN
