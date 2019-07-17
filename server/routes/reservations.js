var express = require('express');
var router = express.Router();
var MessagingResponse = require('twilio').twiml.MessagingResponse;
var Reservation = require("../models/reservations");

/* GET request */
router.get('/', function(req, res, next) {
  Reservation.find({}, (err, reservations) => {
    if (err) {
      console.log(err);
    } else {
      reservations = formatReservations(reservations);
      res.json(reservations);
      // res.json([{id: 1, name: "sola"}, {id: 2, name: "foobar"}]);
    }
  });
});

/* POST create reservations */
router.post('/', function(req, res, next) {
  var twiml = new MessagingResponse();

  // The content of the text message sent to twilio.
  var reservationMessage = req.body.Body.split('/');
  var firstName = reservationMessage[0];
  var lastName = reservationMessage[1];
  var datetime = reservationMessage[2];
  var reservationDate = new Date(datetime);
  var reservationHours = reservationDate.getHours();
  var reservationMin =  (reservationDate.getMinutes() < 10) ? '0' + reservationDate.getMinutes() : reservationDate.getMinutes()

  //  The message we send back after we make a reservation (successfully or
  //  otherwise).

  var message = '';

  const restaurant = {
    opening: 8,
    closing: 22,
    name: 'Hariet'
  };

  if (restaurant.opening < reservationHours && reservationHours < restaurant.closing - 1) {
    message = 'Reservation successful';

    // Add details of a successful reservation to the database.
    let newReservation = {firstname: firstName, lastname: lastName, datetime: datetime};
    Reservation.create(newReservation, (err, reservation) => {
      if (err) {
        console.log(err);
      } else {
        console.log("reservation successfully saved to database.");
      }
    });
  } else {
    message = 'Reservation unsucessful';
  }

  twiml.message(message);


  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

function formatReservations(data) {
  formattedData = data.map(datum => {
    var reservationDate = new Date(datum.datetime);
    var reservationHours = reservationDate.getHours();
    var reservationMin =  (reservationDate.getMinutes() < 10) ? '0' + reservationDate.getMinutes() : reservationDate.getMinutes()

    reservationObject = {
      id: datum._id,
      name: `${datum.firstname} ${datum.lastname} at
             ${reservationHours}:${reservationMin}`
    }

    return reservationObject;
  });

  return formattedData;
}

module.exports = router;
