ConductorSpace.Router = Backbone.Router.extend({

  initialize: function(options) {
    this.$el = options.el;
    this.model = options.model;
  },

  routes: {
    "": "main",
    "2": "main2"
  },

  swapView: function(view) {
    this.$el.html( view.render().el);
  },

  main: function() {
    console.log("main route");
    var mainView = new ConductorSpace.MainView({ model: this.model });
    this.swapView(mainView);
  },

  main2: function() {
    console.log("flocking route");
    var mainView = new ConductorSpace.MainView({ model: this.model });
    this.swapView(mainView);
  }

});