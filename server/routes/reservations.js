var express = require('express');
var router = express.Router();
var MessagingResponse = require('twilio').twiml.MessagingResponse;

/* POST create reservations */
router.post('/', function(req, res, next) {
  var twiml = new MessagingResponse();

  // The content of the text message sent to twilio.
  console.log(req.body.Body)

  //  The message we send back after we make a reservation (successfully or
  //  otherwise).
  twiml.message("We'll have your reservations details very soon!");

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

module.exports = router;
