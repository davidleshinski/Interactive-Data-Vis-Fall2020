/**
 * CONSTANTS AND GLOBALS
 * */
const radius = 6,
width = 750,
height = 500,
treeHeight = 600,
treeWidth = 800,
margin = { top: 40, bottom: 60, left: 120, right: 90 },
innerBoxHeight = height - margin.top - margin.bottom,
innerBoxWidth = width - margin.left - margin.right;

let svgForLine;
let boxForLine;
let xScaleLine;
let yScaleLine;
let xAxisLine;
let yAxisLine;
let marketLine;
let marketDots;
let lineFunc;
let marketTooltip;

let svgForBars;
let yScaleForBars;
let xScaleForBars;
let boxForBars;
let systemBars;
let yAxisForBars;
let xAxisForBars;
let systemTooltip;

let genderStats;
let svgForLine2;
let xScaleLine2;
let xAxisForLine2;
let yAxisForLine2;
let genderDots;
let genderTooltip;

let svgForBars2;
let boxForBars2;
let yScaleForBars2;
let xScaleForBars2;
let yAxisForBars2;
let xAxisForBars2;
let ageBars;
let ageTooltip;

let svgTree;
let boxTree;
let circlesTree;
let simulation;
let radiusScale;
let treeText;
let bubbleTooltip;

let state = {
  ageData: [],
  genderData: [],
  marketData: [],
  aprilRevData: [],
  worldData: [],
  hover: []
};

