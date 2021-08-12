{
// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 100, left: 50},
      width = 1100 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#rmsebar")
              .append("svg")
              .attr("preserveAspectRatio", "xMidYMid meet")
              .attr("viewBox", "0 0 1100 600")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left},${margin.top})`);

// tooltip setup 
var tooltip = d3.select('#rmsebar')
                .append('div')
                .style('position', 'absolute')
                .style('z-index', '10')
                .style('visibility', 'hidden')
                .style('padding', '10px')
                .style('background', 'rgba(0,0,0,0.6)')
                .style('border-radius', '4px')
                .style('color', '#fff')
                .text('a simple tooltip');

// Parse the Data
d3.csv("data/All_RMSE_Data/All_Metrics_Score_rmse_flat_table.csv").then( function(data) {

  // arrange the data to ardata
  let ardata = []
  for(let i = 0; i < data.length; i++) {

    // console.log(data[i].GRU_F5_TI189)

    ardata.push({
      "name": data[i].name,
      "rmse": [round2(data[i].LSTM_F5_TI189), round2(data[i].LSTM_F5_XGBTI15), round2(data[i].LSTM_F5_Futures), 
                round2(data[i].LSTM_F5_Category), round2(data[i].LSTM_F5_Nothing),  
                round2(data[i].GRU_F5_TI189), round2(data[i].GRU_F5_XGBTI15), round2(data[i].GRU_F5_Futures), 
                round2(data[i].GRU_F5_Category), round2(data[i].GRU_F5_Nothing)]
    })
  }

  // console.log(ardata)


  let ids = ["LSTM_F5_TI189", "LSTM_F5_XGBTI15", "LSTM_F5_Futures",
              "LSTM_F5_Category", "LSTM_F5_Nothing", 
              "GRU_F5_TI189", "GRU_F5_XGBTI15", "GRU_F5_Futures", 
              "GRU_F5_Category", "GRU_F5_Nothing"]

  let checkboxes = ["LSTM_F5_TI189", "LSTM_F5_XGBTI15", "LSTM_F5_Futures",
                    "LSTM_F5_Category", "LSTM_F5_Nothing", 
                    "GRU_F5_TI189", "GRU_F5_XGBTI15", "GRU_F5_Futures", 
                    "GRU_F5_Category", "GRU_F5_Nothing"]

  // X axis
  let x0 = d3.scaleBand()
              .range([0, width])

  let xAxis = d3.axisBottom(x0).tickSize(0)

  // Y axis
  let y = d3.scaleLinear()
            .range([height, 0]);

  let yAxis = d3.axisLeft(y)

  // Another scale for 10 rmse value
  let x1 = d3.scaleBand()

  // color palette = one color per subgroup
  let color = d3.scaleOrdinal()
                .range(['#ea8c55','#c75146', '#ad2e24','#81171b','#540804',
                        '#cad2c5','#84a98c', '#52796f','#354f52','#2f3e46'])


// for single checkbox 
  d3.select('.rmsefivekind').selectAll('.fivekind').on('change', function() {

    let fivecheck = document.querySelectorAll('.fivekind:checked')
    let ids = []
    for(let i = 0; i < fivecheck.length; i++) {
      ids.push(fivecheck[i].id)
    }
    updateGraph(ids);
  });
  renderGraph();

// for all checkbox
  d3.select('.rmsefivekind').selectAll('#checkall').on('change', function() {

    let allcheck = document.querySelectorAll('#checkall:checked')   
    let ids = []

    if (allcheck.length == 1) {
      ids = ["LSTM_F5_TI189", "LSTM_F5_XGBTI15", "LSTM_F5_Futures",
              "LSTM_F5_Category", "LSTM_F5_Nothing", 
              "GRU_F5_TI189", "GRU_F5_XGBTI15", "GRU_F5_Futures", 
              "GRU_F5_Category", "GRU_F5_Nothing"]
    }  
    updateGraph(ids);
  });
  renderGraph();

// function definition
  function renderGraph() {

    y.domain([0, 0]);
    x0.domain(ardata.map(d => d.name));
    x1.domain(checkboxes).range([0, x0.bandwidth()]);
  
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size","16px")
        .style("font-weight", "bold")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .style("font-size","16px")
        .style("font-weight", "bold")
        .append("g")
        .append("text")
        .attr("transform", "rotate(-270)")
        .attr("y", -40)
        // .attr('text-anchor','end')
        .attr("x", 50)
        .attr("dy", "1.5em")
        .attr("fill", "#000")
        .text("RMSE");  
  }

  function updateGraph(selectedIds) {

    let rmsedata = ardata.map(function(rmsedata){
      return {
        name: rmsedata.name,
        checkbox: selectedIds.map(function(selectedId) {
          let index = ids.findIndex(function(id) {
            return selectedId === id;
          });
          return {
            id : ids[index],
            other: checkboxes[index],
            value: rmsedata.rmse[index]
          };
        })
      }
    });

    // console.log(rmsedata)
    
    y.domain([0, d3.max(rmsedata, d => d3.max(d.checkbox, d => +d.value ))]).nice();
    x0.domain(rmsedata.map(d => d.name)).padding([0.07]);
    x1.domain(selectedIds).range([0, x0.bandwidth()]);

    svg.selectAll('.axis.x').call(xAxis);

    svg.selectAll('.axis.y')
        .call(yAxis)
        .style("font-size","16px")
        .style("font-weight", "bold")
        .append("g")
        .append("text")
        .attr("transform", "rotate(-270)")
        .attr("y", -40)
        // .attr('text-anchor','end')
        .attr("x", 50)
        .attr("dy", "1.5em")
        .attr("fill", "#000")
        .text("RMSE");

    let name = svg.selectAll(".name")
                  .data(rmsedata);

    name.enter().append("g") 
        .attr("class", "name")
        .attr("transform", d => `translate(${x0(d.name)}, 0)`);

    let rmse = name.selectAll("rect")
            .data(d => d.checkbox);

    rmse.enter().append("rect")
        .attr('width', 0)
        .attr("y", d => y(d.value))
        .attr("x", d => x1(d.id))
        .attr("id", d => d.id)
        .style("fill", d => color(d.other))
        .attr("width", d => x1.bandwidth())
        .attr("height", d => height - y(d.value))
        .on('mouseover', function (e, d, i) {
          tooltip
            .html(
              `<div>Model: ${d.id}</div><div>Value: ${d.value}</div>`
            )
            .style('visibility', 'visible');
        })
        .on('mousemove', function (e) {
          tooltip

            .style('top', e.clientY - 200 + 'px')
            .style('left', e.clientX - 300  + 'px');
        })
        .on('mouseout', function (e) {
          tooltip.html(``).style('visibility', 'hidden');
        })

    rmse.attr("y", d => y(d.value))
        .attr("x", d => x1(d.id))
        .attr("id", d => d.id)
        .style("fill", d => color(d.other))
        .text(function(d) { return d.other })
        .attr("width", d => x1.bandwidth())
        .attr("height", d => height - y(d.value))


    rmse.exit().attr("width", 0).remove();   

  }
})
}
