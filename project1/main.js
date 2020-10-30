/**
 * CONSTANTS AND GLOBALS
 * */
const radius = 5,
 width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.6,
  margin = { top: 50, bottom: 30, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let g;
let color;
 
let state = {
  accountData: null,
  gameData: null,
  gameSelection: "All",
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

    const selectElement = d3.select("#dropdown").on("change", function() {
        console.log(this.value)
             state.gameSelection = this.value
             console.log("new value is", this.value);
              draw();
         });
    
    options = selectElement.selectAll('option')
    .data(["All",
        ...Array.from(new Set(state.gameData.map(d => d.Name)))])
    .join('option')
    .attr("value", d => d)
    .text(d => d);
 
  // + ADD EVENT LISTENERS (if you want)

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */

 // --------------------------- geo hover tooltip ----------------------------

function draw() {
}