Promise.all([
    d3.csv("../data/gaming_ages.csv", d3.autoType),
    d3.csv("../data/gaming_gender.csv",  d => ({
      year: new Date(d.year),
      gender: d.gender,
      percentage: +d.percentage})),
    d3.csv("../data/gaming_market_value.csv",  d => ({
        Year: new Date(d.Year),
        Value: +d.Value})),
    d3.csv("../data/gaming_rev_april2020.csv"),
    d3.csv("../data/worldwide_gamers.csv", d3.autoType)]).then(([ageData, genderData, marketData, aprilRevData, worldData]) => {
    state.ageData = ageData,
    state.genderData = genderData,
    state.marketData = marketData,
    state.aprilRevData = aprilRevData, 
    state.worldData = worldData
    console.log("state.ageData: ", state.ageData);
    console.log("state.GenderData: ", state.genderData);
    console.log("state.marketData: ", state.marketData);
    console.log("state.aprilRevData: ", state.aprilRevData);
    console.log("state.worldData: ", state.worldData);
    init();
  });


  function init() {

// --------------------- market -------------------

    svgForLine = d3.select('#d3-container-1')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
  
    boxForLine = svgForLine.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
  
    xScaleLine = d3.scaleTime()
    .domain(d3.extent(state.marketData.map(d => d.Year)))
    .range([0, innerBoxWidth])

    yScaleLine = d3.scaleLinear()
    .domain([0,210])
    .range([innerBoxHeight, 0])


    yAxisLine = boxForLine.append('g')
    .call(d3.axisLeft(yScaleLine))
    .attr('class', 'axis')
    .style('color', '#rgb(62, 184, 62)')
    .append('text')
.attr("class", "axis-label")
.attr("y", "55%")
.attr("dx", "-4em")
.attr("writing-mode", "vertical-lr")
.style('fill','#000')
.text("Dollars in Billions");

    xAxisLine = boxForLine.append('g')
    .call(d3.axisBottom(xScaleLine))
    .attr('transform', `translate(0, ${innerBoxHeight})`)
    .style('color', '#rgb(62, 184, 62)')
    .attr('class', 'axis')
    .append('text')
.attr("class", "axis-label")
.attr("x", "36%")
.attr("dy", "3em")
.style('fill','#000')
.text("Year");

marketTooltip = d3.select('.market-tooltip')
.style('visibility', 'hidden')

marketMouseOver = (d) => {
marketTooltip
.style('visibility', 'visible')
.style('opacity', '1')
.style('background-color', '#fff')
.style('border', '1px solid #000')
.html('<span><strong>Year:</strong> ' + d.Year + '<br><strong>Value:</strong> ' + d.Value + ' billion</span>')
.style("left", (d3.event.pageX + 10) + "px")
.style("top", (d3.event.pageY -30) + "px")
.style('padding', '5px 5px')
.style('color', '#000')
}

marketMouseLeave = (d) => {
  marketTooltip
  .style('visibility', 'hidden')
}

// ----------------------- system ------------------------
svgForBars = d3.select("#d3-container-2")
.append("svg")
.attr("width", width)
.attr("height", height);

boxForBars = svgForBars.append("g")
.attr('transform', `translate(${margin.left}, ${margin.top})`);


xScaleForBars = d3.scaleBand()
.domain(state.aprilRevData.map(d => d.system))
.range([0, innerBoxWidth])
.paddingInner(0.6)
.paddingOuter(0.6);

 yScaleForBars = d3.scaleLinear()
.domain([0, d3.max(state.aprilRevData.map(d => d.total))])
.range([innerBoxHeight, 0]);


yAxisForBars = boxForBars.append("g")
.call(d3.axisLeft(yScaleForBars))
.attr('class', 'axis')
.style('color','#fff')
.append('text')
.attr("class", "axis-label")
.attr("y", "55%")
.attr("dx", "-4em")
.attr("writing-mode", "vertical-lr")
.style('fill','#fff')
.text("Dollars in Billions");

xAxisForBars = boxForBars.append("g")
.call(d3.axisBottom(xScaleForBars))
.attr('class', 'axis')
.attr('transform', `translate(0, ${innerBoxHeight})`)
.style('color','#fff')
.append('text')
.attr("class", "axis-label")
.attr("x", "36%")
.attr("dy", "3em")
.style('fill','#fff')
.text("Platform");

systemTooltip = d3.select('.system-tooltip')
.style('visibility', 'hidden')

systemMouseOver = (d) => {
  systemTooltip
  .style('visibility', 'visible')
  .style('opacity', '1')
  .style('background-color', '#fff')
  .style('border', '1px solid #000')
  .html('<span><strong>Platform:</strong> ' + d.system + ' <br><strong>Revenue:</strong> ' + d.total +  ' billion</span>')
  .style("left", (d3.event.pageX + 10) + "px")
.style("top", (d3.event.pageY -30) + "px")
.style('padding', '5px 5px')
.style('color', '#000')
}

systemMouseLeave = (d) => {
  systemTooltip
  .style('visibility', 'hidden')
}

// ---------------------gender----------------------

    genderStats = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.gender;})
    .entries(state.genderData);

    svgForLine2 = d3.select('#d3-container-3')
    .append('svg')
    .attr("width", width)
.attr("height", height);

boxForLine2 = svgForLine2.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`)
.attr('position', 'relative');


   xScaleLine2 = d3.scaleTime()
    .domain(d3.extent(state.genderData, function(d) { return d.year; }))
    .range([ 0, innerBoxWidth]);



  yScaleLine2 = d3.scaleLinear()
    .domain([0, 100])
    .range([ innerBoxHeight, 0]);

    xAxisForLine2 = boxForLine2.append("g")
    .call(d3.axisBottom(xScaleLine2))
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${innerBoxHeight})`)
    .style('color', '#000')
    .append('text')
.attr("class", "axis-label")
.attr("x", "36%")
.attr("dy", "3em")
.style('fill','#000')
.text("Year");

  yAxisForLine2 = boxForLine2.append("g")
    .call(d3.axisLeft(yScaleLine2))
    .attr('class', 'axis')
    .style('color', '#000')
    .append('text')
    .attr("class", "axis-label")
    .attr("y", "55%")
