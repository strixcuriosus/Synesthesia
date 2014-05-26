// Referenced from http://sendoushi.com/blog/web-audio-api-soundjs-d3/

var beenInitialized = false;
var audiodata;
var beenInitialized = false;
var w = 1200;
var h = 900;
var svg;

var initialize = function(audiodata){
  // console.log(audiodata.hz, audiodata.volume);
  // Width and height
  // data = [4,7,2,4,8,6,34,9,12];
  // var freqArray = [];
  // var w = 1200;
  // var h = 900;
  // var barPadding = 2;


};

var updateSvg = function(data){
  audiodata = d3.entries(data);
  
  // console.log(audiodata.length);
  console.log(JSON.stringify(audiodata));

  var binCount = audiodata.length;
  var barWidth = w/binCount;


  if (!beenInitialized){
  d3.select('body #analyzerChart')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .selectAll('rect')
       .data(audiodata) //, function(d) {return d;})
       .enter()
       .append('rect')
       .attr('x', function(d) {return d.key*barWidth;})
       .attr('y',  h/2)
       .attr('width', w/binCount) // data.length - barPadding)
       .attr('height', function(d) {return d.value;})
       .attr('fill', function(d){return "hsl(" + (d.key/binCount*360) + ", 100%, 50%";})
     .transition()
       .duration(2000);
       console.log("Initialized");

    beenInitialized = true;

  }

  svg = d3.select('body #analyzerChart svg');

  svg.selectAll('rect')
     .data(audiodata) //, function(d) {return d;});
   // .transition()
   //   .duration(2000)
     .attr('x', function(d) {return d.key*barWidth;})
     .attr('y',  h/2)
     .attr('width', barWidth) // data.length - barPadding)
     .attr('height', function(d) {return d.value;})
     .attr('fill', function(d){return "hsl(" + (d.key/binCount*360) + ", 100%, 50%";});

  console.log("Updated");

  // svg.selectAll('rect')
  //    // .data(audiodata)
  //    .exit()
  //    .remove();
};