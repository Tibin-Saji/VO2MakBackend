let express = require("express");
let router = express.Router();
const mongoose = require("mongoose");
const UserDetailsModel = require("../models/UserDetailsModel");
const GroupDatabaseModel = require("../models/GroupDatabaseModel");

router.patch("/update-user", (req, res) => {
  /*
  {
    "group_id": String,
    "user_id": String,
    "name": String,
    "age": Int,
    "weight": Int
  }
  */

  mongoose.connect(process.env.DB_MASTER_URI).then(() => {
    GroupDatabaseModel.findOne({ group_id: req.body.group_id }).then((doc) => {
      const { user_id, name, age, weight } = req.body;

      mongoose.connect(doc.db_uri).then(() => {
        // this means I need to store the id of the user. Ughhhh
        UserDetailsModel.updateOne(
          { _id: user_id },
          { name: name, age: age, weight: weight }
        ).then(() => {
          res.status(200).send(req.body);
          console.log("User updated successfully");
        });
      });
    });
  });
});

router.patch("/connect-user", (req, res) => {
  /*
    {
      "group_id": string
      "user_id": string
      "device_id": string
    }
  */
  mongoose.connect(process.env.DB_MASTER_URI).then(() => {
    GroupDatabaseModel.findOne({ group_id: req.body.group_id }).then((doc) => {
      mongoose.connect(doc.db_uri).then(() => {
        const { user_id, device_id } = req.body;

        // remove device from previous connected user
        UserDetailsModel.updateMany(
          { device_id: device_id },
          { device_id: "" }
        ).then(() => {
          // then connect to required user
          UserDetailsModel.updateOne(
            { _id: user_id },
            { device_id: device_id }
          ).then((result) => {
            res.status(200).send(result);
          });
        });
      });
    });
  });
});

router.post("/create-user", (req, res) => {
  /*
    {
        name: String,
        group_id: String,
        age: int,
        weight: float,
        device_id: String
    }
  */

  mongoose.connect(process.env.DB_MASTER_URI).then(() => {
    GroupDatabaseModel.findOne({ group_id: req.body.group_id }).then((doc) => {
      mongoose.connect(doc.db_uri).then(() => {
        UserDetailsModel.updateMany(
          { device_id: req.body.device_id },
          { device_id: "" }
        ).then(() => {
          UserDetailsModel.create({
            name: req.body.name,
            group_id: req.body.group_id,
            age: req.body.age,
            weight: req.body.weight,
            device_id: req.body.device_id,
          }).then((result) => {
            // what is the device id was wrong?
            // lets not make it complicated for now...
            res.status(200).send(result);
          });
        });
      });
    });
  });
});

router.get("/details-user", (req, res) => {
  /* /details-user?groupid=ABC123&userid=234598720354 */

  mongoose.connect(process.env.DB_MASTER_URI).then(() => {
    GroupDatabaseModel.findOne({ group_id: req.query.groupid }).then((doc) => {
      mongoose.connect(doc.db_uri).then(() => {
        UserDetailsModel.findOne({ user_id: req.query.userid }).then((doc) => {
          res.status(200).send(doc);
        });
      });
    });
  });
});

router.get("/users", (req, res) => {
  /* /users?groupid=ABC123 */

  mongoose.connect(process.env.DB_MASTER_URI).then(() => {
    GroupDatabaseModel.findOne({ group_id: req.query.groupid }).then((doc) => {
      mongoose.connect(doc.db_uri).then(() => {
        UserDetailsModel.find({ group_id: req.query.groupid }).then((docs) => {
          res.status(200).send(docs);
        });
      });
    });
  });
});

module.exports = router;
