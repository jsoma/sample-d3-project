import * as d3 from 'd3'

var margin = {
  top: 0,
  right: 20,
  bottom: 30,
  left: 20
}

var width = 500 - margin.left - margin.right
var height = 400 - margin.top - margin.bottom

// You'll probably need to edit this one
var svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Here are some scales for you
const xPositionScale = d3
  .scaleLinear()
  .domain([0, 80000])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([30, 85])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range(['#b2e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae'])

d3.csv(require('./countries.csv')).then(ready)

function ready(datapoints) {
  console.log('Data is', datapoints)

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('cx', d => {
      return xPositionScale(d.gdp_per_capita)
    })
    .attr('cy', d => {
      return yPositionScale(d.life_expectancy)
    })
    .attr('fill', d => {
      return colorScale(d.continent)
    })
    .on('mouseover', (d, i, nodes) => {
      d3.select(nodes[i]).attr('fill', 'black')
      d3.select('#name').text(d.country)
      d3.select('#life').text(d.life_expectancy)
      d3.select('#GDP').text(d.gdp_per_capita)
      d3.select('#info').style('display', 'block')
    })
    .on('mouseout', function(d) {
      d3.select(this).attr('fill', colorScale(d.continent))
      d3.select('#info').style('display', 'none')
    })

  var yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()

  var xAxis = d3.axisBottom(xPositionScale).ticks(7)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}
