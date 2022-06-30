//scatterplot.js
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
let width = 800 - margin.left - margin.right;
let height = 560 - margin.bottom - margin.top;
var ds;
var xmin, xmax, ymin, ymax;

var svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.bottom + margin.top)
  .append("g")
  //.attr("transform", "translate(")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the tooltip
var tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
d3.json(url).then(function (data) {
  ds = data;
  //console.log(ds);

  xmin = d3.min(ds, (d) => d.Year);
  xmax = d3.max(ds, (d) => d.Year);
  ymin = d3.min(ds, (d) => d.Seconds);
  ymax = d3.max(ds, (d) => d.Seconds);

  var xScale = d3
    .scaleLinear()
    .domain([xmin - 1, xmax])
    .range([margin.left, width - margin.right]);

  var yScale = d3
    .scaleTime()
    .domain([
      d3.min(ds, (d) => new Date(d.Seconds * 1000)),
      d3.max(ds, (d) => new Date(d.Seconds * 1000)),
    ])
    //.domain([d3.min(ds, (d)=>d[1]),d3.max(ds, (d )=> d[1])])
    .range([margin.top, height - margin.bottom]);

  svg
    .selectAll("circle")
    .data(ds)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))

    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
    .attr("r", 7)
    .attr("fill", (d) => {
      if (d.Doping) return "#4B92C2";
      else return "#FF7F0E";
    })
    .on("mouseover", (event, d) => {
      //console.log(d)

      tooltip
        .transition()

        .attr("data-year", d["Year"]);

      tooltip
        .html(d["Year"] + "<br/>" + d["Name"])
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px")
        .style("opacity", 0.9);
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("opacity", 0);
    });

  var x_axis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("id", "x-axis")
    .call(x_axis);

  var y_axis = d3.axisLeft().scale(yScale).tickFormat(d3.timeFormat("%M:%S"));
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("id", "y-axis")
    .call(y_axis);
});
