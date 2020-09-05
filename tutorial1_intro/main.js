d3.csv("../data/surveyResults.csv").then(data => {

const table = d3.select("#d3-table")
.style("border", "1px solid #000");


const thead = d3.select("#d3-table")
.append("thead");

const headers = thead.selectAll(".header") 
.data(data.columns)
.join("th")
.attr("class","header")
.text(d => d)
.style("border", "1px solid #000")
.style("padding-right", "30px");


const tbody = table.append("tbody");

const rows = tbody.selectAll(".row") 
.data(data)
.join("tr")
.attr("class","row");


const td = rows 
.selectAll("td")
.data(d => Object.values(d))
.join("td")
.attr("class", d => +d > 3 ? 'high' : null)
.text(d => d)
.style("border", "1px solid #000");
})