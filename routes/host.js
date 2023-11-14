const { v4: uuidv4 } = require("uuid");

const express = require("express");
const app = express();

const { requireAuth } = require("../middleware/authMiddleware");
const venues = require("../mongo/venue/venues");
const activities = require("../mongo/activity/activities");

app.post(
  "/create-venue",
  // requireAuth,
  async (req, res) => {
    try {
      const {
        name,
        location,
        description,
        images,
        host_name,
        host_id,
        sport,
        timings,
        availability,
        price,
      } = req.body;
      if (
        !name ||
        !location ||
        !description ||
        !host_name ||
        !host_id ||
        !sport ||
        !timings
      ) {
        res.status(400).send({ error: "Required fields are missing" });
        return;
      }
      await venues
        .create({
          name: name,
          uid: uuidv4(),
          location: location,
          description: description,
          images: images || [],
          host_name: host_name,
          host_id: host_id,
          sport: sport,
          timings: timings,
          availability: availability || false,
          price: price || 0,
        })
        .then(() => {
          res.status(200).send("Succesfully added venue");
        })
        .catch((err) => Throw`${err}`);
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Server Error" });
    }
  }
);
app.get(
  "/fetch-venues",
  // requireAuth,
  async (req, res) => {
    const { host_id } = req.query;
    if (!host_id) {
      res.status(400).send({ error: "Required fields are missing" });
      return;
    }
    try {
      let venueList = (await venues.find({ host_id: host_id })) || [];
      res.status(200).send({ venues: venueList });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Server Error" });
    }
  }
);
app.get(
  "/venue-details",
  // requireAuth,
  async (req, res) => {
    try {
      const { uid, host_id } = req.query;
      if (!uid || !host_id) {
        res.status(400).send({ error: "Required fields are missing" });
      }
      let venueDetails =
        (await venues.findOne({ uid: uid, host_id: host_id })) || null;
      if (venueDetails) {
        res.status(200).send({ venues: venueDetails });
      } else {
        res.status(404).send({ venues: venueDetails });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Server Error" });
    }
  }
);

app.post(
  "/create-activity",
  // requireAuth,
  async (req, res) => {
    try {
      const {
        name,
        location,
        description,
        images,
        host_name,
        host_id,
        sport,
        date,
        time,
        participantsLimit,
        availability,
        price,
      } = req.body;
      if (
        !name ||
        !location ||
        !description ||
        !host_name ||
        !host_id ||
        !sport ||
        !date ||
        !time ||
        !participantsLimit
      ) {
        res.status(400).send({ error: "Required fields are missing" });
        return;
      }
      await activities
        .create({
          name: name,
          uid: uuidv4(),
          location: location,
          description: description,
          images: images || [],
          host_name: host_name,
          host_id: host_id,
          sport: sport,
          participantsLimit:participantsLimit,
          date:date,
          time: time,
          availability: availability || false,
          price: price || 0,
        })
        .then(() => {
          res.status(200).send("Succesfully added venue");
        })
        .catch((err) => Throw`${err}`);
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Server Error" });
    }
  }
);
app.get(
  "/fetch-activites",
  // requireAuth,
  async (req, res) => {
    const { host_id } = req.query;
    if (!host_id) {
      res.status(400).send({ error: "Required fields are missing" });
      return;
    }
    try {
      let activityList = (await activities.find({ host_id: host_id })) || [];
      res.status(200).send({ venues: activityList });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Server Error" });
    }
  }
);
app.get(
  "/activity-details",
  // requireAuth,
  async (req, res) => {
    try {
      const { uid, host_id } = req.query;
      if (!uid || !host_id) {
        res.status(400).send({ error: "Required fields are missing" });
      }
      let venueDetails =
        (await activities.findOne({ uid: uid, host_id: host_id })) || null;
      if (venueDetails) {
        res.status(200).send({ venues: venueDetails });
      } else {
        res.status(404).send({ venues: venueDetails });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Server Error" });
    }
  }
);
module.exports = app;
