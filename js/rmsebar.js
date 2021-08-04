// set the dimensions and margins of the graph
const margin = {top: 10, right: 10, bottom: 80, left: 35},
      width = 1100 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#rmsebar")
              .append("svg")
              .attr("preserveAspectRatio", "xMidYMid meet")
              .attr("viewBox", "0 0 1100 600")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("data/All_Metrics_Score_rmse_flat_table.csv").then( function(data) {

  console.log(data.columns.slice(1,3).concat(data.columns.slice(5,7)))


  // List of subgroups = header of the csv files = soil condition here
  let subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  let groups = data.map(d => d.name)

  // Add X axis
  let x = d3.scaleBand()
              .domain(groups)
              .range([0, width])
              .padding([0.15])
  svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .style("font-size","14px")
      .style("font-weight", "bold")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  let y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d3.max(subgroups, key => +d[key]))]).nice()
            .range([height, 0 ]);
  svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size","14px")
      .style("font-weight", "bold");

  // Another scale for subgroup position?
  let xSubgroup = d3.scaleBand()
                    .domain(subgroups)
                    .range([0, x.bandwidth()])
                    .padding([0.03])

  // color palette = one color per subgroup
  let color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#ea8c55','#cad2c5','#c75146','#84a98c', '#ad2e24','#52796f','#81171b','#354f52','#540804','#2f3e46'])


  // Show the bars
  svg.append("g")
      .selectAll("g")
    // Enter in data = loop group per group
      .data(data)
      .join("g")
      .attr("transform", d => `translate(${x(d.name)}, 0)`)
      .selectAll("rect")
      .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
      .join("rect")
      .attr("x", d => xSubgroup(d.key))
      .attr("y", d => y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key));

})