d3.csv("../data/Iris.csv").then(data => {

const table = d3.select("#d3-table")
.style("border-spacing", "0px")
.style("width", "65%")
// .style("height", "800px")
.style("padding", "18px")
.style("background", "#c6c6c6")
.style("margin", "0 auto");


const thead = d3.select("#d3-table")
.append("thead");

const headers = thead.selectAll(".header") 
.data(data.columns)
.join("th")
.attr("class","header")
.text(d => d)
.style("border-left", "1px solid #c6c6c6")
.style("border-right", "1px solid #c6c6c6")
.style("background", "#e0e0e0")
.style("padding", "5px 30px");


const tbody = table.append("tbody");

const rows = tbody.selectAll(".row") 
.data(data)
.join("tr")
.attr("class","row");


const td = rows 
.selectAll("td")
.data(d => Object.values(d))
.join("td")
.attr("class", d => d > 7 && d < 8 ? 'high' : null)
.text(d => d)
.style("margin", "0px")
.style("border-right", "1px solid #c6c6c6")
.style("border-left", "1px solid #c6c6c6")
.style("border-top", "1px solid #c6c6c6")
.style("background", "#CFEEFA")
// .style("line-height", "1.5")
.style("padding", "10px 0");

})