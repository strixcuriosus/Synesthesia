var server = io.connect('/d3');

$(document).ready(function() {

  server.on('welcome', function(data) {
    console.log("welcomed", data);
  });

  // server.on('motionData', function(data) {
  //   initialize(data);
  // });

  server.on('audio', function(data) {
    initialize(data);
    console.log(data);
  });

});
