// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 30, left: 30 },
  width = 1120 - margin.left - margin.right,
  height = 560 - margin.top - margin.bottom;

var ds;
var baseTemperature;

// append the svg object to the body of the page
var svg = d3
  .select("#container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var years = [1753, 2015];
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
var years = Array.from({ length: 2015 - 1753 + 1 }, (v, k) => k + 1753);

// Build X scales and axis:
var xScale = d3.scaleLinear().range([0, width]).domain([1753, 2015]);
//.padding(0.0);

var x_axis = d3.axisBottom().scale(xScale).ticks(10);
svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(x_axis);

// Build X scales and axis:
var yScale = d3.scaleBand().range([0, height]).domain(months).padding(0.0);

var y_axis = d3.axisLeft().scale(yScale);
svg.append("g").call(y_axis);

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

  /*
  svg.selectAll()
      .data(data, function(d) {return d.group+':'+d.variable;})
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} 
*/

  svg
    .selectAll("rect")
    .data(ds)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-year", (d) => d.year)
    .attr("data-month", (d) => months[d.month - 1])
    .attr("data-temperature", (d) => baseTemperature + d.variance)
    .attr("data-value", (d) => d.variance)

    //fix code for rectangles and also y-axis
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(months[d.month - 1]))
    .attr("width", width / (2015 - 1753))
    .attr("height", yScale.bandwidth())
    .attr("stroke-width", 0)
    .attr("fill", (d) => getColor(baseTemperature + d.variance));
});
