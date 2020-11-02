/**
 * CONSTANTS AND GLOBALS
 * */
const radius = 5,
 width = 800,
  height = 600,
  margin = { top: 50, bottom: 30, left: 50, right: 90 },
  innerBoxHeight = height - margin.top - margin.bottom,
  innerBoxWidth = width - margin.left - margin.right,
  defaultGame = "All",
  defaultViewer = "Twitch Viewership",
  defaultPlayerCount = "Peak24hrs"

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
  viewerSelection: defaultViewer
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


  // ---------------------- svg --------------------

    svg = d3.select('#d3-chart-1')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

    innerBox = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)


    // ----------------------- scales -------------------------

    xScale = d3.scaleLinear()
    .domain([d3.min(state.gameData.map(d =>d['Twitch Viewership'])), d3.max(state.gameData.map(d => d['Twitch Viewership']))])
    .range([0, innerBoxWidth])

    yScale = d3.scaleLinear()
    .domain([d3.min(state.gameData.map(d =>d['Peak24hrs'])), d3.max(state.gameData.map(d => d['Peak24hrs']))])
    .range([innerBoxHeight, 0])

// ----------------------- axis' -----------------------------

    yAxis = innerBox.append('g')
    .call(d3.axisLeft(yScale))
    .style('color', '#000')

    xAxis = innerBox.append('g')
    .call(d3.axisBottom(xScale))
    .style('color', '#000')
    .attr('transform', `translate(0, ${innerBoxHeight})`)
    .append('text')
    .text(state.viewerSelection)
 
  // + ADD EVENT LISTENERS (if you want)

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */

function draw() {
  let filteredData = state.gameData;
  // if there is a selectedParty, filter the data before mapping it to our elements
  if (state.gameSelection !== defaultGame) {
    filteredData = state.gameData.filter(d => d.Name === state.gameSelection);
  }
  dots = innerBox.selectAll('circle')
  .data(filteredData, d=> `${d.Name}_${d.Date}`)
  .join('circle')
  .attr('r', radius)
  .attr('cx', d => xScale(d["Twitch Viewership"]))
  .attr('cy', d => yScale(d.Peak24hrs))

}