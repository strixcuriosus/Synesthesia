var server = io.connect('/optiflow');
var flow = new oflow.WebCamFlow();
var printed = false;
var $h1 = $('h1')

var sendData = function(optiFlowData) {
  server.emit('optiFlowData', optiFlowData);
  if (!printed) {
    console.log(optiFlowData.zones.length);  
    printed = true;
    
  }
}

server.on('welcome', function(data) {
  if (data.tracking) {
    $h1.text(data.message);
    flow.startCapture();
  } else {
    $h1.text('Connected. Optical flow tracking off.');
  }
});

server.on('reset', function() {
  flow.stopCapture();
});

flow.onCalculated(sendData);
