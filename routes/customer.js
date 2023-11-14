const express = require("express");
const app = express();

const { requireAuth } = require("../middleware/authMiddleware");
const venues = require("../mongo/venue/venues");
const activities = require("../mongo/activity/activities");
const bookings = require("../mongo/records/bookings");
const activityBookings = require("../mongo/records/activityBookings");

app.get(
  "/fetch-venues",
  // requireAuth,
  async (req, res) => {
    try {
      let venueList = (await venues.find({})) || [];
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
      const { uid } = req.query;
      if (!uid) {
        res.status(400).send({ error: "UID is missing" });
      }
      let venueDetails = (await venues.findOne({ uid: uid })) || null;
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
  "/book-venue",
  // requireAuth,
  async (req, res) => {
    try {
      const { cid, vid, selectedTimings } = req.body;
      const hostid = await venues.findOne({ uid: vid }, { _id: 0, host_id: 1 });
      selectedTimings.map(
        async (record) =>
          await bookings.create({
            customer_uid: cid,
            venue_uid: vid,
            host_uid: hostid.host_id,
            booking_date: record[1],
            booking_time_slot: record[0],
          })
      );

      res.status(200).send({ host: "record Successfully Inserted" });
    } catch (err) {
      res.status(500).send({ error: "Server Error" });
    }
  }
);

//venue bookings
app.get("/booking-status", async (req, res) => {
  try {
    const { vid } = req.query;
    if (!vid) {
      res.status(400).send({ error: "Venue ID is missing" });
      return;
    }
    let bookingRecords = await bookings.find({ venue_uid: vid });
    res.status(200).send({ records: bookingRecords });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Server Error" });
  }
});

//fetch a customer's venue bookings
app.get("/bookings", async (req, res) => {
  try {
    const { cid } = req.query;
    if (!cid) {
      res.status(400).send({ error: "Venue ID is missing" });
      return;
    }
    let bookingRecords = await bookings.find({ customer_uid: cid });
    res.status(200).send({ records: bookingRecords });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Server Error" });
  }
});

// Activities
app.get(
  "/fetch-activities",
  // requireAuth,
  async (req, res) => {
    try {
      let activityList = (await activities.find({})) || [];
      res.status(200).send({ venues: activityList });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Server Error" });
    }
  }
);
//get a single activity's details
app.get(
  "/activity-details",
  // requireAuth,
  async (req, res) => {
    try {
      const { uid } = req.query;
      if (!uid) {
        res.status(400).send({ error: "UID is missing" });
      }
      let activityDetails = (await activities.findOne({ uid: uid })) || null;
      if (activityDetails) {
        res.status(200).send({ venues: activityDetails });
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
  "/book-activity",
  // requireAuth,
  async (req, res) => {
    try {
      const { cid, aid } = req.body;
      const Activity = await activities.findOne(
        { uid: aid },
        { _id: 0, host_id: 1, time:1, date:1 , participants_uids:1}
      );

      if(!Activity){
        res.status(404).send({err:"Activity not found"})
        return
      }

      await activityBookings.create({
        customer_uid: cid,
        activity_uid: aid,
        host_uid: Activity.host_id,
        booking_date: Activity.date,
        booking_time_slot: Activity.time,
      });

      await activities.updateOne({uid:aid},{$set:{participants_uids:[...Activity.participants_uids,cid]}})

      res.status(200).send({ host: "record Successfully Inserted" });
    } catch (err) {
      res.status(500).send({ error: "Server Error" });
    }
  }
);

module.exports = app;
