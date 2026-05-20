import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "../.env" });
dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/biker_rental");
  console.log("Database connection verified. No predefined data was inserted.");
  console.log("Create the first admin from the web app at /setup-admin when you are ready.");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
