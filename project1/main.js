/**
 * CONSTANTS AND GLOBALS
 * */
const radius = 6,
 width = 800,
  height = 600,
  margin = { top: 40, bottom: 60, left: 120, right: 90 },
  innerBoxHeight = height - margin.top - margin.bottom,
  innerBoxWidth = width - margin.left - margin.right,
  defaultGame = "All"

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let g;
let xAxis;
let yAxis;
let xScale;
let yScale;
let myColor;
let  tooltipHover1;
let  tooltipLeave1;
let tooltipDetails1;
let tooltipDescription;
let tooltipHover2;
let tooltipLeave2;
let tooltipForDots;
let tooltipBoxHover1;

let state = {
  accountData: [],
  gameData: [],
  gameSelection: defaultGame,
};


/**
 --------------------------- LOAD DATA ------------------------------
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.csv("../data/steam_users.csv",  d => ({
    monthYear: new Date(d.monthYear),
    peakConcurrentInMillions: +d.peakConcurrentInMillions})),
  d3.csv("../data/steam_games.csv", d3.autoType),
]).then(([accountData, gameData]) => {
  // + SET STATE WITH DATA
  state.accountData = accountData
  state.gameData = gameData
  console.log("accountData", state.accountData);
  console.log("gameData", state.gameData);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {

  // ---------------------- game-dropdown-chart-1 ----------------------

    const selectGame = d3.select("#dropdown").on("change", function() {
        console.log(this.value)
             state.gameSelection = this.value
             console.log("new value is", this.value);
              draw();
         });
    
    gameOptions = selectGame.selectAll('option')
    .data([defaultGame,
        ...Array.from(new Set(state.gameData.map(d => d.Name)))])
    .join('option')
    .attr("value", d => d)
    .text(d => d);


  // ---------------------- svg-chart-1 --------------------

    svg = d3.select('#d3-chart-1')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

    innerBox = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)


    // ----------------------- scales-chart-1 -------------------------

    xScale = d3.scaleLinear()
    .domain([0, d3.max(state.gameData.map(d => d.Twitch24hrs))])
    .range([0, innerBoxWidth])

    yScale = d3.scaleLinear()
    .domain([0, d3.max(state.gameData.map(d => d.Peak24hrs))])
    .range([innerBoxHeight, 0])

     myColor = d3.scaleOrdinal()
     .domain(state.gameData)
    .range(d3.schemePaired);

// ----------------------- axis'-chart-1 -----------------------------

    yAxis = innerBox.append('g')
    .call(d3.axisLeft(yScale))
    .attr('class', 'axis axis-left')
    .style('color', '#fff')
    .append('text')
    .attr('class', 'axis-label-left')
    .text('Peak Conncurent Players in 24 Hours')
    .style('fill', '#fff')
    .attr("y", "60%")
    .attr("dx", "-6em")
    .attr("writing-mode", "vertical-lr")
    .style("font-size", "13px") 


    xAxis = innerBox.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0, ${innerBoxHeight})`)
    .style('color', '#fff')
    .attr('class', 'axis axis-left')
    .append('text')
    .attr('class', 'axis-label-bottom')
    .text('Peak Conncurent Twitch Viewers in 24 Hours')
    .style('fill', '#fff')
    .attr("x", "40%")
    .attr("dy", "4em")
    .style("font-size", "13px") 

    // ----------------- title-chart-1 -----------------------

    innerBox.append("text")
        .attr("x", (innerBoxWidth / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")  
        .style("font-size", "16px") 
        .style("fill", "#fff")  
        .text("Peak Concurrent Players by Peak Concurrent Twitch Viewers (24 Hours)");

   // -----------------------tooltip-chart-1 -------------------------

   tooltipDetails1 = d3.select(".data-tips") 
   .style('opacity', '0')

   tooltipHover1 = d => {
    tooltipDetails1  
    .html('<span> <strong>Game:</strong><br> ' + d.Name + '<br><br><strong>All-Time Player Count Peak in 24 Hours:</strong><br> ' + d['All-Time Peak'] + '<br><br><strong>All-Time Twitch Veiwership Peak in 24 Hours:</strong><br> '  + d['All-time Twitch Peak'] + '<br><br><strong>Release Date:</strong><br> ' + d['Release Date'] + '<br><br><strong>Description:</strong><br> ' + d.Description + '</span>')
    .style('font-size', '13px')
    .style('color', '#fff')
    .style('opacity', '1')
  }

//   tooltipDescription = d3.select(".description-tips") 
//   .style('opacity', '0')

//   tooltipHover2 = d => {
//     tooltipDescription
//    .html('<span><strong>Release Date:</strong><br> ' + d['Release Date'] + '<br><br><strong>Description:</strong><br> ' + d.Description + '</span>')
//    .style('font-size', '13px')
//    .style('color', '#fff')
//    .style('opacity', '1')
//  }

 tooltipBoxHover1 = d3.selectAll('#tooltip-box')
 .attr('class', 'tooltip')
 .style('opacity', '0')
 .style('z-index', '2') 

  tooltipForDots = d => {
  tooltipBoxHover1 
 .style('opacity', '1')
 .html('<span><strong>Date:</strong><br> ' + d.Date + '<br><br><strong>Game:</strong><br> ' + d.Name + '<br><br><strong>Peak Players in 24 Hours:</strong><br> '  + d.Peak24hrs + '<br><br><strong>Peak Viewers in 24 Hours:</strong><br> ' + d.Twitch24hrs + '</span>')
 .style('padding', '10px 5px')
 .style("left", (d3.event.pageX + 30) + "px")
 .style("top", (d3.event.pageY -50) + "px")
 .style('font-size', '13px')
}

tooltipLeave1 = d => {
  tooltipBoxHover1 
   .style('opacity', '0')
 }
   
    // ---------------------- svg-chart-2 --------------------

  svg2 = d3.select('#d3-chart-2')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

  innerBox2 = svg2.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // ----------------------- scales-chart-2 -------------------------

xTimeScale = d3.scaleTime()
.domain(d3.extent(state.accountData.map(d => d.monthYear)))
.range([0, innerBoxWidth])

yScale2 = d3.scaleLinear()
.domain([0, 25])
.range([innerBoxHeight, 0])

// ----------------------- axis'-chart-2 ----------------------------

yAxis2 = innerBox2.append('g')
.call(d3.axisLeft(yScale2))
.attr('class', 'axis axis-left')
.style('color', '#fff')
.append('text')
.attr('class', 'axis-label-left')
.text('Peak Concurrent Steam Users (Millions)')
.style('fill', '#fff')
.attr("y", "50%")
.attr("dx", "-5em")
.attr("writing-mode", "vertical-lr")


xAxis2 = innerBox2.append('g')
.call(d3.axisBottom(xTimeScale))
.attr('transform', `translate(0, ${innerBoxHeight})`)
.style('color', '#fff')
.attr('class', 'axis axis-left')
.append('text')
.attr('class', 'axis-label-bottom')
.text('Month/Year')
.style('fill', '#fff')
.attr("x", "40%")
.attr("dy", "4em")




  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */

