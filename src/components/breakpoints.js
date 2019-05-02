// this file creates breakpoints and sizes the charts

//first, I get the window dimensions

const wW = window.innerWidth;

//then, I define a margin

export const margin = {
	top: 10,
	right: 30,
	bottom: 50,
	left: 60
};

//geomap dimensions
export let mapWidth;
export let mapHeight;

//histograms dimensions
export let histWidth;
export let histHeight;

//scatterplot dimenions
export let scatterWidth;
export let scatterHeight;

//desktop
if (wW >= 768) {
	//1.4 ratio
	mapWidth = document.querySelector('.map').clientWidth; //700
	mapHeight = mapWidth / 1.4; //500

	//1.5 ratio
	histWidth = document.querySelector('.abv').clientWidth; //336
	histHeight = histWidth / 1.5; //222

	//1.3 ratio
	scatterWidth = document.querySelector('.scatterplot').clientWidth; //692
	scatterHeight = scatterWidth / 1.3; //535

	//phone
} else if (wW < 768) {
	mapWidth = 250;
	mapHeight = 222;
	// mapWidth = document.querySelector('.map').clientWidth;

	histWidth = 250;
	histHeight = 222;

	scatterWidth = 250;
	scatterHeight = 222;
}
