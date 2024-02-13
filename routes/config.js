let express = require("express");
let router = express.Router();
const mongoose = require("mongoose");
const GroupDatabaseModel = require("../models/GroupDatabaseModel");

router.post("/create-group", (req, res) => {
  /*
    {
        "group_id": string,
        "db_uri": string
    }
    */
  mongoose.connect(process.env.DB_MASTER_URI).then(() => {
    GroupDatabaseModel.create(req.body).then((result) => {
      res.status(200).send(result);
    });
  });
});

router.post("/login", (req, res) => {
  /*
  {
    "group_id": string,
    "password": string
  }
  */
  mongoose.connect(process.env.DB_MASTER_URI).then(() => {
    GroupDatabaseModel.findOne({ group_id: req.body.group_id })
      .then((doc) => {
        // res.send(doc);
        console.log(req.body.group_id);
        console.log(doc);
        if (doc.password == req.body.password) {
          res.status(200).send("Logged in successfully");
        } else {
          res.status(401).send("Wrong Login"); // change the status
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(502).send("Error");
      });
  });
});

module.exports = router;
