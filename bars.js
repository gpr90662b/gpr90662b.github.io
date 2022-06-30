//DS 3 code
let w = 1200;
let h = 580;
var ds;

const margin = { top: 50, right: 50, bottom: 50, left: 50 };

function d2fy(dString) {
  // convert yyyy-mm-dd string to fractional year
  // ignore dd as it is 0
  let ymd = dString.split("-");
  return parseInt(ymd[0]) + (parseInt(ymd[1]) - 1) / 12.0;
}

var svg = d3
  .select("#container")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// Define the div for the tooltip
var tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(url).then(({ data }) => {
  //console.log(data);
  ds = data;
  drawbars();
});

function drawbars() {
  var xScale = d3
    .scaleLinear()
    .domain([d3.min(ds, (d) => d2fy(d[0])), d3.max(ds, (d) => d2fy(d[0]))])
    .range([margin.left, w - margin.right]);

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(ds, (d) => d[1])])
    //.domain([d3.min(ds, (d)=>d[1]),d3.max(ds, (d )=> d[1])])
    .range([h - margin.bottom, margin.top]);

  svg
    .selectAll("rect")
    .data(ds)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d) => {
      return xScale(d2fy(d[0]));
    })
    .attr("y", (d) => yScale(d[1]))
    .attr("width", w / ds.length)
    .attr("height", (d) => h - margin.bottom - yScale(d[1]))
    .attr("fill", "#ceceff")
    .on("mouseover", (event, d) => {
      //console.log(d)
      //.attr("fill", "#ffffff")
      tooltip.attr("data-date", d[0]);
      tooltip.transition();
      tooltip
        .html(d[0] + "<br/>" + "$" + d[1] + "billion")
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px")
        .style("opacity", 0.9);
    })
    .on("mouseout", (d) => {
      //.attr("fill", "#ceceff")
      tooltip.transition().style("opacity", 0);
    });

  //x-axis
  var x_axis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
  svg
    .append("g")
    .attr("transform", `translate(0,${h - margin.bottom})`)
    .attr("id", "x-axis")
    .call(x_axis);

  // y-axis
  var y_axis = d3.axisLeft().scale(yScale);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("id", "y-axis")
    .call(y_axis);
}
