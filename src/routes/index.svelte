<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from "svelte";

	import Chart from './Chart.svelte'

	const options = {
		chart: {
			type: 'line',
			width: '100%'
		},
		colors: ['#00aeff', '#E91E63'],
		xaxis: {
			type: 'datetime'
		},
		yaxis: {
			type: 'numeric'
		},
		series: [{
			name: 'Ulkolämpötila',
			data: []
		},
		{
            name: 'Sisälämpötila',
            data: []
        }],
		noData: {
			text: "Ladataan...",
			align: 'center',
			verticalAlign: 'middle',
			offsetX: 0,
			offsetY: 0,
			style: {
				color: "#000000",
				fontSize: '16px',
				fontFamily: "Helvetica"
			}
		}
	}

	let latestOutsideTemp : Number = null;
	let latestOutsideTime : Date = null;
	let latestInsideTemp : Number = null;
	let latestInsideTime : Date = null;

	const url = '/.netlify/functions/WeatherData'

	function getLocationData(data, location) {
		let locationData = data.weatherData.filter(d => d.location === location);
		return locationData.sort((a, b) => {
			return a.timestamp > b.timestamp ? -1 : a.timestamp === b.timestamp ? 0 : 1;
		});
	}

	onMount(async () => {
		fetch(url)
			.then(response => response.json())
			.then(responseData => {
				const data = responseData.data;

				const outsideData = getLocationData(data, 'outside');
				const insideData = getLocationData(data, 'inside');

				latestOutsideTemp = outsideData[0].temperature.toFixed(2);
				latestOutsideTime = new Date(outsideData[0].timestamp);

				latestInsideTemp = insideData[0].temperature.toFixed(2);
				latestInsideTime = new Date(insideData[0].timestamp);

				options.series[0].data = outsideData
					.map(measurement => {
						return [measurement.timestamp, measurement.temperature]
					})
				options.series[1].data = insideData
						.map(measurement => {
							return [measurement.timestamp, measurement.temperature]
						})
			})
			.catch(error => {
				return [];
			}
		);
	});
</script>

<svelte:head>
	<title>Kråköboard</title>
</svelte:head>

<section>
	<h1>
		<div class="welcome">
			Lämpötila
		</div>
	</h1>

	<div class="info">
		{#if latestOutsideTemp != null && latestInsideTemp != null }
			<div>
				{ latestOutsideTemp } °C (ulko)
			</div>
			<div>
				{ latestInsideTemp } °C (sisä)
			</div>
		{:else}
			Ladataan...
		{/if}
	</div>
	<div class="date">
		<div>
			{ latestOutsideTime  ? latestOutsideTime.toLocaleString() : '' } (ulko)
		</div>
		<div>
			{ latestInsideTime ? latestInsideTime.toLocaleString() : '' } (sisä)
		</div>
	</div>

	<div class="chart">
		<Chart options={options}/>
	</div>

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 200 / 2048) 0;
	}

	.info {
		font-size: xxx-large;
		padding: 0 0 calc(100% * 200 / 2048) 0;
	}

	.date {
		font-size: medium;
		padding: 0 0 calc(100% * 100 / 2048) 0;
	}

	.chart {
		width: 100%;
        height: calc(100% * 500 / 2048);
	}

</style>
