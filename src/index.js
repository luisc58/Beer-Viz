import { nest } from 'd3-collection';
import { csv, json } from 'd3-fetch';

import('./style/style.scss');
import('./style/grid_style.scss');

const dataFiles = [ './data/beers.csv', './data/breweries.csv' ];
const promises = [];

dataFiles.forEach((url) => {
	promises.push(csv(url)); //this parses the csv file and pushes it to the array
});

promises.push(json('./data/us-states.json')); //this parses the json file and pushes it to the array

//import modules
import geoMap from './components/geomap';
import mapTest from './components/map';
//make promise and export it

Promise.all(promises)
	.then((data) => {
		//here, I am combining the two arrays in the promise into one big array of beer objects
		data[0].forEach((beer) => {
			const breweryid = beer.brewery_id;
			data[1].forEach((brewery) => {
				if (parseInt(breweryid) == parseInt(brewery.id)) {
					beer.brewery_name = brewery.name;
					beer.brewery_city = brewery.city;
					beer.brewery_state = brewery.State;
				}
			});
		});
		const beers = data[0]; //beer data
		const breweries = data[1]; //brewery data
		const json = data[2]; //geojson data

		const breweriesPerState = nest().key((d) => d.State).rollup((value) => value.length).entries(breweries);

		const breweriesPerStateValues = breweriesPerState.map((d) => d.value);

		const beersPerState = nest().key((d) => d.brewery_state).rollup((value) => value.length).entries(beers);

		const breweriesPerCity = nest().key((d) => d.c_d).rollup((value) => value.length).entries(breweries);

		breweriesPerCity.forEach((d) => {
			d.breweryList = [];
			breweries.forEach((dd) => {
				if (d.key === dd.c_d) {
					d.long = dd.Longitude;
					d.lat = dd.Latitude;
					d.city = dd.city;
					d.state = dd.state;
					d.breweryList.push(dd.name);
				}
			});
		});

		const breweriesPerCityValues = [];

		breweriesPerCity.forEach((d) => {
			breweriesPerCityValues.push(d.value);
		});

		breweriesPerState.forEach((d) => {
			const dataState = d.key;
			const dataValue = d.value;

			json.features.forEach((j) => {
				const jsonState = j.properties.name;

				if (dataState == jsonState) {
					j.properties.value = dataValue;
				}
			});
		});
		mapTest();

		geoMap(
			beersPerState,
			breweriesPerCity,
			breweriesPerState,
			breweriesPerCityValues,
			breweriesPerStateValues,
			json,
			beers,
			breweries
		);
	})
	.catch((err) => console.log(err));
