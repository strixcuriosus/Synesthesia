exports.renderClient = function(req, res){
  res.render('client');
};

exports.renderConductor = function(req, res){
  res.render('conductor');
};

exports.renderFireworks = function(req, res){
  res.render('fireworks');
};

exports.renderD3 = function(req, res){
  res.render('d3');
};

exports.renderAudio = function(req, res){
  res.render('audio');
};

exports.renderDancer = function(req, res){
  res.render('dancer');
};

exports.renderUpdate = function(req, res){
  res.render('update');
};

exports.render404 = function(req, res){
  res.writeHead(404);
  res.end("That page doesn't exist. Go to a page that exists.");
};