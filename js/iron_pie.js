{
const margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const colors = [
         "#681215", "#791519", "#8B181C", "#9D1B1F", "#ae1e22",
         "#c02126", "#d12329", "#dc2e33", "#de3f44", "#e15155",
      
         "#705c5c", "#7b6565", "#876e6e", "#917878", "#9a8484", 
         "#a38f8f", "#ac9a9a", "#b6a5a5", "#bfb0b0", "#c8bcbc",
         "#d1c7c7", "#dad2d2", "#e3dddd", "#ede9e9", "#f6f4f4",
         ];


const svg = d3.select(`#iron_pie`) //create Svg element
            .append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", "0 0 400 400")
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            // .attr("transform","translate(50,0)");

const tooltip = d3.select(`#iron_pie`)
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '1000')
            .style('visibility', 'hidden')
            .style('padding', '10px')
            .style('background', 'rgba(0,0,0,0.6)')
            .style('border-radius', '4px')
            .style('color', '#fff')
            .text('a simple tooltip');
         
         
d3.csv(`data/Pie_Chart/iron_adj.csv`).then( function(data) {

   var chart=svg.append('g')
                  // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                  .attr('width', width)
                  .attr('height', height)

   var pie=d3.pie() 
               .value(d => d.value)

   var color_scale=d3.scaleOrdinal()
                     .domain(data.map(d=>d.stockname))
                     .range(colors)

   let arc=d3.arc()
               .outerRadius(200)
               .innerRadius(100)

   var p_chart=chart.selectAll("pie")
                     .data(pie(data))
                     .enter()
                     .append("g")
                     .attr('transform', 'translate(200,200)') 

   p_chart.append("path")
            .attr("d",arc)
            .on('mouseover', function (e, d, i) {
               
               tooltip.html(
                  `<div>Stock: ${d.data.stockname}</div><div>Value: ${d.value}</div>`
               )
               .style('visibility', 'visible');
            })
            .on('mousemove', function (e) {
               

               tooltip.style('top', e.pageY - 200 + 'px')
                        .style('left', e.pageX - 800 + 'px');
            })
            .on('mouseout', function () {

               tooltip.html(``).style('visibility', 'hidden');
            })
            .attr("fill",d=>{
               return color_scale(d.data.stockname);
            })

   })

         
// p_chart.append("text")
//       .text(function(d){ return d.data.language})
//       .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  }) 
//       .style("text-anchor", "middle")
} 