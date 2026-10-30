const mongoose = require("mongoose");

const init = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Connected!");
  } catch (err) {
    console.error(err);
  }
};

module.exports = { init };