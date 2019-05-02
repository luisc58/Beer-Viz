import * as d3 from 'd3';
import {histWidth, histHeight, margin} from './breakpoints';

//consulted this histogram example
//https://bl.ocks.org/d3noob/96b74d0bd6d11427dd797892551a103c

//this module makes a histogram out of the beers. they are organized ("binned")
//according to their IBU (bitterniess).

function ibuHistogram(beers, exists) {

  let ibuBeers = []; //this is a new array that will only hold beers with that have an IBU data attribute

  beers.forEach(d =>{ //if a beer has an ibu field that isn't blank, push it to the ibuBeer array
    if (d.ibu != "") {
      ibuBeers.push(d);
    }
  });

  const width = histWidth - margin.left - margin.right;
  const height = histHeight - margin.top - margin.bottom;

  const x = d3.scaleLinear() //define x range
    .domain([0, 140])
    .range([0, width]);

  const y = d3.scaleLinear() //define y range
    .range([height, 0]);

  const histogram = d3.histogram() //start the histogram process
    .value(d => d.ibu) //the values in the histogram are the IBU of each beer. /do i have to parseInt here? (ask )
    .domain(x.domain()) //create the domain here? confused about this (ask )
    .thresholds(14);//these are the x0 and x1 IBU thresholds for each bin

  const bins = histogram(ibuBeers); //this creates the bins out of the data

  //define the y domain here
  y.domain(d3.extent(bins, d => d.length)).nice();

  if (exists === 'initialized')  {

    //creating the svg and the g element
    const svg = d3.select('.ibu').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.bottom + margin.top)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    //add the bar rectangles to the svg
    const selection = svg.selectAll('rect')
      .data(bins) //data join each bin to each rectangle

      selection.enter()
      .append('rect')
      .attr('class', 'bar') //give rectange class of bar
      .attr('fill', '#b44663')
      .attr('x', d => x(d.x0)) //x position of 1?
      .attr('y', d => y(d.length))
      .attr('width', d => {
        return x(d.x1) - x(d.x0) - 1; //calculate the width of each bin by substracting the max value and min value for the bins.
      })
      .attr('height', d => {
        return height - y(d.length);
      });

      //add x axis
      svg.append('g') //appends a new g element
        .attr('transform', `translate(0, ${height})`) //translates the x axis to the bottom of the plot
        .call(d3.axisBottom(x)); //formats the x axis labels to percent
        //D3 axis generator. Generates an axis based on the x scale

      //adjust axis tick labels

      // d3.selectAll('.tick>text')
      //   .each(function(d,i) {
      //     d3.select(this).style('font-size', '100%');
      //   })

      // text label for the x axis
      svg.append("text")
          .attr("transform", `translate(${(width/2)}, ${height + margin.top * 4})`)
          .style("text-anchor", "middle")
          .attr('fill', 'var(--ibu_red)')
          // .attr('textLength', 22)
          .attr('class', 'chartSubtitle')
          .text("IBU")

      //add y axis
      const yAxis = svg.append('g') //appends a new g element
        .attr('id', 'yAxis')
        .call(d3.axisLeft(y));

      // text label for the y axis
      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr('y', 0 - margin.left * .65)
          .attr('x', 0 - (height/2))
          .style("text-anchor", "middle")
          // .attr('textLength', 110)
          .attr('class', 'chartSubtitle')
          .text("Number of Beers");

      svg.append('text')
          .attr('x', width * .99)
          .attr('y', height * .01)
          .attr('fill', '#b44663')
          .style('font-style', 'italic')
          // .attr('textLength', 250)
          .attr('class', 'ibuDesc')
          .text('Beers with higher IBU are more bitter.')
          .style('text-anchor', 'end');

      //adjust axis tick labels - this controls both abv and ibu tick labels!

      d3.selectAll('.tick>text')
        .each(function(d,i) {
          d3.select(this).style('font-size', `${width / 35}px`).attr('letter-spacing', .27);
        })

  } else if (exists === 'update') {

      function calculateNumberOfTicks() { // this function calculates the max bin length to provide a number to axis.ticks()

      const binsLengthArray = []; //this array will hold all the bin lengths

      bins.forEach(d => { //this pushes each bin length to the bin lengths array
        binsLengthArray.push(d.length)
      })

      const maxBinLength = Math.max.apply(null, binsLengthArray); //this finds the largest bin length in the array of bin lengths

      if (maxBinLength >= 10) {
        return 10; //if the max bin length is greater or equal to 10, set the number of ticks to 10
      } else {
        return maxBinLength; //if the max bin length is less than 10, set the number of ticks to the highest bin length
        }
      }

      const svg = d3.select('.ibu')
        .select('svg')
        .select('g')

      //add the bar rectangles to the svg
      const selection = svg.selectAll('rect')
        .data(bins) //data join each bin to each rectangle
        .transition()
        .attr('y', d => y(d.length))
        .attr('height', d => {
          return height - y(d.length);
        })

        //update y axis
        svg.select('#yAxis')
          .transition()
          .call(
            d3.axisLeft(y)
            .tickFormat(d3.format('d'))
            .ticks(calculateNumberOfTicks())
          );
      }
  }

  export default ibuHistogram;
