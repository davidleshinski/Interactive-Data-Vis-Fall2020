// ----------------------- constants ------------------------
const width = 900,
  height = 800,
  margin = { top: 20, bottom: 40, left: 60, right: 40 },
  radius = 8,
  innerHeight = height - margin.top - margin.bottom,
innerWidth = width - margin.left - margin.right,
default_selection = "All"

let svg;
let xScale;
let yScale;
let g;

/* APPLICATION STATE */
let state = {
  data: [],
  selection: null
};

/* LOAD DATA */
d3.csv("../data/nba_player_stats.csv", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
function init() {

  // --------------------------- scales -----------------------

  xScale = d3.scaleLinear() 
   .domain(d3.extent(state.data.map(d => d.Year)))
  .range([0, innerWidth])

  yScale = d3.scaleLinear()
  .domain([0, d3.max(state.data.map(d => d.Points))])
  .range([innerHeight, 0])
  
// ----------------------- selction dropdown ------------------------

  const selectElement = d3.select("#dropdown").on("change", function() {
    state.selection = this.value;
    console.log("new value is", this.value);
    draw();
  });

  options = selectElement.selectAll("option")
    .data([
      ...Array.from(new Set(state.data.map(d => d.Player))),default_selection])
      .join("option")
    .attr("value", d => d)
    .text(d => d);

    selectElement.property("value", default_selection);

    // ----------------------- Svg creation ------------------------

    svg = d3.selectAll("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    g = svg.append("g")
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('class', 'innerBox');

    // ----------------------- axis ------------------------

    g.append("g").call(d3.axisLeft(yScale))
    .style('color', '#000')
    .attr('class', 'axis axis-left')


    g.append("g").call(d3.axisBottom(xScale))
    .attr('transform', `translate(0, ${innerHeight})`)
    .style('color', '#000')
    .attr('class', 'axis axis-bottom');

  draw();
}

function draw() {
 



// ------------------ filter function ------------------------

  let filteredData;

  if (state.selection !== "null") {
    filteredData = state.data.filter(d => d.Player === state.selection)
  }
 
  // ----------------------- dots ------------------------
   dots = g.selectAll("dot")
      .data(filteredData)
      .join(enter => enter
      .append('circle')
      .attr("r", 0)
      .style('opacity', 0)
      .attr('class', "dot")
      .attr("cx", d => xScale(d.Year))
      .attr("cy", d => yScale(d.Points))
      .style('fill', d => {
      if (d.Player === "Kobe Bryant") return "yellow";
      else if (d.Player === "LeBron James") return "purple";
      else if (d.Player === "Kevin Durant") return "blue";
      else return "red";
      })
      .call( enter => enter
      .transition()
      .attr("r", radius)
      .style('opacity', '0.7')
      .duration(1000)
      ),
      update => update
      .call( enter => enter
      .transition()
      .attr("r", 5)
      .duration(1500)
      .attr("r", radius)
      .duration(1500)),
      exit => exit 
      .call( exit => exit 
      .transition()
      .style('opacity', 0)
      .duration(1000)
      .remove())
    )}