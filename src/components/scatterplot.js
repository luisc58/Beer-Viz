import * as d3 from 'd3';
import { margin, scatterWidth, scatterHeight } from './breakpoints';

//consulted this histogram example
//https://bl.ocks.org/d3noob/96b74d0bd6d11427dd797892551a103c

//This scatterplot displays beers by their IBU and ABV. Note: not every beer has an IBU value (but every beer has an ABV)! That's why
//there are less data points in this chart than in the other ones.

function scatterplot(beers, exists) {
	let ibuBeers = []; //this is a new array that will only hold beers with that have an IBU data attribute

	beers.forEach((d) => {
		//if a beer has an ibu field that isn't blank, push it to the ibuBeer array
		if (d.ibu !== '') {
			ibuBeers.push(d);
		}
	});

	const width = scatterWidth - margin.left - margin.right;
	const height = scatterHeight - margin.top - margin.bottom;

	const x = d3
		.scaleLinear() //define x range
		.domain([ 0, 0.13 ]) //domain goes from 0% abv to 13% abv
		.range([ 0, width ]);

	const y = d3
		.scaleLinear() //define x range
		.domain([ 0, 140 ])
		.range([ height, 0 ]);

	const xAxis = d3.axisBottom().scale(x).ticks(13).tickFormat(d3.format(',.0%'));

	const yAxis = d3.axisLeft().scale(y).ticks(14);
	/////////

	if (exists === 'initialized') {
		const svg = d3
			.select('.scatterplot')
			.append('svg')
			.attr('id', 'scatterSVG')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		const selection = svg.selectAll('circle').data(ibuBeers);

		selection
			.enter()
			.append('circle')
			.attr('class', 'beer')
			.attr('cx', (d) => {
				return x(d.abv);
			})
			.attr('cy', (d) => {
				return y(d.ibu);
			})
			.attr('r', 5)
			.attr('stroke', 'black')
			.attr('stroke-width', 1)
			.attr('fill', 'black');

		//Create X axis
		svg.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);

		//text label for x axis
		svg
			.append('text')
			.attr('transform', `translate(${width / 2}, ${height + margin.top * 4})`)
			.style('text-anchor', 'middle')
			.style('font-size', `${width / 35}px`)
			.attr('fill', 'var(--black)')
			// .attr('textLength', 150)
			.text('Alcohol by Volume');

		// text label for the y axis
		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 0 - margin.left * 0.6)
			.attr('x', 0 - height / 2)
			.attr('fill', 'var(--black)')
			// .attr('textLength', 30)
			.style('text-anchor', 'middle')
			.style('font-size', `${width / 35}px`)
			.text('IBU');

		//Create Y axis
		svg.append('g').attr('class', 'axis').call(yAxis);
	} else if (exists === 'update') {
		//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
		////////////////////////
		///////////////////////////////////////////////////////////////
		/////////////////////
		//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
		const svg = d3.select('.scatterplot').select('svg').select('g');

		const t = d3.transition().duration(750);

		const selection = svg
			.selectAll('circle') //data join
			.data(ibuBeers);

		selection
			.transition(t) //update
			.attr('cx', (d) => {
				return x(d.abv);
			})
			.attr('cy', (d) => {
				return y(d.ibu);
			});

		selection
			.enter()
			.append('circle')
			.attr('class', 'beer')
			.transition(t)
			.attr('cx', (d) => {
				return x(d.abv);
			})
			.attr('cy', (d) => {
				return y(d.ibu);
			})
			.attr('r', 5)
			.attr('stroke', 'black')
			.attr('stroke-width', 1)
			.attr('fill', 'var(--beer_brown)');

		selection.exit().transition(t).attr('r', 0).remove();
	}

	d3.selectAll('.beer').on('mouseenter', function(d) {
		//reset all to brown
		d3.selectAll('.beer').attr('fill', 'var(--beer_brown)');

		//set current selected to blue
		d3.select(this).attr('fill', 'blue');

		d3.selectAll('.beerTooltip').transition().style('opacity', 0).remove();

		const beerCx = parseInt(d3.select(this).attr('cx'));
		const beerCy = parseInt(d3.select(this).attr('cy'));
		console.log(beerCy);

		const beerTooltip = d3
			.select('.scatterplot')
			.append('div')
			.attr('class', 'beerTooltip')
			.style('left', () => {
				if (beerCy > 94) {
					return `${beerCx + 60}px`;
				} else {
					return `${beerCx + 80}px`;
				}
			})
			.style('top', () => {
				if (beerCy > 370) {
					return `${beerCy - 200}px`;
				} else {
					return `${beerCy + 30}px`;
				}
			});

		const beerAttribute = (attributeName, attributeValue, color) => {
			const tooltipP = beerTooltip.append('p');

			tooltipP.append('span').html(`${attributeName}: `).attr('class', 'attributeName').style('color', color);

			tooltipP.append('span').html(attributeValue).attr('class', 'attributeValue').style('color', color);
		};

		beerAttribute('Name', d.name, 'var(--beer_brown');
		beerAttribute('Style', d.style);
		beerAttribute('Brewery', d.brewery_name);
		beerAttribute('Location', [ d.brewery_city, ' ' + d.brewery_state ]);
		beerAttribute('Ounces', d.ounces);
		beerAttribute('ABV', (d.abv * 100).toFixed(1) + ' %'); //rounds to percentage with 1 decimal place
		beerAttribute('IBU', d.ibu);
	});

	//this fades out the tooltip when the mouse leaves the svg

	d3.select('#scatterSVG').on('mouseleave', () => {
		d3.selectAll('.beerTooltip').transition().style('opacity', 0).remove();

		d3.selectAll('.beer').attr('fill', 'var(--beer_brown)');
	});
}

export default scatterplot;
