/**
 * CONSTANTS AND GLOBALS
 * */
const radius = 5,
 width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.6,
  margin = { top: 50, bottom: 30, left: 60, right: 40 },
  defaultGame = "All",
  defaultViewer = "Twitch Viewership",
  defaultPlayerCount = "24h-Peak"

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let g;
let xAxis;
let yAxis;
let xScale;
let yScale;
let color;
 
let state = {
  accountData: [],
  gameData: [],
  gameSelection: defaultGame,
  viewerSelection: defaultViewer,
  playerCountSelection: defaultPlayerCount,
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

  // ---------------------- game dropdown ----------------------

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

    // ------------------------- streaming dropdown -------------------

    const selectViewer = d3.select("#dropdown2").on("change", function() {
      console.log(this.value)
           state.viewerSelection = this.value
           console.log("new value is", this.value);
            draw();
       });
  
  viewerOptions = selectViewer.selectAll('option')
  .data([defaultViewer,
      ...Array.from(new Set(state.gameData.columns.slice(5,6)))])
  .join('option')
  .attr("value", d => d)
  .text(d => d);

     // ------------------------- player count dropdown -------------------

     const selectPlayerCount = d3.select("#dropdown3").on("change", function() {
      console.log(this.value)
           state.playerCountSelection = this.value
           console.log("new value is", this.value);
            draw();
       });
  
  PlayerCountOptions = selectPlayerCount.selectAll('option')
  .data([defaultPlayerCount,
      ...Array.from(new Set(state.gameData.columns.slice(3,4)))])
  .join('option')
  .attr("value", d => d)
  .text(d => d);

  // ---------------------- svg --------------------

    svg = d3.select('#d3-chart-1')
    .append('svg')
    .attr('width', width)
    .attr('height', height)


    // ----------------------- scales -------------------------

    xScale = d3.scaleLinear()
    .domain([d3.min(state.gameData.map(d =>d[state.viewerSelection])), d3.max(state.gameData.map(d => d[state.viewerSelection]))])
    .range(margin.left, width - margin.right)
    yScale = d3.scaleLinear()
    .domain([d3.min(state.gameData.map(d =>d[state.gameSelection])), d3.max(state.gameData.map(d => d[state.gameSelection]))])
    .range(margin.top, height - margin.bottom)

    xAxis 

    yAxis
 
  // + ADD EVENT LISTENERS (if you want)

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */

function draw() {
}