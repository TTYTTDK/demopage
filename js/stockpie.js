{
var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

var data = [
   {language:  "Python", value: 30},
   {language:  "Java", value: 20},
   {language:  "C/C++", value: 15},
   {language:  "Javascript", value: 35},
   {language:  "PHP", value: 15},];

colors=["#00A5E3","#FF96C5","#00CDAC","#FFA23A","#74737A"]  

var svg = d3.select("#oilpiefig") //create Svg element
            .append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", "0 0 400 400")
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            // .attr("transform","translate(50,0)");   

var chart=svg.append('g')
               // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
               .attr('width', width)
               .attr('height', height)

var pie=d3.pie() 
            .value(d => d.value)

var color_scale=d3.scaleOrdinal()
                  .domain(data.map(d=>d.language))
                  .range(colors)

let arc=d3.arc()
            .outerRadius(200)
            .innerRadius(100)



const tooltip = d3.select("#oilpiefig")
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



var p_chart=chart.selectAll("pie")
                  .data(pie(data))
                  .enter()
                  .append("g")
                  .attr('transform', 'translate(200,200)') 

p_chart.append("path")
         .attr("d",arc)
         .on('mouseover', function (e, d, i) {
            
            tooltip.html(
               `<div>Language: ${d.data.language}</div><div>Value: ${d.value}</div>`
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
            return color_scale(d.data.language);
         })
         
   






         
// p_chart.append("text")
//       .text(function(d){ return d.data.language})
//       .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  }) 
//       .style("text-anchor", "middle")
} 