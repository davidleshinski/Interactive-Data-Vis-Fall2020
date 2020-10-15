/**
 * CONSTANTS AND GLOBALS
 * */

const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.6,
  margin = { top: 50, bottom: 30, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let g;
let projection;
let color;
const radius = 5;

 
let state = {
  geojson: null,
  heatData: null,
  hover: {
    Latitude: null, 
    Longitude: null,
    State: null,
  }
};


/**
 --------------------------- LOAD DATA ------------------------------
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

  // --------------------------- color scale ----------------------------

  color = d3.scaleLinear()
  .domain(d3.extent(state.heatData, d => d.ChangesIn95Days))
  .range(["#4fd5d6", "#ff0000"]);

  // --------------------------- svg creation ----------------------------

  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// --------------------------- geo function ----------------------------

  projection = d3.geoAlbersUsa()
  .fitSize([width, height], state.geojson)

  geoPathFunc = d3.geoPath(projection)

// --------------------------- path ----------------------------
  // + SET UP GEOPATH
unitedStates = svg.selectAll('path.borders')
   .data(state.geojson.features)
   .join('path')
   .attr('class', 'borders')
   .attr("d", d => geoPathFunc(d))
   .style('fill', 'none')
   .style('stroke', 'grey')
  // + DRAW BASE MAP PATH
    // .on("mousemove", d => {
    //   state.hover["State"] = d.properties.NAME;}
    //   )

    // --------------------------- svg tooltip ----------------------------

   svg.on("mousemove", () => {
        // we can use d3.mouse() to tell us the exact x and y positions of our cursor
        const [mx, my] = d3.mouse(svg.node());
        // projection can be inverted to return [lat, long] from [x, y] in pixels
        const proj = projection.invert([mx, my]);
        state.hover["Longitude"] = proj[0];
        state.hover["Latitude"] = proj[1];
        draw();
      });

      // --------------------------- tooltip 4 circles ----------------------------

      const tooltip = d3.selectAll('#tooltip-box')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', '0') 
      
      const dotToolOver = d => {
      tooltip 
      .style('opacity', '.8')
      .style('background-color', 'black') 
      .html('<span> State: ' + d.State + '<br> Changes in 95 days: '  + d.ChangesIn95Days + '</span>')
      .style('padding', '10px 5px')
      .style("left", (d3.event.pageX + 10) + "px")
      .style("top", (d3.event.pageY -30) + "px")
      .style('border-radius', '10%')
      .style('font-size', '13px')
    }

    const dotToolLeave = d => {
      tooltip
      .style('opacity', '0')
    }

    // --------------------------- circles ----------------------------
  
  const dots = svg.selectAll("circle")
  .data(state.heatData)
  .join( enter => enter
    .append('circle')
  .attr("r", 0)
  .attr('fill-opacity', '0')
  .attr("fill", d => color(d.ChangesIn95Days))
  .attr('stroke', d => color(d.ChangesIn95Days))
  .attr('stroke-width', 0)
  .attr('cx', d => projection([+d.Long, +d.Lat])[0])
  .attr('cy', d => projection([+d.Long, +d.Lat])[1])
  .call( enter => enter 
  .transition()
  .duration(1000)
  .attr("r", radius)
  .attr('fill-opacity', '0.7')
  .attr('stroke-width', 1)),
  update => update,
  exit => exit
  .call( exit => exit 
    .transition()
    .duration(1000)
    .remove()

  )
  )
  .on('mousemove', d => {
    d3.select(this)
   .transition()
   .duration(500)
    .attr('r', radius * 1.5)})
  .on('mouseleave', d => {
   d3.select(this)
    .transition()
    .duration(500)
    .attr('r', radius)
  })  
  .on('mouseover', dotToolOver)
  .on('mouseleave', dotToolLeave)

  // + ADD EVENT LISTENERS (if you want)

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */

 // --------------------------- geo hover tooltip ----------------------------

function draw() {
    // return an array of [key, value] pairs
    hoverData = Object.entries(state.hover);

    d3.select("#hover-content")
      .selectAll("div.row")
      .data(hoverData)
      .join("div")
      // .append('div')
      .attr("class", "row")
      .html(
        d =>
          // each d is [key, value] pair
          d[1] // check if value exist
            ? `${d[0]}: ${d[1]}` // if they do, fill them in
            : null // otherwise, show nothing
      );
}
