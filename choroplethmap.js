// set the dimensions and margins of the graph
var margin = { top: 5, right: 30, bottom: 5, left: 30 },
  width = 1035 - margin.left - margin.right,
  height = 610 - margin.top - margin.bottom;

var colors = [
  "#E6ADCF",
  "#C0A1CA",
  "#9A95C5",
  "#7489C0",
  "#4E7DBB",
  "#2871B6",
  "#0064B2",
  "#004492",
];
var labels = ["<=15%", "20%", "25%", "30%", "35%", "40%", "45%", ">=45%"];
let countyData;
let eduData;

var legSvg = d3
  .select("#legend-container")
  .append("svg")
  .attr("id", "legend")
  .attr("width", 1035)
  .attr("height", 75);

legSvg
  .selectAll("rect")
  .data(colors)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 50 + 300)
  .attr("y", 25)
  .attr("width", 35)
  .attr("height", 25)
  .attr("fill", (d) => d);

var texts = legSvg
  .selectAll("text")
  .data(labels)
  .enter()
  .append("text")
  .attr("class", "labels");

texts
  .attr("x", (d, i) => i * 50 + 300)
  .attr("y", 60)
  .text((d, i) => labels[i]);

var tooltip = d3.select("#tooltip");

var countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
var eduURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

// append the svg object to the body of the page
var canvas = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function drawMap() {
  //draw the counties map
  canvas
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (d) => getColor(d["id"]))
    .attr("data-fips", (countyDataItem) => getFips(countyDataItem["id"]))
    .attr("data-education", (countyDataItem) =>
      getEducation(countyDataItem["id"])
    )
    .attr("transform", "translate(0, 0)")
    .on("mouseover", (event, d) => {
      //console.log(countyDataItem)
      let ctt = getEduCounty(d["id"]);
      //console.log(ctt)
      let ttext =
        ctt["area_name"] +
        ", " +
        ctt["state"] +
        ": " +
        ctt["bachelorsOrHigher"] +
        "%";
      tooltip.text(ttext).attr("data-education", ctt["bachelorsOrHigher"]);
      //console.log(event.clientX)
      tooltip
        .transition()
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY + "px")
        .style("visibility", "visible");
    })
    .on("mouseout", (countyDataItem) => {
      tooltip.transition().style("visibility", "hidden");
    });
}

function getEduCounty(cid) {
  //given the id, return the educational county object
  let ctt = eduData.find((item) => {
    return item["fips"] == cid;
  });
  return ctt;
}

function getFips(cid) {
  // return fips given the id
  let ctt = getEduCounty(cid);
  return ctt["fips"];
}

//find the education level of the country given the fips id
function getEducation(cid) {
  let ctt = getEduCounty(cid);
  return ctt["bachelorsOrHigher"];
}

//find the color code for a country with id=cid
//by its educstion level
function getColor(cid) {
  //first find education level and based on it, the color
  let edval = getEducation(cid);
  let color;
  if (edval <= 15.0) color = colors[0];
  if (edval > 15 && edval <= 20) color = colors[1];
  if (edval > 20 && edval <= 25) color = colors[2];
  if (edval > 25 && edval <= 30) color = colors[3];
  if (edval > 30 && edval <= 35) color = colors[4];
  if (edval > 35 && edval <= 40) color = colors[5];
  if (edval > 40 && edval <= 45) color = colors[6];
  if (edval > 45.0) color = colors[7];

  return color;
}

//Read the data
let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(countyURL).then(function (data, error) {
  if (error) {
    console.log(error);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;
    //console.log(countyData);
    d3.json(eduURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        eduData = data;
        //console.log(eduData);
        drawMap();
      }
    });
  }
});
