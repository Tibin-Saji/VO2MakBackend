const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// choose DB uri based on group id
// mongoose
//   .connect(process.env.DB_URI)
//   .then(() => {})
//   .catch((err) => {
//     console.log(err);
//   });

const userDetailsSchema = new Schema({
  name: { type: String, required: true },
  group_id: { type: String, reequired: true },
  device_id: { type: String, default: "" },
  desc: { type: String },
  weight: { type: Number, required: true, default: 0 },
  age: { type: Number, required: true, default: 0 },
  data: {
    type: [
      {
        o2: Number,
        co2: Number,
        vol: Number,
        rer: Number,
        vo2max: Number,
        time: String,
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("UserDetails", userDetailsSchema);
