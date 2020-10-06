
// -------------------- Constants -------------------- 
const 
svgHeight = 600,
svgWidth = 900,
margin = {top: 40, right: 60, bottom: 60, left: 60},
innerHeight = svgHeight - margin.top - margin.bottom,
innerWidth = svgWidth - margin.left - margin.right;

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
d3.csv("../data/marvelVsDc.csv", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

function init() {

  // -------------------- Dropdown options -------------------- 

  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log(this.value)
         state.selection = this.value
         console.log("new value is", this.value);
          draw();
     });

options = selectElement.selectAll('option')
.data(["All", "Marvel", "DC"])
.join('option')
.attr("value", d => d)
.text(d => d);

// -------------------- Create Scales -------------------- 

  xScale = d3.scaleLinear()
  .domain([d3.min(state.data.map(d =>d.GrossWorldwide)), d3.max(state.data.map(d => d.GrossWorldwide))])
  .range([0, innerWidth]);

  yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([innerHeight, 0]);

// -------------------- Create svg -------------------- 

svg = d3.selectAll('#d3-container')
.append('svg')
.attr('width', svgWidth)
.attr('height', svgHeight);

g = svg.append("g")
.attr('transform', `translate(${margin.left}, ${margin.top})`)
.attr('class', 'innerBox');

// ---------------------- Create Axis ---------------------
g.append("g").call(d3.axisLeft(yScale))
.style('color','#fff')
.attr('class', 'yAxis');

g.append("g").call(d3.axisBottom(xScale))
.attr('transform', `translate(0, ${innerHeight})`)
.attr('class', 'xAxis')
.style('color','#fff');

draw();
}

// ---------------------- Tooltip -------------------

const tooltip = d3.select("#d3-container")
  .append("div")
  .style("opacity", 0)
  .style('text-align', 'left')
  .attr("class", "tooltip")


const mouseover = function(d) {
  tooltip
    .style("opacity", 0.6)
    .style('border', '1px solid #000')
    .style('background', '#fff')
    .style('padding', '6px')
    .html( "<span style='color: #000;'> Title: " + d.OriginalTitle + " <br>Rating: " + d.Rate + " <br>Gross Worldwide: " + d.GrossWorldwide + '</span>')
    .style("right", (d3.mouse(this)[0] + 1) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}

const mouseleave = function(d) {
  tooltip
    .transition()
    .style("opacity", 0)
    .duration(100)
}

function draw() {

  // -------------------- filter function -------------------- 

  let filteredData = state.data

  if (state.selection !== "All") {
    filteredData = state.data.filter(d => d.Company === state.selection)
  }
 
  // -------------------- create circles -------------------- 

dots = g.selectAll('.circles')
.data(filteredData, d => d.OriginalTitle)
.join(
enter => enter
.append('circle')
.attr("r", 0)
.style('opacity', 0)
.attr('class', 'circles')
.attr("cx", d => xScale(d.GrossWorldwide))
.attr("cy", d => yScale(d.Rate))
.style('fill', d => d.Company === 'Marvel' ? 'Red' : 'Blue')
.on("mouseover", mouseover)
.on("mouseleave", mouseleave)
.call( enter => enter
.transition()
.attr("r", 10)
.style('opacity', '0.7')
.style('stroke', '#fff')
.duration(3000)
),
update => update
.call( update => update
.transition()
.attr("r", 5)
.duration(1500)
.transition()
.attr("r", 10)
.duration(1500)),
exit => exit 
.call( exit => exit 
.transition().duration(1000)
.style("opacity", 0)
.remove()
)
)
console.log(dots)
}