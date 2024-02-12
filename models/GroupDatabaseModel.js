const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupDBSchema = new Schema({
  group_id: { type: String },
  db_uri: { type: String, default: "" },
  password: { type: String, default: "" },
});

module.exports = mongoose.model("GroupDB", groupDBSchema);
