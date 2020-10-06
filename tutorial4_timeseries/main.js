// ----------------------- constants ------------------------
const width = 900,
  height = 800,
  margin = { top: 20, bottom: 40, left: 60, right: 40 },
  radius = 8,
  innerHeight = height - margin.top - margin.bottom,
innerWidth = width - margin.left - margin.right;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let g;

/* APPLICATION STATE */
let state = {
  data: [],
  selection: "All"
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv("../data/nba_player_stats.csv", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {

  // --------------------------- scales -----------------------

  xScale = d3.scaleLinear() 
   .domain(d3.extent(state.data.map(d => d.Season)))
  .range([0, innerWidth])

  yScale = d3.scaleLinear()
  .domain([0, d3.max(state.data.map(d => d.Points))])
  .range([innerHeight, 0])
  
// ----------------------- selction dropdown ------------------------

  const selectElement = d3.select("#dropdown").on("change", function() {
    // 'this.value' holds the dropdown value a user just selected
    state.selection = this.value; // + UPDATE STATE WITH YOUR SELECTED VALUE
    console.log("new value is", this.value);
    draw();
  });

  options = selectElement.selectAll("option")
    .data(["All", "Kobe Bryant", "Lebron James", "Kevin Durant", "James Harden"])
    .join("option")
    .attr("value", d => d)
    .text(d => d);

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
    .attr('class', 'axis axis-left');

    g.append("g").call(d3.axisBottom(xScale))
    .attr('transform', `translate(0, ${innerHeight})`)
    .style('color', '#000')
    .attr('class', 'axis axis-bottom');

  draw(); // calls the draw function
}

function draw() {
 
// ------------------ filter function ------------------------

  let filteredData = state.data

  if (state.selection !== "All") {
    filteredData = state.data.filter(d => d.Player === state.selection)
  }
 
  // ----------------------- dots ------------------------
   dot = g.selectAll("dot")
    .data(filteredData)
    .join(enter => enter
      .append('circle')
      .attr("r", 0)
      .style('opacity', 0)
      .attr('class', "dot")
      .attr("cx", d => xScale(d.Season))
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
      .duration(3000)
      ),
      update => update
      .call( update => update
      .transition()
      .attr("r", 5)
      .duration(1500))
      .call( update => update
      .transition()
      .attr("r", 10)
      .duration(1500)),
      exit => exit 
      // .transition()
      // .duration(1000)
      // .style("opacity", 0)
      .remove()
      )}
