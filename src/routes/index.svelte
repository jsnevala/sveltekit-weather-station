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
		xaxis: {
			type: 'datetime'
		},
		yaxis: {
			type: 'numeric'
		},
		series: [{
			name: 'temperature',
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

	let latestTemp : Number = null;
	let latestTime : Date = null;

	let location = '';

	const url = '/.netlify/functions/WeatherData'

	onMount(async () => {
		fetch(url)
			.then(response => response.json())
			.then(responseData => {
				const data = responseData.data;

				data.weatherData.sort((a, b) => {
					return a.timestamp > b.timestamp ? -1 : a.timestamp === b.timestamp ? 0 : 1;
				});

				latestTemp = data.weatherData[0].temperature;
				latestTime = new Date(data.weatherData[0].timestamp);
				location = data.weatherData[0].location;

				options.series[0].data = data.weatherData
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
			Lämpötila: { location }
		</div>
	</h1>

	<div class="info">
		{#if latestTemp != null }
			{ latestTemp } °C
		{:else}
			Ladataan...
		{/if}
	</div>
	<div class="date">
		{ latestTime  ? latestTime.toLocaleString() : '' }
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