.attr("dx", "-4em")
.attr("writing-mode", "vertical-lr")
.style('fill','#000')
.text("Percentage of Players");

  // color palette
  genderGroups = genderStats.map(function(d){ return d.key }) // list of group names
  color = d3.scaleOrdinal()
    .domain(genderGroups)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  genderTooltip = d3.select('.gender-tooltip')
  .style('visibility', 'hidden')

  genderMouseOver = (d) => {
    genderTooltip
    .style('visibility', 'visible')
    .style('opacity', '1')
    .style('background-color', '#fff')
    .style('border', '1px solid #000')
    .html('<span> <strong>Year:</strong> ' + d.year + '<br><strong>Gender:</strong> ' + d.gender + ' <br><strong>Percentage of Gamers:</strong> ' + d.percentage +  '%</span>')
    .style("left", (d3.event.pageX + 10) + "px")
  .style("top", (d3.event.pageY -30) + "px")
  .style('padding', '5px 5px')
  .style('color', '#000')
  }
  
genderMouseLeave = (d) => {
  genderTooltip
  .style('visibility', 'hidden')
}

// ----------------------- age ------------------------
svgForBars2 = d3.select("#d3-container-4")
.append("svg")
.attr("width", width)
.attr("height", height);

boxForBars2 = svgForBars2.append("g")
.attr('transform', `translate(${margin.left}, ${margin.top})`);


xScaleForBars2 = d3.scaleBand()
.domain(state.ageData.map(d => d.range))
.range([0, innerBoxWidth])
.paddingInner(0.5)
.paddingOuter(0.5);

 yScaleForBars2 = d3.scaleLinear()
//  .domain([0,100])
.domain([0, d3.max(state.ageData.map(d => d.percent))])
.range([innerBoxHeight, 0]);


yAxisForBars2 = boxForBars2.append("g")
.call(d3.axisLeft(yScaleForBars2))
.attr('class', 'axis')
.append('text')
.attr("class", "axis-label")
.attr("y", "55%")
.attr("dx", "-4em")
.attr("writing-mode", "vertical-lr")
.style('fill','#fff')
.text("Percentage of Players");

xAxisForBars2 = boxForBars2.append("g")
.call(d3.axisBottom(xScaleForBars2))
.attr('class', 'axis')
.attr('transform', `translate(0, ${innerBoxHeight})`)
.append('text')
.attr("class", "axis-label")
.attr("x", "32%")
.attr("dy", "4em")
.text("Age Range")
.style('fill', '#fff')
;

ageTooltip = d3.select('.age-tooltip')
.style('visibility', 'hidden')

ageMouseOver = (d) => {
  ageTooltip
  .style('visibility', 'visible')
  .style('opacity', '1')
  .style('background-color', '#fff')
  .style('border', '1px solid #000')
  .html('<span><strong>Age Range:</strong> ' + d.range + ' <br><strong>Percentage of Gamers:</strong> ' + d.percent +  '%</span>')
  .style("left", (d3.event.pageX + 10) + "px")
.style("top", (d3.event.pageY -30) + "px")
.style('padding', '5px 5px')
.style('color', '#000')
}

ageMouseLeave = (d) => {
  ageTooltip
  .style('visibility', 'hidden')
  }

// ----------------- worldwide-------------------------

svgTree = d3.select('#d3-container-5')
.append("svg")
.attr('height', treeHeight)
.attr('width', treeWidth)

boxTree = svgTree.append("g")
.attr("transform", "translate(0,0)")

radiusScale = d3.scaleSqrt()
.domain([210, 1447])
.range([50,125])


simulation = d3.forceSimulation()
.force("x", d3.forceX(treeWidth *2)
.strength(0.005))
.force("y", d3.forceY(treeHeight * 2)
.strength(0.005))
.force("collide", d3.forceCollide(d => radiusScale(d.players)))


simulation.nodes(state.worldData)
.on('tick', ticked)

bubbleTooltip = d3.select('.bubble-tooltip')
.style('visibility', 'hidden')

