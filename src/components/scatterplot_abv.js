import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import { margin, scatterWidth, scatterHeight } from './breakpoints';

function scatterplotABV(data, exists) {
	var json = {
		children: [
			{ name: '>3%', value: 0 },
			{ name: '3-5%', value: 0 },
			{ name: '5-7%', value: 0 },
			{ name: '7-9%', value: 0 },
			{ name: '9-11%', value: 0 },
			{ name: '11% >', value: 0 }
		]
	};

	data.map((d) => {
		if (d.abv < 3 / 100) json.children[0].value++;
		if (d.abv >= 3 / 100 && d.abv < 5 / 100) json.children[1].value++;
		if (d.abv >= 5 / 100 && d.abv < 7 / 100) json.children[2].value++;
		if (d.abv >= 7 / 100 && d.abv < 9 / 100) json.children[3].value++;
		if (d.abv >= 9 / 100 && d.abv < 11 / 100) json.children[4].value++;
		if (d.abv >= 11 / 100) json.children[5].value++;
	});

	var diameter = 450,
		color = d3.scaleOrdinal(d3.schemeDark2);

	var bubble = d3.pack().size([ diameter, diameter ]).padding(6);

	var margin = {
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	};

	if (exists === 'initialized') {
		var svg = d3
			.select('.scatterplot_abv')
			.append('svg')
			.attr('viewBox', '0 0 ' + (diameter + margin.right) + ' ' + diameter)
			.attr('width', diameter + margin.right)
			.attr('height', diameter)
			.attr('class', 'chart-svg');

		var root = d3
			.hierarchy(json)
			.sum(function(d) {
				return d.value;
			})
			.sort(function(a, b) {
				return b.value - a.value;
			});

		bubble(root);

		var node = svg
			.selectAll('.node')
			.data(root.children)
			.enter()
			.append('g')
			.attr('class', 'node')
			.attr('transform', function(d) {
				return 'translate(' + d.x + ' ' + d.y + ')';
			})
			.append('g')
			.attr('class', 'graph');

		node
			.append('circle')
			.attr('r', function(d) {
				return d.r;
			})
			.style('fill', function(d) {
				return color(d.data.name);
			});

		node
			.append('text')
			.attr('dy', '.3em')
			.style('text-anchor', 'middle')
			.style('font-size', `1.5rem`)
			.text(function(d) {
				return d.data.name;
			})
			.style('fill', 'black');

		svg.append('g').attr('class', 'legendOrdinal').attr('transform', 'translate(600,40)');
	} else if (exists === 'update') {
		console.log('update');
	}

	var legendOrdinal = legendColor()
		.shape('path', d3.symbol().type(d3.symbolSquare).size(150)())
		.shapePadding(10)
		.scale(color);

	svg.select('.legendOrdinal').call(legendOrdinal);
}

export default scatterplotABV;
