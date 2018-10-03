import * as d3 from 'd3';

interface Margin {
	top: number,
	right: number, 
	bottom: number, 
	left: number
}

interface TSVRaw {
	day: string,
	hour: string,
	value: string
}

// There must be a way to make TSVRaw and TSVimported the same thing
interface TSVImported {
	day: number,
	hour: number,
	value: number
}
export default class HeatmapProcessor {
	public margin: Margin
	public width: number
	public height: number
	public gridSize: number
	public legendElementWidth: number
	public buckets: number
	public colors: string[]
	public days: string[]
	public times: string[]
	public datasets: string[]

	public constructor() {
		this.margin = { top: 50, right: 0, bottom: 100, left: 30 };
		this.width = 960 - this.margin.left - this.margin.right;
		this.gridSize = Math.floor(this.width / 24);
		this.legendElementWidth = this.gridSize*2;
		this.buckets = 9;
		this.colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]
		this.days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
		this.times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"]
		this.datasets = ["data.tsv", "data2.tsv"];
	}

	public svg(): any {
		return d3.select("#chart").append("svg")
		    .attr("width", this.width + this.margin.left + this.margin.right)
		    .attr("height", this.height + this.margin.top + this.margin.bottom)
		    .append("g")
		    .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
	}

	public dayLabels(): void {
		this.svg().selectAll(".dayLabel")
		    .data(this.days)
		    .enter().append("text")
		      .text((d: string) => d)
		      .attr("x", 0)
		      .attr("y", (d: string, i: number) => i * this.gridSize)
		      .style("text-anchor", "end")
		      .attr("transform", `translate(-6,${this.gridSize / 1.5})`)
		      .attr("class", (d: string, i: number) => ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"));
	}

	public timeLabels(): void {
		this.svg().selectAll(".timeLabel")
		    .data(this.times)
		    .enter().append("text")
		      .text((d: string) => d)
		      .attr("x", (d: string, i: number) => i * this.gridSize)
		      .attr("y", 0)
		      .style("text-anchor", "middle")
		      .attr("transform", `translate({this.gridSize / 2}, -6)`)
		      .attr("class", (d: string, i: number) => ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"));
	}

	public generateHeatmap(tsvFile: string){
		d3.tsv(tsvFile)
		.then((d: TSVRaw) => TSVImported {
		  return {
		    day: +d.day,
		    hour: +d.hour,
		    value: +d.value
		  };
		})
		.then((error, data) => {
			const colorScale = d3.scaleQuantile()
			    .domain([0, this.buckets - 1, d3.max(data, (d: TSVImported) => d.value)])
			    .range(this.colors);

			const cards = svg.selectAll(".hour")
			    .data(data, (d) => `${d.day}:${+d.hour}`);

			cards.append("title");

			cards.enter().append("rect")
			    .attr("x", (d: TSVImported) => (d.hour - 1) * this.gridSize)
			    .attr("y", (d: TSVImported) => (d.day - 1) * this.gridSize)
			    .attr("rx", 4)
			    .attr("ry", 4)
			    .attr("class", "hour bordered")
			    .attr("width", this.gridSize)
			    .attr("height", this.gridSize)
			    .style("fill", this.colors[0]);

			cards.transition().duration(1000)
			    .style("fill", (d: TSVImported) => colorScale(d.value));

			cards.select("title").text((d: TSVImported) => d.value);
			
			cards.exit().remove();

			const legend = svg.selectAll(".legend")
			    .data([0].concat(colorScale.quantiles()), (d: string ) => d);

			legend.enter().append("g")
			    .attr("class", "legend");

			legend.append("rect")
			  .attr("x", (d: string, i: number) => this.legendElementWidth * i)
			  .attr("y", this.height)
			  .attr("width", this.legendElementWidth)
			  .attr("height", this.gridSize / 2)
			  .style("fill", (d: string, i: number) => this.colors[i]);

			legend.append("text")
			  .attr("class", "mono")
			  .text((d: number) => `≥ $Math.round(d)`)
			  .attr("x", (d: number, i: number) => this.legendElementWidth * i)
			  .attr("y", this.height + this.gridSize);

			legend.exit().remove();
		})
	}
}
