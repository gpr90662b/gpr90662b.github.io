// set the dimensions and margins of the graph
var margin = { top: 60, right: 60, bottom: 60, left: 60 },
  width = 1560 - margin.left - margin.right,
  height = 660 - margin.top - margin.bottom;

var ds;
var baseTemperature;

//legend color and labels
var colors = [
  "#4575B4",
  "#74ADD1",
  "#ABD9E9",
  "#E0F3F8",
  "#FFFFBF",
  "#FEE090",
  "#FDAE61",
  "#F46D43",
  "#D73027",
];
var labels = [
  "2.8",
  "3.9",
  "5.0",
  "6.1",
  "7.2",
  "8.3",
  "9.4",
  "10.5",
  ">=11.6",
];

// X and y axis labels
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var years = Array.from({ length: 2015 - 1753 + 1 }, (v, k) => k + 1753);
var xticks = Array.from({ length: 26 }, (v, k) => k * 10 + 1759);
//console.log(xticks);

// main map section
var svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//legend section
var legendSvg = d3
  .select("#legend-container")
  .append("svg")
  .attr("id", "legend")
  .attr("width", 1660)
  .attr("height", 75);

legendSvg
  .selectAll("rect")
  .data(colors)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 50 + 600)
  .attr("y", 25)
  .attr("width", 35)
  .attr("height", 25)
  .attr("fill", (d) => d);

var texts = legendSvg
  .selectAll("text")
  .data(labels)
  .enter()
  .append("text")
  .attr("class", "labels");

texts
  .attr("x", (d, i) => i * 50 + 600)
  .attr("y", 60)
  .text((d, i) => labels[i]);

var tooltip = d3.select("#tooltip");

// Build X scales and axis:
var xScale = d3.scaleLinear().range([0, width]).domain([1753, 2015]);
//.padding(0.0);

//x-axis
var x_axis = d3
  .axisBottom()
  .scale(xScale)
  .tickValues(xticks)
  .tickFormat(d3.format("d"));

svg
  .append("g")
  .attr("transform", "translate(0, " + height + ")")
  .attr("id", "x-axis")
  .call(x_axis);

// Build y scales and axis:
var yScale = d3.scaleBand().range([0, height]).domain(months).padding(0.0);

// y-axis
var y_axis = d3.axisLeft().scale(yScale);
svg.append("g").attr("id", "y-axis").call(y_axis);

// Build color scale
function getColor(temp) {
  if (temp >= 2.8 && temp < 3.9) color = "#4575B4";
  if (temp >= 3.9 && temp < 5.0) color = "#74ADD1";
  if (temp >= 5.0 && temp < 6.1) color = "#ABD9E9";
  if (temp >= 6.1 && temp < 7.2) color = "#E0F3F8";
  if (temp >= 7.2 && temp < 8.3) color = "#FFFFBF";
  if (temp >= 8.3 && temp < 9.4) color = "#FEE090";
  if (temp >= 9.4 && temp < 10.5) color = "#FDAE61";
  if (temp >= 10.5 && temp < 11.6) color = "#F46D43";
  if (temp >= 11.6 && temp <= 12.8) color = "#D73027";
  return color;
}

//Read the data
let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url).then(function (data) {
  baseTemperature = data.baseTemperature;
  ds = data.monthlyVariance;

  //draw heatmap()
  heatmap();
});

function heatmap() {
  //main function to draw the map
  svg
    .selectAll("rect")
    .data(ds)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-year", (d) => d.year)
    .attr("data-month", (d) => d.month - 1)
    .attr("data-temp", (d) => baseTemperature + d.variance)
    .attr("data-value", (d) => d.variance)

    //fix code for rectangles and also y-axis
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(months[d.month - 1]))
    .attr("width", width / (2015 - 1753))
    .attr("height", yScale.bandwidth())
    .attr("stroke-width", 0)
    .attr("fill", (d) => getColor(baseTemperature + d.variance))
    .on("mouseover", (event, d) => {
      let ttext = d.year;
      //console.log(event,ttext)
      tooltip.text(ttext);
      tooltip
        .transition()
        .attr("data-year", ttext)
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY - 20 + "px")
        .style("visibility", "visible");
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("visibility", "hidden");
    });
}
