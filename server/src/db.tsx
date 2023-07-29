const mongoose = require("mongoose");

const URI = "mongodb://localhost:27017/cv";
const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

const connectToDB = async () => {
  try {
    const connect = await mongoose.connect(URI, OPTIONS);
    if (connect) console.log(`MongoDB connected to ${connect.connection.host}`);
  } catch (err) {
    console.log(`Database error ${err}`);
  }
};

module.exports = connectToDB;
export {};