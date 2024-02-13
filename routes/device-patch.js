let express = require("express");
let router = express.Router();
const mongoose = require("mongoose");
const UserDetailsModel = require("../models/UserDetailsModel");
const GroupDatabaseModel = require("../models/GroupDatabaseModel");

router.patch("/device-measure", (req, res) => {
  /*
    {
      "group_id": string,
      "device_id": string
      "co2": float percentage removed
      "o2" : float percentage consumed
      "vol": float Liters
    }
    */

  var groupDBUri;
  mongoose
    .connect(process.env.DB_MASTER_URI)
    .then(() => {
      GroupDatabaseModel.findOne({ group_id: req.body.group_id })
        .then((doc) => {
          groupDBUri = doc.db_uri;
          mongoose
            .connect(groupDBUri)
            .then(() => {
              const date = new Date();
              // const timestamp = date.toUTCString();
              const { device_id, co2, o2, vol } = req.body;

              UserDetailsModel.find({ device_id: device_id })
                .then(function (docs) {
                  var rer = co2 / o2;
                  var dataMeasure = {
                    o2: o2,
                    co2: co2,
                    vol: vol,
                    rer: rer,
                    vo2max: 0,
                    time: date.toUTCString(),
                  };
                  if (docs.length > 0) {
                    if (docs[0].weight == 0) {
                      dataMeasure.vo2max = 0;
                    } else {
                      dataMeasure.vo2max =
                        (vol * o2 * 0.01 * 1000) / docs[0].weight; // this is the formula in the paper
                    }

                    // updadte existing doc
                    UserDetailsModel.updateOne(
                      { _id: docs[0]._id },
                      { $push: { data: dataMeasure } }
                    )
                      .then(() => {
                        res.status(200).send(req.body);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    res.status(400).send("User not found");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
});

router.patch("/device-disconnect", (req, res) => {
  /*
      {
        "group_id": string,
        "device_id": string
      }
  */

  var groupDBUri;
  mongoose
    .connect(process.env.DB_MASTER_URI)
    .then(() => {
      GroupDatabaseModel.findOne({ group_id: req.body.group_id })
        .then((doc) => {
          groupDBUri = doc.db_uri;

          mongoose
            .connect(groupDBUri)
            .then(() => {
              UserDetailsModel.updateOne(
                { device_id: req.body.device_id },
                { device_id: "" }
              )
                .then((result) => {
                  res.status(200).send(result);
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
