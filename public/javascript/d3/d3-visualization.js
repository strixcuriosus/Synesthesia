// Referenced from http://sendoushi.com/blog/web-audio-api-soundjs-d3/

var FFTSIZE = 64;      // number of samples for the analyser node FFT, min 32
var TICK_FREQ = 50;     // how often to run the tick function, in milliseconds

var context;
var src;           // the audio src we are trying to play
var displayStatus; // the HTML element we use to display messages to the user

var soundInstance;      // the sound instance we create
var analyserNode;       // the analyser node that allows us to visualize the audio
var freqFloatData, freqByteData, timeByteData;  // arrays to retrieve data from 

var stopTick = false;
var dataset;

// window.addEventListener('load', init, false);
function init() {
    if (window.top != window) {
        document.getElementById("header").style.display = "none";
    }
    /*
    // this does two things, it initializes the default plugins, and if that fails the if statement triggers and we display an error
    if (!createjs.Sound.initializeDefaultPlugins()) {
        document.getElementById("error").style.display = "block";
        document.getElementById("content").style.display = "none";
        return;
    }

    // check if we are on a mobile device, as these currently require us to launch sound inside of a user event
    if (createjs.Sound.BrowserDetect.isIOS || createjs.Sound.BrowserDetect.isAndroid) {  // || createjs.Sound.BrowserDetect.isBlackberry  OJR blackberry has not been tested yet
        document.getElementById("mobile").style.display = "block";
        document.getElementById("content").style.display = "none";
        return;
    }*/

    // store the DOM element so we do not have to keep looking it up
    displayStatus = document.getElementById("status");

    // Create a single item to load.
    var assetsPath = "audio/";
    src = assetsPath+"audio.mp3";
    //src = assetsPath+"05-Binrpilot-Underground.mp3";
    // NOTE the "|" character is used by Sound to separate source into distinct files, which allows you to provide multiple extensions for wider browser support

    //createjs.Sound.onLoadComplete = playSound;  // add a callback for when load is completed
    createjs.Sound.addEventListener("loadComplete", createjs.proxy(handleLoad,this)); // add an event listener for when load is completed
    createjs.Sound.registerSound(src);  // register sound, which preloads by default

    displayStatus.innerText = "Waiting for load to complete.";  // letting the user know what's happening
}

function handleLoad(evt) {
    displayStatus.innerText = "Loaded";

    // get the context.  NOTE to connect to existing nodes we need to work in the same context.
    var context = createjs.WebAudioPlugin.context;

    // create an analyser node
    analyserNode = context.createAnalyser();
    analyserNode.fftSize = FFTSIZE;  //The size of the FFT used for frequency-domain analysis. This must be a power of two
    analyserNode.smoothingTimeConstant = 0.85;  //A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame
    analyserNode.connect(context.destination);  // connect to the context.destination, which outputs the audio

    // attach visualizer node to our existing dynamicsCompressorNode, which was connected to context.destination
    var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
    dynamicsNode.disconnect();  // disconnect from destination
    dynamicsNode.connect(analyserNode);

    // set up the arrays that we use to retrieve the analyserNode data
    freqFloatData = new Float32Array(analyserNode.frequencyBinCount);
    freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
    timeByteData = new Uint8Array(analyserNode.frequencyBinCount);

    d3.select("div#float").selectAll("div")
    .data(freqFloatData)
    .enter().append("div")
    .attr("class", "bar")
    .style("height", function(d) { 
      var v = Math.round(d);
      if(v < 0) {
        v = v * -1;
      }
      return v + "px";
    });

    d3.select("div#byte").selectAll("div")
    .data(freqByteData)
    .enter().append("div")
    .attr("class", "bar")
    .style("height", function(d) { 
      var v = Math.round(d);
      if(v < 0) {
        v = v * -1;
      }
      return v + "px";
    });

    d3.select("div#time").selectAll("div")
    .data(timeByteData)
    .enter().append("div")
    .attr("class", "bar")
    .style("height", function(d) { 
      var v = Math.round(d);
      if(v < 0) {
        v = v * -1;
      }
      return v + "px";
    });

    startPlayback();
}

function startPlayback() {
    if(soundInstance) {return;} // if this is defined, we've already started playing.  This is very unlikely to happen.

    displayStatus.innerText = "startPlayback";

    // start playing the sound we just loaded, looping indefinitely
    soundInstance = createjs.Sound.play(src, null, null, 0, -1);

    createjs.Ticker.addEventListener("tick", enterFrame);
    createjs.Ticker.setInterval(TICK_FREQ);
}

function enterFrame(evt) {
  if(!stopTick) {
    analyserNode.getFloatFrequencyData(freqFloatData);  // this gives us the dBs
    analyserNode.getByteFrequencyData(freqByteData);  // this gives us the frequency
    analyserNode.getByteTimeDomainData(timeByteData);  // this gives us the waveform

    changeBars(freqFloatData, freqByteData, timeByteData);
  }
}

function changeBars(data, data2, data3) {
  d3.select("div#float").selectAll("div")
  .data(data)
  .transition()
  .duration(10)
  .style("height", function(d) { 
    var v = Math.round(d);
    if(v < 0) {
      v = v * -1;
    }
    return v + "px"; 
  });

  d3.select("div#byte").selectAll("div")
  .data(data2)
  .transition()
  .duration(10)
  .style("height", function(d) { 
    var v = Math.round(d);
    if(v < 0) {
      v = v * -1;
    }
    return v + "px"; 
  });

  d3.select("div#time").selectAll("div")
  .data(data3)
  .transition()
  .duration(10)
  .style("height", function(d) { 
    var v = Math.round(d);
    if(v < 0) {
      v = v * -1;
    }
    return v + "px"; 
  });
}

function flagTick() {
  if(stopTick) {
    stopTick = false;
  } else {
    stopTick = true;
    createjs.Sound.stop();
  }
}


var initialize = function(audiodata){
  // console.log(audiodata.hz, audiodata.volume);
  // Width and height
  // data = [4,7,2,4,8,6,34,9,12];
  var freqArray = [];
  var w = 1200;
  var h = 900;
  var barPadding = 2;

  var svg = d3.select('body #analyzerChart')
              .append('svg')
              .attr('width', w)
              .attr('height', h);

};

var updateSvg = function(audiodata){
  audiodata = d3.entries(audiodata);
   console.log(audiodata);
  // audiodata = [{hz:130, volume: -15},{hz: 83, volume: -19}];
  // Width and height
  var w = 1200;
  var h = 900;
  var barPadding = 2;
  var binCount = audiodata.length;

  var svg = d3.select('body #analyzerChart svg')

  svg.selectAll('rect')
     .attr('x', function(d) {return d.key;})
     .attr('y',  h/2)
     .attr('width', w/binCount) // data.length - barPadding)
     .attr('height', function(d) {return d.value;})
     .attr('fill', function(d){return "hsl(" + (d.key/binCount*360) + ", 100%, 50%";})
   .transition()
     .duration(300);

  svg.selectAll('rect')
     .data(audiodata)
     .enter()
     .append('rect')
     .attr('x', function(d) {return d.key;})
     .attr('y',  h/2)
     .attr('width', w/binCount) // data.length - barPadding)
     .attr('height', function(d) {return d.value;})
     .attr('fill', function(d){return "hsl(" + (d.key/binCount*360) + ", 100%, 50%";})
   .transition()
     .duration(300);
     

 
};