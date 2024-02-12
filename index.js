require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");

const app = express();
const deviceRoute = require("./routes/device-patch");
const userConfigRoute = require("./routes/user-config");
const configRoute = require("./routes/config");

app.use(express.json());
app.use(configRoute);
app.use(deviceRoute);
app.use(userConfigRoute);

// app.post("", (req, res) => {
//   /*
//   co2 percentage removed
//   o2 percentage consumed
//   vol SLM
//   weight kg
//   */
//   const date = new Date();
//   const timestamp = date.toUTCString();
//   const { name, groupID, co2, o2, vol, weight } = req.body;
//   // const body = res.json({
//   //   name,
//   //   groupID,
//   //   co2,
//   //   o2,
//   //   vol,
//   //   weight,
//   //   timestamp,
//   // });
//   //res.json(body);
//   // Create data to be added.
//   var rer = co2 / o2;
//   var vo2max = (vol * o2 * 0.01 * 1000) / weight;
//   var dataMeasure = {
//     o2: o2,
//     co2: co2,
//     vol: vol,
//     rer: rer,
//     vo2max: vo2max,
//     time: timestamp,
//   };
//   UserDetailsModel.find({ name: name }).then(function (docs) {
//     console.log("result1");
//     if (docs.length > 0) {
//       // updadte existing doc
//       UserDetailsModel.updateOne(
//         { _id: docs[0]._id },
//         { $push: { data: dataMeasure } }
//       ).then(function (result) {
//         console.log("result3");
//         res.json(result);
//       });
//     } else {
//       // create a new doc
//       UserDetailsModel.create({
//         name: name,
//         groupID: groupID,
//         data: dataMeasure,
//         weight: weight,
//       }).then(function (result) {
//         console.log("result4");
//         res.json(result);
//       });
//     }
//   });
// });

// app.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port 3000");
});

// mongoose
//   .connect(process.env.DB_URI)
//   .then(() => {})
//   .catch((err) => {
//     console.log(err);
//   });

// tibinsaji ThOmas5197TiBin;
// mongodb+srv://tibinsaji:<password>@abc123.k5bcu.mongodb.net
