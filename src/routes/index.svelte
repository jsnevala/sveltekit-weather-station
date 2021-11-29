<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from "svelte";

	import Chart from './Chart.svelte'

	import { variables } from '../variables.ts'


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
		}]
	}

	let latestTemp : Number = 0;
	let latestTime : Date = null;

	let url = "http://" + variables.url + variables.basePath +"?apiKey=" + variables.apiKey;

	onMount(async () => {
		fetch(url)
			.then(response => response.json())
			.then(data => {
				data.weatherData.sort((a, b) => {
					return a.timestamp > b.timestamp ? -1 : a.timestamp === b.timestamp ? 0 : 1;
				});

				latestTemp = data.weatherData[0].temperature;
				latestTime = new Date(data.weatherData[0].timestamp);

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
			Lämpötila
		</div>
	</h1>

	<div class="info">
		{ latestTemp } °C
	</div>
	<div class="date">
		{ latestTime }
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
