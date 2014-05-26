function custom(selection) {
  selection.each(function() {
    var root = this,
        canvas = root.parentNode.appendChild(document.createElement("canvas")),
        context = canvas.getContext("2d");

    canvas.style.position = "absolute";
    canvas.style.top = root.offsetTop + "px";
    canvas.style.left = root.offsetLeft + "px";

    // It'd be nice to use DOM Mutation Events here instead.
    // However, they appear to arrive irregularly, causing choppy animation.
    d3.timer(redraw);

    // Clear the canvas and then iterate over child elements.
    function redraw() {
      canvas.width = root.getAttribute("width");
      canvas.height = root.getAttribute("height");
      for (var child = root.firstChild; child; child = child.nextSibling) draw(child);
    }

    // For now we only support circles with strokeStyle.
    // But you should imagine extending this to arbitrary shapes and groups!
    function draw(element) {
      switch (element.tagName) {
        case "circle": {
          context.strokeStyle = element.getAttribute("strokeStyle");
          context.beginPath();
          context.arc(element.getAttribute("x"), element.getAttribute("y"), element.getAttribute("radius"), 0, 2 * Math.PI);
          context.stroke();
          break;
        }
      }
    }
  });
};