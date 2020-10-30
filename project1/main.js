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
  hover: {
    Latitude: null, 
    Longitude: null,
    State: null,
  }
};


/**
 --------------------------- LOAD DATA ------------------------------
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../"),
  d3.csv("../", d3.autoType),
]).then(([,]) => {
  // + SET STATE WITH DATA
//   state.geojson = geojson
//   state.heatData = heatData
  console.log();
  console.log();
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
 
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