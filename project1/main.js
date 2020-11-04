/**
 * CONSTANTS AND GLOBALS
 * */
const radius = 5,
 width = 800,
  height = 600,
  margin = { top: 50, bottom: 50, left: 100, right: 90 },
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
  d3.csv("../data/steam_users.csv", d3.autoType),
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
    .domain([d3.min(state.gameData.map(d =>d.Twitch24hrs)), d3.max(state.gameData.map(d => d.Twitch24hrs))])
    .range([0, innerBoxWidth])

    yScale = d3.scaleLinear()
    .domain([d3.min(state.gameData.map(d =>d.Peak24hrs)), d3.max(state.gameData.map(d => d.Peak24hrs))])
    .range([innerBoxHeight, 0])

     myColor = d3.scaleOrdinal()
     .domain(state.gameData)
    .range(d3.schemeSet3);

// ----------------------- axis'-chart-1 -----------------------------

    yAxis = innerBox.append('g')
    .call(d3.axisLeft(yScale))
    .attr('class', 'axis axis-left')
    .style('color', '#000')
    .append('text')
    .attr('class', 'axis-label-left')
    .text('Peak conncurent Players in 24 hours')
    .style('fill', '#000')
    .attr("y", "50%")
    .attr("dx", "-7em")
    .attr("writing-mode", "vertical-lr")


    xAxis = innerBox.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0, ${innerBoxHeight})`)
    .style('color', '#000')
    .attr('class', 'axis axis-left')
    .append('text')
    .attr('class', 'axis-label-bottom')
    .text('Peak conncurent viewers in 24 hours')
    .style('fill', '#000')
    .attr("x", "40%")
    .attr("dy", "4em")
   
  // + ADD EVENT LISTENERS (if you want)

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
    .attr("stroke", d => myColor(d.Name))
    .style('opacity', 0)
    .attr('r', 0)
    .call( enter => enter
    .transition()
    .duration(1000)
      .style('opacity', 1)
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
}