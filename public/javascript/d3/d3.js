var server = io.connect('/d3');

$(document).ready(function() {

  server.on('welcome', function(data) {
    initialize(data);
    console.log("welcomed", data);
  });

  server.on('motionData', function(data) {
    // initialize(data);
    console.log(data);
  });

  server.on('audio', function(data) {
    updateSvg(data);
    // console.log(data);
  });

});