bubbleMouseOver = (d) => {
  bubbleTooltip
  .style('visibility', 'visible')
  .style('opacity', '1')
  .style('background-color', '#fff')
  .style('border', '1px solid #000')
  .html('<span><strong>Region:</strong> ' + d.region + ' <br><strong>Gamers:</strong> ' + d.players +  ' million</span>')
  .style("left", (d3.event.pageX + 10) + "px")
.style("top", (d3.event.pageY -30) + "px")
.style('padding', '5px 5px')
.style('color', '#000')
}

bubbleMouseLeave = (d) => {
bubbleTooltip
.style('visibility', 'hidden')
}

draw();
  } 

  // --------------------- functions that im not sure where to put (in init or draw?)-------------------
  
function ticked() {
  circlesTree
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
}
  

  lineFunc = d3.line()
  .x(d => xScaleLine(d.Year))
  .y(d => yScaleLine(d.Value));

  //-------------
  
  function draw() {

    // ---------------------Market-Line -------------------

marketLine = boxForLine.selectAll('.trend')
.data([state.marketData])
.join('path')
.attr('class', 'trend')
.attr("d", d => lineFunc(d))
.attr('stroke', '#000')
.attr('fill', 'none')
.style('stroke-width', '2')

marketDots = boxForLine.selectAll('circle')
.data(state.marketData)
.join('circle')
// .style('fill', d => colorScale(d.peakConcurrentInMillions))
.attr('cx', d => xScaleLine(d.Year))
.attr('cy', d => yScaleLine(d.Value))
.attr('r', 4)
.on('mouseover', marketMouseOver)
.on('mouseleave', marketMouseLeave)

// -------------------------System-bars----------------------------
 systemBars = boxForBars.selectAll("rect")
.data(state.aprilRevData)
.join("rect")
.attr("class", "big-bars")
// .style("fill", (d,i) => blues(i))
.attr("y", d => yScaleForBars(d.total))
.style('fill', '#fff')
.attr("x", d => xScaleForBars(d.system))
.attr("height", d => innerBoxHeight - yScaleForBars(d.total))
.attr("width", d => xScaleForBars.bandwidth())
.on('mouseover', systemMouseOver)
.on('mouseleave', systemMouseLeave)

//-------------------------gender-lines------------------------

boxForLine2.selectAll(".line")
.data(genderStats)
.enter()
.append("path")
.attr('class', "line")
  .attr("fill", "none")
  .attr("stroke", '#000')
  .attr("stroke-width", 2)
  .attr("d", function(d){
    return d3.line()
      .x(function(d) { return xScaleLine2(d.year);})
      .y(function(d) { return yScaleLine2(d.percentage);})
      (d.values)
  })

  genderDots = boxForLine2.selectAll('circle')
.data(state.genderData, d=> `${d.year}_${d.percentage}`)
.join('circle')
// .style('fill', d => colorScale(d.peakConcurrentInMillions))
.attr('cx', d => xScaleLine2(d.year))
.attr('cy', d => yScaleLine2(d.percentage))
.attr('r', 4)
.on('mouseover', genderMouseOver)
.on('mouseleave', genderMouseLeave)


// -------------------------age-bars----------------------------\

ageBars= boxForBars2.selectAll(".big-bars2")
.data(state.ageData)
.join("rect")
.attr("class", "big-bars2")
// .style("fill", (d,i) => blues(i))
.style('fill', '#fff')
.attr("y", d => yScaleForBars2(d.percent))
.attr("x", d => xScaleForBars2(d.range))
.attr("height", d => innerBoxHeight - yScaleForBars2(d.percent))
.attr("width", d => xScaleForBars2.bandwidth())
.on('mouseover', ageMouseOver)
.on('mouseleave', ageMouseLeave);


// -----------------------bubble-circles----------------------
 
circlesTree = boxTree.selectAll(".tree-circles")
.data(state.worldData)
.join('circle')
.attr("class", "tree-circles")
.attr("r", d => radiusScale(d.players))
.attr("fill", 'rgb(62, 184, 62)')
.on("mouseover", bubbleMouseOver)
.on("mouseleave", bubbleMouseLeave)
}


