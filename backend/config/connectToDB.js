const mongoose = require("mongoose");

const connectToDB = () => {
  const uri = process.env.MONGO_DB;

  if (!uri) {
    console.error("❌ MONGO_DB URI is not defined in .env");
    process.exit(1); // stop server
  }

  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
      console.error("❌ Failed to connect to MongoDB:", err.message);
      process.exit(1); // Exit with failure
    });
};

module.exports = connectToDB;
