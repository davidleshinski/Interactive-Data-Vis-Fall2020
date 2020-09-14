d3.csv("../data/City_populations.csv" , d3.autoType).then(data => {

const svgWidth = 800

const svgHeight = 800

const margin = {top: 30, right: 20, bottom: 30, left: 200}

const innerWidth = svgWidth - margin.left - margin.right

const innerHeight = svgHeight - margin.top - margin.bottom

const accent = d3.scaleOrdinal(d3.schemeAccent);

const svg = d3.select(".d3-svg")
.attr("width", svgWidth)
.attr("height", svgHeight);


const yScale = d3.scaleBand()
.domain(data.map(d => d.name))
.range([0, innerHeight])
.paddingInner(0.3)
.paddingOuter(0.3);

const xScale = d3.scaleLinear()
.domain([0, d3.max(data.map(d => d.population))])
.range([0, innerWidth]);

const g = svg.append("g")
.attr('transform', `translate(${margin.left}, ${margin.top})`);


g.append("g").call(d3.axisLeft(yScale));
g.append("g").call(d3.axisBottom(xScale))
.attr('transform', `translate(0, ${innerHeight})`);

const bars = g.selectAll("rect")
.data(data)
.join("rect")
.attr("class", "big-bars")
.style("fill", (d,i) => accent(i))
.attr("y", d => yScale(d.name))
// .attr("x", d => xScale(d.calories))
.attr("width", d => xScale(d.population))
.attr("height", d => yScale.bandwidth());

})