function draw() {

  // ----------------------- circles-chart-1 --------------------------

  let filteredData = state.gameData;
  // if there is a selectedParty, filter the data before mapping it to our elements
  if (state.gameSelection !== defaultGame) {
    filteredData = state.gameData.filter(d => d.Name === state.gameSelection);
  }
  dots = innerBox.selectAll('circle')
  .data(filteredData, d=> `${d.Name}_${d.Date}`)
  .join( enter => enter
    .append('circle')
    .attr('cx', d => xScale(d.Twitch24hrs))
    .attr('cy', d => yScale(d.Peak24hrs))
    .attr("fill", d => myColor(d.Name))
    .attr("stroke", '#fff')
    .style('cursor', 'pointer')
    .style('opacity', 0)
    .attr('r', 0)
    .call( enter => enter
    .transition()
    .duration(1000)
      .style('opacity', 0.6)
      .attr('r', radius)
      ),
      update => update 
      .call( update => update
        .transition()
        .duration(500)
      .attr('r', 3)
      .transition()
      .duration(500)
      .attr('r', radius)),
      exit => exit 
      .call( exit => exit
        .transition()
        .duration(1000)
        .style('opacity', 0)
        .remove())
      )
.on('mouseover', (d) => {
  tooltipHover1(d); 
  // tooltipHover2(d);
  tooltipForDots(d)

})
.on('mouseleave', (d) => {
 tooltipLeave1();
})

// -------------------- line-function-chart-2 -----------------------

      const lineFunc = d3.line()
.x(d => xTimeScale(d.monthYear))
.y(d => yScale2(d.peakConcurrentInMillions));

line = innerBox2.selectAll('.trend')
.data([state.accountData], d => d.monthYear)
.join('path')
.attr('class', 'trend')
.attr("d", d => lineFunc(d))
.attr('stroke', '#fff')
.attr('fill', 'none')
}