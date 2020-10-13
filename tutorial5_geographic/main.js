/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 60, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let g;
let projection;
/**
 * APPLICATION STAT
 *
 * */

let color;


 
let state = {
  geojson: null,
  heatData: null,
  hover: {
    latitude: null, 
    longitude: null,
  }
};


/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/usHeatExtremes.csv ", d3.autoType),
]).then(([geojson, heatData]) => {
  // + SET STATE WITH DATA
  state.geojson = geojson
  state.heatData = heatData
  console.log("state.geojson: ", state.geojson);
  console.log("state.heatData: ", state.heatData);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // create an svg element in our main `d3-container` element


  // color = d3.scaleLinear()
  // .domain(d3.extent(state.data, d => d.ChangesIn95Days))
  // .range(["#F8766D","#80F4CF"])



  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  projection = d3.geoAlbersUsa()
  .fitSize([width, height], state.geojson)

  geoPathFunc = d3.geoPath(projection)

  // + SET UP GEOPATH
unitedStates = svg.selectAll('path.borders')
   .data(state.geojson.features)
   .join('path')
   .attr('class', 'borders')
   .attr("d", d => geoPathFunc(d))
   .style('fill', 'pink')
   .style('stroke', '#000')
   .style('opacity', '0.8');
  // + DRAW BASE MAP PATH


  
  dots = svg.selectAll("circle")
  .data(state.heatData)
  .join("circle")
  .attr("r", 2)
  .attr("fill", (
  .attr('cx', d => projection([+d.Long, +d.Lat])[0])
  .attr('cy', d => projection([+d.Long, +d.Lat])[1])

  // + ADD EVENT LISTENERS (if you want)

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {}
