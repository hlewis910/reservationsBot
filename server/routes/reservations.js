var express = require('express');
var router = express.Router();
var MessagingResponse = require('twilio').twiml.MessagingResponse;

/* POST create reservations */
router.post('/', function(req, res, next) {
  var twiml = new MessagingResponse();

  // The content of the text message sent to twilio.
  var reservationMessage = req.body.Body.split('/');
  var reservationDate = new Date(reservationMessage[2]);
  var reservationTime = reservationDate.getHours();

  //  The message we send back after we make a reservation (successfully or
  //  otherwise).

  var message = '';

  const restaurant = {
    opening: 8,
    closing: 22,
    name: 'Hariet'
  };


  if (restaurant.opening < reservationTime && reservationTime < restaurant.closing) {
    message = 'Reservation successful';
  } else {
    message = 'Reservation unsucessful';
  }

  twiml.message(message);


  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

module.exports = router;
