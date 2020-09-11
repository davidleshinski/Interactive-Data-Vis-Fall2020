d3.csv("../data/surveyResults.csv").then(data => {

const table = d3.select("#d3-table")
.style("border-spacing", "0px")
.style("padding", "0 15% 15% 15%");


const thead = d3.select("#d3-table")
.append("thead");

const headers = thead.selectAll(".header") 
.data(data.columns)
.join("th")
.attr("class","header")
.text(d => d)
.style("border-top", "1px solid #c6c6c6")
.style("border-bottom", "1px solid #c6c6c6")
.style("background", "#e0e0e0")
.style("padding", "30px 30px");


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
.style("margin", "0px")
.style("border-top", "1px solid #c6c6c6")
.style("border-bottom", "1px solid #c6c6c6")
.style("background", "#CFEEFA")
.style("line-height", "1.5");

})