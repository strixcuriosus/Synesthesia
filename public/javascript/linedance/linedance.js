var server = io.connect('/linedance');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });


var width = Math.max(960, innerWidth), //640
    height = Math.max(500, innerHeight); //480

var lineHeight = 10;

var throttledUpdate = _.throttle(function(optiFlowData) {

        var lines = svg.selectAll('line').data(optiFlowData.zones, function(d,i){return (d.x + "x" + d.y);});

        lines.style("stroke-opacity", 1)
          .transition()
          .duration(1500)
          .attr("x1", function(d) {return d.x * width / 640;})
          .attr("y1", function(d) {return d.y * height / 480;})
          .attr("x2", function(d) {return d.u*(d.x * width / 640);})
          .attr("y2", function(d) {return d.v*(d.y * height / 480);})
          .transition()
          .duration(1500)
          .attr("x2", function(d) {return (d.x * width / 640);})
          .attr("y2", function(d) {return (d.y * height / 480);})

        lines.enter()
          .append('line')
          .attr("x1", function(d) {return d.x * width / 640;})
          .attr("y1", function(d) {return d.y * height / 480;})
          .attr("x2", function(d) {return d.x * width / 640;})
          .attr("y2", function(d) {return (d.y * height / 480);})
          .style("stroke", "green"); //d3.hsl((i = (i + 1) % 360), 1, .5)
          // .style("stroke-opacity", 1)
          // .transition()
          // .duration(1500)
          // .attr("r", function(d) { return (3 * (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))));})
          // .style("stroke", "green") //d3.hsl((i = (i + 1) % 360), 1, .5)
          // .style("stroke-opacity", 0)
          // .remove();



        // lines.exit()
        //  .transition()
        //  .duration(700)
        //  .remove();
      // }
}, 200);


server.on('optiFlowData', function(data){
  console.log(data.zones.length);
  throttledUpdate(data);
});

// var init = [];
// init.length = 1036;

// var i = 0;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
 
// };
