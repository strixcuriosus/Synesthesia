var server = io.connect('/grid');

$(document).ready(function() {

  server.on('welcome', function(data) {
    console.log("grid visualizer welcomed", data);
  });

  server.on('motionData', function(data) {
    initialize(data);
  });

});
