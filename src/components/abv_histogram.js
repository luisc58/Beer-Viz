import * as d3 from 'd3';
import { histWidth, histHeight, margin } from './breakpoints';

//consulted this histogram example
//https://bl.ocks.org/d3noob/96b74d0bd6d11427dd797892551a103c

//this module makes a histogram out of the beers. they are organized ("binned")
//according to their alcohol by volume.

function abvHistogram(beers, exists) {
	//dimensions and margins of plot
	const margin = {
		top: 10,
		right: 30,
		bottom: 50,
		left: 60
	};

	const width = histWidth - margin.left - margin.right;
	const height = histHeight - margin.top - margin.bottom;

	const x = d3
		.scaleLinear() //define x range
		.domain([ 0, 0.13 ]) //domain goes from 0% abv to 13% abv
		.range([ 0, width ]);

	const y = d3
		.scaleLinear() //define y range
		.range([ height, 0 ]);

	const histogram = d3
		.histogram() //start the histogram process
		.value((d) => d.abv) //the values in the histogram are the ABV of each beer
		.domain(x.domain())
		.thresholds(13);

	const bins = histogram(beers); //this creates the bins out of the data

	//define the y domain here
	y.domain(d3.extent(bins, (d) => d.length)).nice();

	if (exists === 'initialized') {
		//creating the svg and the g element
		const svg = d3
			.select('.abv')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.bottom + margin.top)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		//add the bar rectangles to the svg
		const selection = svg.selectAll('rect').data(bins); //data join each bin to each rectangle

		selection
			.enter()
			.append('rect')
			.attr('class', 'bar') //give rectange class of bar
			.attr('x', (d) => x(d.x0)) //x position of 1?
			.attr('y', (d) => y(d.length))
			.attr('width', (d) => {
				return x(d.x1) - x(d.x0) - 1; //calculate the width of each bin by substracting the max value and min value for the bins
			})
			.attr('height', (d) => {
				return height - y(d.length);
			})
			.attr('fill', 'var(--abv_blue)');

		//add x axis
		svg
			.append('g') //appends a new g element
			.attr('transform', `translate(0, ${height})`) //translates the x axis to the bottom of the plot
			.call(d3.axisBottom(x).tickFormat(d3.format(',.0%'))); //formats the x axis labels to percent

		d3.selectAll('.tick>text').each(function(d, i) {
			d3.select(this).style('font-size', `${parseInt(width / 50)}px`);
		});

		// text label for the x axis
		svg
			.append('text')
			.attr('transform', `translate(${width / 2}, ${height + margin.top * 4})`)
			.style('text-anchor', 'middle')
			.attr('fill', 'steelblue')
			// .attr('textLength', 110)
			.attr('class', 'chartSubtitle')
			.text('Alcohol by Volume');

		//add y axis
		const yAxis = svg
			.append('g') //appends a new g element
			.attr('id', 'yAxis')
			.call(d3.axisLeft(y));

		// text label for the y axis
		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 0 - margin.left * 0.65)
			.attr('x', 0 - height / 2)
			.style('text-anchor', 'middle')
			// .attr('textLength', 110)
			.attr('class', 'chartSubtitle')
			.text('Number of Beers');

		svg
			.append('text')
			.attr('x', width * 0.6)
			.attr('y', height * 0.02)
			.attr('fill', 'steelblue')
			.style('font-style', 'italic')
			.style('font-size', `10px`)
			.text('Histogram of beers by ABV.');
	} else if (exists === 'update') {
		function calculateNumberOfTicks() {
			// this function calculates the max bin length to provide a number to axis.ticks()

			const binsLengthArray = []; //this array will hold all the bin lengths

			bins.forEach((d) => {
				//this pushes each bin length to the bin lengths array
				binsLengthArray.push(d.length);
			});

			const maxBinLength = Math.max.apply(null, binsLengthArray); //this finds the largest bin length in the array of bin lengths

			if (maxBinLength >= 10) {
				return 10; //if the max bin length is greater or equal to 10, set the number of ticks to 10
			} else {
				return maxBinLength; //if the max bin length is less than 10, set the number of ticks to the highest bin length
			}
		}

		const svg = d3.select('.abv').select('svg').select('g');

		//add the bar rectangles to the svg
		const selection = svg
			.selectAll('rect')
			.data(bins) //data join each bin to each rectangle
			.transition()
			.attr('y', (d) => y(d.length))
			.attr('height', (d) => {
				return height - y(d.length);
			});

		//update y axis
		svg
			.select('#yAxis')
			.transition()
			.call(d3.axisLeft(y).tickFormat(d3.format('d')).ticks(calculateNumberOfTicks()));
	}
}
export default abvHistogram;
