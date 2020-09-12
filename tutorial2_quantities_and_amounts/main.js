d3.csv("../data/cereal.csv" , d3.autoType).then(data => {

const svgWidth = 600

const svgHeight = 600

const svg = d3.select(".d3-svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

const xScale = d3.scaleBand()
.domain(data.map(d => d.name))
.range([0, svgWidth])
.paddingInner(0.1);

const yScale = d3.scaleLinear()
.domain([0, d3.max(data.map(d => d.calories))])
.range([svgHeight, 0]);

const bars = svg.selectAll("rect")
.data(data)
.join("rect")
.attr("class", "big-bars")
.style("fill", "orange")
.attr("x", d => xScale(d.name))
.attr("y", d => yScale(d.calories))
.attr("width", d => xScale.bandwidth())
.attr("height", d => svgHeight - yScale(d.calories))
.append("text")

})

