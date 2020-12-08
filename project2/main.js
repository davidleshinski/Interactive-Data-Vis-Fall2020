/**
 * CONSTANTS AND GLOBALS
 * */
const radius = 6,
width = 750,
height = 500,
margin = { top: 40, bottom: 60, left: 120, right: 90 },
innerBoxHeight = height - margin.top - margin.bottom,
innerBoxWidth = width - margin.left - margin.right;

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svgForLine;
let boxForLine;
let xScaleLine;
let yScaleLine;
let xAxisLine;
let yAxisLine;
let marketLine;
let marketDots;
let lineFunc;

let svgForBars;
let yScaleForBars;
let xScaleForBars;
let boxForBars;
let systemBars;
let yAxisForBars;
let xAxisForBars;
let genderStats;

let svgForLine2;
let xScaleLine2;
let xAxisForLine2;
let yAxisForLine2;
let genderDots;

let svgForBars2;
let boxForBars2;
let yScaleForBars2;
let xScaleForBars2;
let yAxisForBars2;
let xAxisForBars2;
let ageBars;

let state = {
  ageData: [],
  genderData: [],
  marketData: [],
  aprilRevData: [],
  worldData: [],
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
    // + SET STATE WITH DATA
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

// ---------------- init function start------------------
  function init() {

// --------------------- svg-for-Market-line -------------------

    svgForLine = d3.select('#d3-container-1')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
  
    boxForLine = svgForLine.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
  
// --------------------- scales-for-Market-line -------------------

    xScaleLine = d3.scaleTime()
    .domain(d3.extent(state.marketData.map(d => d.Year)))
    .range([0, innerBoxWidth])

    yScaleLine = d3.scaleLinear()
    .domain([0,210])
    .range([innerBoxHeight, 0])

// --------------------- axis'-for-Market-line -------------------

    yAxisLine = boxForLine.append('g')
    .call(d3.axisLeft(yScaleLine))
    .attr('class', 'axis axis-left')
    .style('color', '#rgb(62, 184, 62)')
    .style('font-size','13px');

    xAxisLine = boxForLine.append('g')
    .call(d3.axisBottom(xScaleLine))
    .attr('transform', `translate(0, ${innerBoxHeight})`)
    .style('color', '#rgb(62, 184, 62)')
    .attr('class', 'axis axis-left')
    .style('font-size','13px');

// ----------------------- svg-for-system-bars ------------------------
svgForBars = d3.select("#d3-container-2")
.append("svg")
.attr("width", width)
.attr("height", height);

boxForBars = svgForBars.append("g")
.attr('transform', `translate(${margin.left}, ${margin.top})`);

// ---------------------scale-for-system-bars----------------------

xScaleForBars = d3.scaleBand()
.domain(state.aprilRevData.map(d => d.system))
.range([0, innerBoxWidth])
.paddingInner(0.6)
.paddingOuter(0.6);

 yScaleForBars = d3.scaleLinear()
.domain([0, d3.max(state.aprilRevData.map(d => d.total))])
.range([innerBoxHeight, 0]);

// ---------------------axis-for-system-bars----------------------

yAxisForBars = boxForBars.append("g")
.call(d3.axisLeft(yScaleForBars))
.style('color','#fff')
.style('font-size','13px');

xAxisForBars = boxForBars.append("g")
.call(d3.axisBottom(xScaleForBars))
.attr('transform', `translate(0, ${innerBoxHeight})`)
.style('color','#fff')
.style('font-size','13px');

// ---------------------svg-for-gender-line----------------------

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

// ---------------------scales-for-gender-line----------------------

   xScaleLine2 = d3.scaleTime()
    .domain(d3.extent(state.genderData, function(d) { return d.year; }))
    .range([ 0, innerBoxWidth]);



  yScaleLine2 = d3.scaleLinear()
    .domain([0, 100])
    .range([ innerBoxHeight, 0]);

    // ---------------------axis'-for-gender-line----------------------

    xAxisForLine2 = boxForLine2.append("g")
    .call(d3.axisBottom(xScaleLine2))
    .attr('transform', `translate(0, ${innerBoxHeight})`)
    .style('color', '#000');

  yAxisForLine2 = boxForLine2.append("g")
    .call(d3.axisLeft(yScaleLine2))
    .style('color', '#000')

  // color palette
  genderGroups = genderStats.map(function(d){ return d.key }) // list of group names
  color = d3.scaleOrdinal()
    .domain(genderGroups)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // legendForLines2 = boxForLine2.append('div')
  // .attr('position', 'absolute')
  // .attr('bottom', '0')
  // .attr('right', '0')
  // .attr('class', 'legend-for-gender')
  // .append('p')
  // .text('Male')
  // .style('font-size', '50px')
  // .style('color', '#000')
  
// ----------------------- svg-for-age-bars------------------------
svgForBars2 = d3.select("#d3-container-4")
.append("svg")
.attr("width", width)
.attr("height", height);

boxForBars2 = svgForBars2.append("g")
.attr('transform', `translate(${margin.left}, ${margin.top})`);

// ---------------------scale-for-age-bars----------------------

xScaleForBars2 = d3.scaleBand()
.domain(state.ageData.map(d => d.range))
.range([0, innerBoxWidth])
.paddingInner(0.5)
.paddingOuter(0.5);

 yScaleForBars2 = d3.scaleLinear()
//  .domain([0,100])
.domain([0, d3.max(state.ageData.map(d => d.percent))])
.range([innerBoxHeight, 0]);

// ---------------------axis-for-age-bars----------------------

yAxisForBars2 = boxForBars2.append("g")
.call(d3.axisLeft(yScaleForBars2))

.append('text')
.attr("class", "axis-label")
.attr("y", "55%")
.attr("dx", "-3em")
.attr("writing-mode", "vertical-lr")
.style('fill','#fff')
.style('font-size','13px')
.text("Percentage of Players");

xAxisForBars2 = boxForBars2.append("g")
.call(d3.axisBottom(xScaleForBars2))
.attr('transform', `translate(0, ${innerBoxHeight})`)
.append('text')
.attr("class", "axis-label")
.attr("x", "32%")
.attr("dy", "3em")
.text("Age Range")
.style('color', 'fff')
.style('fill', '#fff')
;

draw();
}

  // --------------------- function-for-Market-line-------------------

  lineFunc = d3.line()
  .x(d => xScaleLine(d.Year))
  .y(d => yScaleLine(d.Value));

  
  
// ---------------- draw function start------------------
  function draw() {

    // --------------------- line+dots-for-Market-Line -------------------

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

// ------------------------- bars-for-System-bars----------------------------
 systemBars = boxForBars.selectAll("rect")
.data(state.aprilRevData)
.join("rect")
.attr("class", "big-bars")
// .style("fill", (d,i) => blues(i))
.attr("y", d => yScaleForBars(d.total))
.style('fill', '#fff')
.attr("x", d => xScaleForBars(d.system))
.attr("height", d => innerBoxHeight - yScaleForBars(d.total))
.attr("width", d => xScaleForBars.bandwidth());

//------------------------- lines+dots-for-gender-lines------------------------

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


// ------------------------- bars-for-age-bars----------------------------\

ageBars= boxForBars2.selectAll(".big-bars2")
.data(state.ageData)
.join("rect")
.attr("class", "big-bars2")
// .style("fill", (d,i) => blues(i))
.style('fill', '#fff')
.attr("y", d => yScaleForBars2(d.percent))
.attr("x", d => xScaleForBars2(d.range))
.attr("height", d => innerBoxHeight - yScaleForBars2(d.percent))
.attr("width", d => xScaleForBars2.bandwidth());
  }