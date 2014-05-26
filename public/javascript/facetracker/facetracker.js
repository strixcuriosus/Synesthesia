var server = io.connect('/facetracker');
var tracker = new clm.tracker();
var videoInput = 
tracker.init(pModel);
tracker.start(videoInput);
var $h1 = $('h1');

server.on('welcome', function(data) {
  if (data.tracking) {
    startTrack();
  } else {
    $h1.text('Connected. Motion tracking off.');
  }
});

var sendData = function(optiFlowData) {
  server.emit('optiFlowData', optiFlowData);
  if (!printed) {
    console.log(optiFlowData.zones.length);  
    printed = true;
    
  }
}


// server.on('reset', function() {
//   stopTrack();
// });

// server.on('toggleTracking', function(data) {
//   if (data.motion) {
//     startTrack();
//   } else {
//     stopTrack();
//   }
// });

// var startTrack = function() {
//   $h1.text('Now tracking face.');
//   initMotionListener();
// };

// var stopTrack = function() {
//   $h1.text('Face tracking off.');
//   removeMotionListener();
// };

