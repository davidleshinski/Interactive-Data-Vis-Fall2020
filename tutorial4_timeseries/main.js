// ----------------------- constants ------------------------
const width = 650,
  height = 650,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5,
  transistionRadius = 2,
  innerHeight = height - margin.top - margin.bottom,
innerWidth = width - margin.left - margin.right,
default_selection = "Select a Player"

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
d3.csv("../data/nba_playoffs_stats.csv", d3.autoType).then(raw_data => {
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

 const options = selectElement.selectAll("option")
    .data([default_selection,
      ...Array.from(new Set(state.data.map(d => d.Player)))])
      .join("option")
    .attr("value", d => d)
    .text(d => d)
    // .sort(d3.ascending); not sure how to use this and keep the default at the top

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
    .style('color', '#fff')
    .attr('class', 'axis axis-left')
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Points");


    g.append("g").call(d3.axisBottom(xScale))
    .attr('transform', `translate(0, ${innerHeight})`)
    .style('color', '#fff')
    .attr('class', 'axis axis-bottom')
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Year")
    .style('color', '#fff');

  draw();
}

function draw() {

  // ------------------------ line function ---------------------
 
const lineFunc = d3.line()
.x(d => xScale(d.Year))
.y(d => yScale(d.Points));


// ------------------ filter function ------------------------

  let filteredData = []

  if (state.selection !== null) {
    filteredData = state.data.filter(d => d.Player === state.selection)
  }
 
  // ----------------------- dots ------------------------
   const dots = g.selectAll("dot")
      .data(filteredData)
      .join( enter => enter
      .append('circle')
      .attr('class', "dot")
      .attr("r", 0)
      .style('opacity', 0)
      .attr("cx", d => xScale(d.Year))
      .attr("cy", d => yScale(d.Points))
      .style('fill', d => {
      if (d.Points >= 600) return "gold";
      else if (d.Points >= 300 && d.Points <= 599) return "limegreen";
      else if (d.Points >= 100 && d.Points <= 299) return "blue";
      else return "red";
      })
      .style('stroke', '#fff')
      .call( enter => enter
      .transition()
      .attr("r", radius)
      .style('opacity', '1')
      .duration(1000)
      ),
      update => update
      .call( update => update
      .transition()
      .attr("r", '2')
      .duration(1500)
      .attr("r", radius)
      .duration(1500)),
      exit => exit 
      .call( exit => exit 
      .transition()
      .style('opacity', '0')
      .duration(1000)
      .remove())
    )

    // --------------------------- line -------------------------

    const line = g.selectAll("path.trend")
      .data([filteredData])
      .join( enter => enter
      .append("path")
      .attr("class", "trend")
      .attr("d", d => lineFunc(d))
      .attr("opacity", '0')
      .call( enter => enter
      .transition()
      .style('stroke', '#fff')
      .attr('opacity', '1')
      .duration(1000)
      ),
      update => update
      .attr("d", d => lineFunc(d))
      .call( update => update
      .transition()
      .duration(1500)),
      exit => exit 
      .call( exit => exit 
      .transition()
      .attr('opacity', '0')
      .duration(1000)
      .remove())
      )
      console.log(filteredData)
console.log(line)

console.log(dots)
}