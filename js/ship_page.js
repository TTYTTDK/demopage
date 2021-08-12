{

//start for the line chart with checked-box
{

d3.select('#ship_up_stock_name').on('change', function() {

    d3.select("#ship_line_box").selectAll("div").remove()
    d3.select("#ship_line").selectAll("svg").remove()
    let upSelect = document.getElementById("ship_up_stock_name");
    let upValue = upSelect.options[upSelect.selectedIndex].value;
    checkeboxLinePlot(upValue);
})
checkeboxLinePlot("2603.TW");


function checkeboxLinePlot(upValue) {
    // 選單
    let boxLSTM = d3.select("#ship_line_box").append('div').attr("id","ship_LSTM")
                    .style("font-size", "20px").style("font-weight", "bold").append("br")

    //.style("display","inline").style("width","100%");
    //d3.select("#line_box").append("br")

    let boxGRU = d3.select("#ship_line_box").append('div').attr("id","ship_GRU")
                    .style("font-size", "20px").style("font-weight", "bold").append("br")
    //.style("display","inline").style("width","100%");

    // start chart
    const svgSize = {width: 820, height: 550};
    const margin = {top: 30, right: 160, bottom: 30, left:40};
    var width = svgSize.width - margin.left - margin.right,
        height = svgSize.height - margin.top - margin.bottom;


    // define chart margins
    let svg = d3.select("#ship_line")
                .append("svg")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", `0 0 ${svgSize.width} ${svgSize.height}`)
                .attr("width",svgSize.width)
                .attr("height",svgSize.height),
        g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // define time format
    var parseTime = d3.timeParse("%Y-%m-%d");

    // color scale
    // let	z = d3.scaleOrdinal(d3.schemeCategory10);
    let	z = d3.scaleOrdinal()
                .range(['#ea8c55','#cad2c5', '#c75146', '#84a98c', '#ad2e24',
                        '#52796f', '#81171b', '#354f52', '#540804', '#2f3e46'])


    // try to get option value
    // let upSelect = document.getElementById("up_stock_iron_name");
    // let upValue = upSelect.options[upSelect.selectedIndex].value;
    // console.log(upValue);

    // load data
    d3.csv(`data/Line_Chart_Data/${upValue}.csv`,type).then( data => {

        // parse data
        var stocks = data.columns.slice(1).map(id => {
            return {
                id: id,
                values: data.map(d => {
                    return {
                        date: d.date,
                        price: d[id]

                    };
                })
            };
        });


        // define x axis scale

        var x = d3.scaleTime()
                    .range([0, width])
                    .domain(d3.extent(data, d => d.date));

        // define y axis scale
        var y = d3.scaleLinear()
                    .range([height, 0])
                    .domain([
                        d3.min(stocks, c => d3.min(c.values, d => d.price)),
                        d3.max(stocks, c => d3.max(c.values, d => d.price))
                    ]);

        // define line
        var line = d3.line()
                    .curve(d3.curveBasis)
                    .x(d => x(d.date))
                    .y(d => y(d.price));

        // append x axis
        g.append("g")
            .attr("class", "axis axis-x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(12)) //改日期呈現方式
            .style("font-size","16px")
            .style("font-weight", "bold")
            .append("text")
            //.attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", width)
            .attr("dy", "1.5em")
            .attr("fill", "#000")
            .text("Date")
            .style("font-weight","bold") //字體加粗

        // append y axis
        g.append("g")
            .attr("class", "axis axis-y")
            .call(d3.axisLeft(y))
            .style("font-size","16px")
            .style("font-weight", "bold")
            .append("g")
            .append("text")
            .attr("transform", "rotate(-270)")
            .attr("y", -40)
            // .attr('text-anchor','end')
            .attr("x", 70)
            .attr("dy", "1.5em")
            .attr("fill", "#000")
            .text("Price ($)")

        // append chart name
        g.append("g")
            .append('text')
            .html(`${upValue.split(".")[0]} Stock Price`)
            .attr('x',width/2-30)
            .attr('y','-10')
            .style("font-weight","bold") //字體加粗
            .style('font-size','20px');

        // append stock data to svg
        let stock = g.selectAll(".stock")
                    .data(stocks)
                    .enter()
                    .append("g")
                    .attr("class", "stock")
        // 			d3.selectAll(".myCheckbox").on("change",update);
        // update();

        // append stock path to svg
        stock.append("path")
            .attr("class", "line")
            .attr("id", d => `ship_line-${d.id}`)
            .attr("d", d => line(d.values))
            .style("stroke", (d,i) => i==0 ? d="#000000" : d=z(d.id))
            .style("fill", "none")
            .style("stroke-width", "2px")
            //.style("stroke-linejoin", "round")
            //.style("stroke-linecap", "round")
            .attr("opacity", (d,i) => i==0 ? d=1 : d=0);


        // append stock labels to svg
        stock.append("text")
            .datum(d => { return {id: d.id, value: d.values[d.values.length - 1]}; })
            .attr("transform", d => { return `translate(${x(d.value.date)}, ${y(d.value.price)} )`; })
            .attr("x", 3)
            .attr('id', d => `ship_text-${d.id}`)
            //.attr("dy", "0.15em")
            .style("font", "16px sans-serif")
            .style("font-weight", "bold")
            .attr("opacity", (d,i) => i==0 ? d=1 : d=0)
            .text(d => d.id);
            
        // 選單

        // let boxLSTM = d3.select("body").append('div').attr("id","LSTM").style("display","inline").style("width","100%");
        // d3.select("body").append("br")
        // let boxGRU = d3.select("body").append('div').attr("id","GRU").style("display","inline").style("width","100%");
        
        for (let i = 1; i < stocks.length; i++) {
            var tick = document.createElement('input');
            tick.type = 'checkbox';
            tick.id = 'myCheckbox';
            tick.name = stocks[i].id;
            tick.value = stocks[i].id;

            var label = document.createElement('label');
            label.for = stocks[i].id
            label.appendChild(document.createTextNode(stocks[i].id));

            if ((i%2) !== 0){
                var divcheck = document.createElement('div');
                divcheck.id="model";
                // tick.appendChild(document.createTextNode(countries[i].id));
                divcheck.appendChild(tick);
                divcheck.appendChild(label);
                document.getElementById("ship_LSTM").appendChild(divcheck);
            } else{
                var divcheck = document.createElement('div');
                divcheck.id="model";
                // tick.appendChild(document.createTextNode(countries[i].id));
                divcheck.appendChild(tick);
                divcheck.appendChild(label);
                document.getElementById("ship_GRU").appendChild(divcheck);
            };

            tick.addEventListener("click", function() {

                var lineSelected = this.value;
                var svgline = d3.select(`#ship_line-${lineSelected}`);
                var textline = d3.select(`#ship_text-${lineSelected}`);
                // console.log(svgline);
                // console.log(textline);

                if(svgline.attr('opacity') === '0') {
                    // console.log('making it visible');
                    svgline.attr('opacity', 1);
                } else {
                    svgline.attr('opacity', 0);
                }

                if(textline.attr('opacity') === '0') {
                    // console.log('making it visible');
                    textline.attr('opacity', 1);
                } else {
                    textline.attr('opacity', 0);
                }
                this.style.background = '#555';
                this.style.color = 'white';

            });
        }

    });

    //bind with multiseries data
    function type(d, _, columns) {
        d.date = parseTime(d.date);
        //iterate through each column
        for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];

        //bind column data to date
        return d;
    }

}
}
// end for the line chart with checked-box


// *************************************************************************************************************************


// start for bar chart and line chart interaction
{

d3.select('#ship_down_stock_name').on('change', function() {

    d3.select("#ship_twochartOfbar").selectAll("svg").remove()
    d3.select("#ship_twochartOfbar").selectAll("div").remove()
    d3.select("#ship_twochartOfline").selectAll("svg").remove()
    d3.select("#ship_twochartOfline").selectAll("div").remove()

    let downSelect = document.getElementById("ship_down_stock_name");
    let downValue = downSelect.options[downSelect.selectedIndex].value;
    towChartInteraction(downValue);
})
towChartInteraction("2603.TW");



function towChartInteraction(downValue) {
    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 10, bottom: 120, left: 60},
            width = 550 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg1 = d3.select("#ship_twochartOfbar")
                    .append("svg")
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("viewBox", "0 0 550 600")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip1 = d3.select('#ship_twochartOfbar')
                        .append('div')
                        .attr('class', 'd3-tooltip')
                        .style('position', 'absolute')
                        .style('z-index', '50')
                        .style('visibility', 'hidden')
                        .style('padding', '10px')
                        .style('top', '30px')
                        .style('left', '125px')
                        .style('background', 'rgba(0,0,0,0.6)')
                        .style('border-radius', '4px')
                        .style('color', '#fff')
                        .style("font-weight", "bold")
                        .text('a simple tooltip');

    const svg2 = d3.select("#ship_twochartOfline")
                    .append("svg")
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("viewBox", "0 0 550 600")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip2 = d3.select('#ship_twochartOfline')
                    .append('div')
                    .attr('class', 'd3-tooltip')
                    .style('position', 'absolute')
                    .style('z-index', '50')
                    .style('visibility', 'hidden')
                    .style('padding', '10px')
                    .style('top', '30px')
                    .style('left', '125px')
                    .style('background', 'rgba(0,0,0,0.6)')
                    .style('border-radius', '4px')
                    .style('color', '#fff')
                    .style("font-weight", "bold")
                    .text('a simple tooltip');

    // Parse the Data
    d3.csv(`data/Single_Stock_RMSE_Bar_Data/Metrics_Score_rmse_${downValue}.csv`).then( function(data) {

        // X axis
        let x1 = d3.scaleBand()
                    .range([ 0, width])
                    .domain(data.map(d => d.model))
                    .padding(0.2);
        svg1.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x1))
            .selectAll("text")
            .style("font-size","16px")
            .style("font-weight", "bold")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        let y1 = d3.scaleLinear()
                    .domain([0, 75])
                    .range([ height, 0]);
        svg1.append("g")
            .call(d3.axisLeft(y1))
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

        // append chart name
        svg1.append("g")
            .append('text')
            .html(`${downValue.split(".")[0]} Stock RMSE Values`)
            .attr('x',width/2-100)
            .attr('y','-10')
            .style("font-weight","bold") //字體加粗
            .style('font-size','20px');

        // Bars
        svg1.selectAll("mybar")
            .data(data)
            .join("rect")
            .attr("x", d => x1(d.model))
            .attr("y", d => y1(d.rmsevalue))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y1(d.rmsevalue))
            .attr("id", d => `ship-bar-${d.model}`)  
            .attr("fill", "#004fa3")
            .style("opacity", 0.2)
            .on("mouseover", function (e, d, i){
            //  bar itself
            tooltip1.html(
                `<div>Model: ${d.model}</div><div>RMSE: ${round2(d.rmsevalue)}</div>`
            )
            .style('visibility', 'visible');

            d3.select(this).style("opacity", 1);

            // interactive with line 
            let tempid = this.id.split("-");
            d3.select(`#ship-line2chart-${tempid[2]}`).attr("opacity", 1);

            tooltip2.html(
                `<div>Model: ${tempid[2]}<br>Prediction Price</div>`
            )
            .style('visibility', 'visible');

            })
            .on("mouseout", function(d){
            //  bar itself
            tooltip1.html(``).style('visibility', 'hidden');

            d3.select(this).style("opacity", 0.2);
            
            // interactive with line
            let tempid = this.id.split("-");
            d3.select(`#ship-line2chart-${tempid[2]}`).attr("opacity", 0.1);

            tooltip2.html(``).style('visibility', 'hidden');
            
            });
    })

    // *****************************************************************************************
    // multi-line interactive chart

    //define time format
    var parseTime = d3.timeParse("%Y-%m-%d");

    //bind with multiseries data
    function type(d, _, columns) {
        d.date = parseTime(d.date);
        //iterate through each column
        for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];

        //bind column data to date
        return d;
    }

    //load data
    d3.csv(`data/Line_Chart_Data/${downValue}.csv`,type).then( data => {

        //parse data
        var stocks = data.columns.slice(1).map(function(id) {
            return {
            id: id,
            values: data.map(function(d) {
                return {
                    date: d.date,
                    price: d[id]
                };
            })
            };
        });

        // console.log(stocks)

        //define x axis scale
        var x = d3.scaleTime()
                    .range([0, width])
                    .domain(d3.extent(data, function(d) {
                        return d.date;
                    }));

        //define y axis scale
        var y = d3.scaleLinear()
                    .range([height, 0])
                    .domain([
                        d3.min(stocks, function(c) {
                        return d3.min(c.values, function(d) {
                            return d.price;
                        });
                        }),
                        d3.max(stocks, function(c) {
                        return d3.max(c.values, function(d) {
                            return d.price;
                        });
                        })
                    ]).nice();

        //define line
        var line = d3.line()
                    .curve(d3.curveBasis)
                    .x(function(d) {
                        return x(d.date);
                    })
                    .y(function(d) {
                        return y(d.price);
                    });

        //color scale
        let z = d3.scaleOrdinal(d3.schemeCategory10);

        //define color scale
        z.domain(stocks.map(function(c) {
            return c.id;
        }));

        //append x axis
        svg2.append("g")
            .attr("class", "axis axis-x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(12)) //改日期呈現方式
            .selectAll("text")
            .style("font-size","18px")
            .style("font-weight", "bold")
            

        //append y axis
        svg2.append("g")
            .attr("class", "axis axis-y")
            .call(d3.axisLeft(y))
            .style("font-size","16px")
            .style("font-weight", "bold")
            .append("g")
            .append("text")
            .attr("transform", "rotate(-270)")
            .attr("y", -40)
            // .attr('text-anchor','end')
            .attr("x", 70)
            .attr("dy", "1.5em")
            .attr("fill", "#000")
            .text("Price ($)")


        // append chart name
        svg2.append("g")
            .append('text')
            .html(`${downValue.split(".")[0]} Stock Price`)
            .attr('x',width/2-80)
            .attr('y','-10')
            .style("font-weight","bold") //字體加粗
            .style('font-size','20px');
            

        // //append chart name
        // svg2.append("g")
        //       .append('text')
        //       .html('1301 Stock Price')
        //       .attr('x',width/2)
        //       .attr('y','-10')
        //       .style("font-weight",700) //字體加粗
        //       .style('font-size','14px');



        //append stock data to svg
        let stock = svg2.selectAll(".stock")
                        .data(stocks)
                        .enter()
                        .append("g")
                        .attr("class", "stock")
        // 			d3.selectAll(".myCheckbox").on("change",update);
        // update();

        // append stock path to svg
        stock.append("path")
            .attr("class", "line")
            .attr("id", d =>`ship-line2chart-${d.id}`)
            .attr("d", d => line(d.values))
            .style("stroke", (d,i) => i==0 ? d='#000000' : d="#004fa3")
            .style("fill", "none")
            .style("stroke-width", "3px")
            .style("stroke-linejoin", "round")
            .style("stroke-linecap", "round")
            .attr("opacity", (d,i) => i==0 ? d=1 : d=0.1)
            .on("mouseover", function(d){

                let tempid = this.id.split("-")

                // line itself
                d3.select(this).attr("opacity", 1);

                if (this.id != "ship-line2chart-Historical") {

                    tooltip2.html(
                        `<div>Model: ${tempid[2]}<br>Prediction Price</div>`
                    )
                    .style('visibility', 'visible');

                } else {
                    tooltip2.html(
                        `<div>Historical Price</div>`
                    )
                    .style('visibility', 'visible');
                }
            
                // interactive with bar
                
                d3.select(`#ship-bar-${tempid[2]}`).style("opacity", 1);

                if (this.id != "ship-line2chart-Historical") {
                    tooltip1.html(
                        `<div>Model: ${tempid[2]}</div>`
                    )
                    .style('visibility', 'visible');
                }
            })
            .on("mouseout", function(d){

                // line itself
                if (this.id != "ship-line2chart-Historical") {
                    d3.select(this).attr("opacity", 0.1);
                } 

                tooltip2.html(``).style('visibility', 'hidden');
                
                // interactive with bar
                let tempid = this.id.split("-")
                d3.select(`#ship-bar-${tempid[2]}`).style("opacity", 0.2);

                tooltip1.html(``).style('visibility', 'hidden');
            })

        

    })

}

}

// end for bar chart and line chart interaction 
}