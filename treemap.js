// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 30, left: 30 },
  width = 1000;
height = 600;

//color for tiles
var colors = [
  "#4C92C3",
  "#A985CA",
  "#FF993E",
  "#D1C0DD",
  "#E2E2A4",
  "#BED2ED",
  "#56B356",
];
//movies categories
var cats = [
  "Action",
  "Drama",
  "Adventure",
  "Family",
  "Animation",
  "Comedy",
  "Biography",
];

// function, nput: category, output: color
function getColor(cat) {
  let index = cats.findIndex((d) => d == cat);
  return colors[index];
}

var movieData;
var movieURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

// append the svg object to the div with id of canvas
//console.log("creating drawing area")
var svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// create legend area and legends
var legendSvg = d3
  .select("#legend-container")
  .append("svg")
  .attr("id", "legend")
  .attr("width", width)
  .attr("height", 75);

var texts = legendSvg
  .selectAll("text")
  .data(cats)
  .enter()
  .append("text")
  .attr("class", "cats");

//legend text
texts
  .attr("x", (d, i) => i * 50 + 450)
  .attr("y", 60)
  .text((d, i) => cats[i]);

// colored rectangles for legend
legendSvg
  .selectAll("rect")
  .data(colors)
  .enter()
  .append("rect")
  .attr("class", "legend-item")
  .attr("x", (d, i) => i * 50 + 450)
  .attr("y", 25)
  .attr("width", 40)
  .attr("height", 25)
  .attr("fill", (d) => d);

//select tooltip, to be used to display info on mouseover
var tooltip = d3.select("#tooltip");

// The main function which draws the map
function draw_map() {
  //create d3 hierarchy
  var root = d3
    .hierarchy(movieData, (d) => {
      return d["children"];
    })
    .sum((node) => {
      return node.value;
    })
    .sort(function (a, b) {
      return b.value - a.value;
    });

  //console.log(root);
  //apply rectangular partiitions to generate co-ordinates
  //by using d3.treemap() method
  var treemap = d3.treemap().size([width, height]).padding(2);
  //apply rectangular partiitions to generate co-ordinates
  treemap(root);
  let movieTiles = root.leaves();
  //console.log(movieTiles);

  // create group for each tile
  let Blocks = svg
    .selectAll("g")
    .data(movieTiles)
    .enter()
    .append("g")
    .attr("transform", (movie) => {
      return "translate(" + movie["x0"] + ", " + movie["y0"] + ")";
    });

  // use this information to add rectangles:
  Blocks.append("rect")
    .attr("fill", (d) => getColor(d["data"]["category"]))
    .attr("class", "tile")
    .attr("data-name", (d) => d["data"]["name"])
    .attr("data-category", (d) => d["data"]["category"])
    .attr("data-value", (d) => d["data"]["value"])
    //x,y already set at group level
    //.attr('x', function (d) { return d.x0; })
    //.attr('y', function (d) { return d.y0; })
    .attr("width", (d) => d["x1"] - d["x0"])
    .attr("height", (d) => d["y1"] - d["y0"])
    //.style("stroke", "black")
    .on("mouseover", (event, d) => {
      let ttext = d["data"]["name"] + ": $" + d["data"]["value"];
      //console.log(event, ttext)
      tooltip.text(ttext);
      tooltip
        .transition()
        .style("visibility", "visible")
        .attr("data-value", d["data"]["value"])
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY - 20 + "px");
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("visibility", "hidden");
    });
  // and to add the text labels
  Blocks.append("text")
    .text((d) => d["data"]["name"])
    .attr("x", 5) // +10 to adjust position (more right)
    .attr("y", 20) // +20 to adjust position (lower)
    //.attr("font-size", "15px")
    .attr("fill", "white");
}

// Get Data
console.log("fetching data");
d3.json(movieURL).then((data) => {
  movieData = data;
  console.log(movieData);
  console.log("calling drawmap");
  draw_map();
});
