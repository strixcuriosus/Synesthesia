var width = window.innerWidth,
    height = window.innerHeight,
    τ = 2 * Math.PI,
    nodes;

window.onresize = function (){ 
  width = window.innerWidth;
  height = window.innerHeight; 
  initialize();
}

var initialize = function(num) {
  nodes = d3.range(num).map(function() {
    return {
      x: Math.random() * width,
      y: Math.random() * height
    };
  });
};

initialize(400);

var voronoi = d3.geom.voronoi()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

var links = voronoi.links(nodes);

var force = d3.layout.force()
    .size([width, height])
    .charge(-202)
    .gravity(.5)
    .nodes(nodes)
    .on("tick", ticked)
    .start();

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);

var context = canvas.node().getContext("2d");

function ticked() {
  context.clearRect(0, 0, width, height);

  context.beginPath();
  links.forEach(function(d) {
    // context.moveTo(d.source.x, d.source.y);
    // context.lineTo(d.target.x, d.target.y);
  });
  context.lineWidth = 1;
  context.strokeStyle = "#bbb";
  context.stroke();

  context.beginPath();
  nodes.forEach(function(d) {
    context.moveTo(d.x, d.y);
    context.arc(d.x, d.y, 2, 0, τ);
  });
  context.lineWidth = 3;
  context.strokeStyle = "#fff";
  context.stroke();
  context.fillStyle = "#000";
  context.fill();
}

function clicked(d) {
  d3.transition()
      .duration(750)
      .tween("points", function() {
        var i = d3.interpolate(targetPoints, d);
        return function(t) {
          handle.data(targetPoints = i(t)).attr("transform", function(d) { return "translate(" + d + ")"; });
          transformed();
        };
      });
}

function dragged(d) {
  d3.select(this).attr("transform", "translate(" + (d[0] = d3.event.x) + "," + (d[1] = d3.event.y) + ")");
  transformed();
}

function transformed() {
  for (var a = [], b = [], i = 0, n = sourcePoints.length; i < n; ++i) {
    var s = sourcePoints[i], t = targetPoints[i];
    a.push([s[0], s[1], 1, 0, 0, 0, -s[0] * t[0], -s[1] * t[0]]), b.push(t[0]);
    a.push([0, 0, 0, s[0], s[1], 1, -s[0] * t[1], -s[1] * t[1]]), b.push(t[1]);
  }

  var X = solve(a, b, true), matrix = [
    X[0], X[3], 0, X[6],
    X[1], X[4], 0, X[7],
       0,    0, 1,    0,
    X[2], X[5], 0,    1
  ].map(function(x) {
    return d3.round(x, 6);
  });

  line.attr("d", function(d) {
    return "M" + project(matrix, d[0]) + "L" + project(matrix, d[1]);
  });
}

// Given a 4x4 perspective transformation matrix, and a 2D point (a 2x1 vector),
// applies the transformation matrix by converting the point to homogeneous
// coordinates at z=0, post-multiplying, and then applying a perspective divide.
function project(matrix, point) {
  point = multiply(matrix, [point[0], point[1], 0, 1]);
  return [point[0] / point[3], point[1] / point[3]];
}

// Post-multiply a 4x4 matrix in column-major order by a 4x1 column vector:
// [ m0 m4 m8  m12 ]   [ v0 ]   [ x ]
// [ m1 m5 m9  m13 ] * [ v1 ] = [ y ]
// [ m2 m6 m10 m14 ]   [ v2 ]   [ z ]
// [ m3 m7 m11 m15 ]   [ v3 ]   [ w ]
function multiply(matrix, vector) {
  return [
    matrix[0] * vector[0] + matrix[4] * vector[1] + matrix[8 ] * vector[2] + matrix[12] * vector[3],
    matrix[1] * vector[0] + matrix[5] * vector[1] + matrix[9 ] * vector[2] + matrix[13] * vector[3],
    matrix[2] * vector[0] + matrix[6] * vector[1] + matrix[10] * vector[2] + matrix[14] * vector[3],
    matrix[3] * vector[0] + matrix[7] * vector[1] + matrix[11] * vector[2] + matrix[15] * vector[3]
  ];
}
