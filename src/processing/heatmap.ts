import * as d3 from "d3";

import { IDSVParsedArray, IDSVRowAny, IMargin, ITSVImported } from '../types/chartTypes'
import * as constants from './constants';

export default class HeatmapProcessor {
	public margin: IMargin;
	public width: number;
	public height: number;
	public gridSize: number;
	public legendElementWidth: number;
	public buckets: number;
	public colors: string[];
	public days: string[];
	public times: string[];
	public datasets: string[];
	public svg: any;

	public constructor() {
		this.margin = { top: 50, right: 0, bottom: 100, left: 30 };
		this.width = 960 - this.margin.left - this.margin.right;
		this.height = 430 - this.margin.top - this.margin.bottom;
		this.gridSize = Math.floor(this.width / 24);
		this.legendElementWidth = this.gridSize * 2;
		this.buckets = 9;
		this.colors = constants.colors;
		this.days = constants.days;
		this.times = constants.times;
		this.datasets = ["data.tsv", "data2.tsv"];
	}

	public generateSVG(): void {
		this.svg = d3
			.select("#chart")
			.append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.top + this.margin.bottom)
			.append("g")
			.attr("transform", `translate(${this.margin.left},${this.margin.top})`);
	}

	public dayLabels(): void {
		this.svg
			.selectAll(".dayLabel")
			.data(this.days)
			.enter()
			.append("text")
			.text((d: string) => d)
			.attr("x", 0)
			.attr("y", (d: string, i: number) => i * this.gridSize)
			.style("text-anchor", "end")
			.attr("transform", `translate(-6,${this.gridSize / 1.5})`)
			.attr(
				"class",
				(d: string, i: number) =>
					i >= 0 && i <= 4
						? "dayLabel mono axis axis-workweek"
						: "dayLabel mono axis"
			);
	}

	public timeLabels(): void {
		this.svg
			.selectAll(".timeLabel")
			.data(this.times)
			.enter()
			.append("text")
			.text((d: string) => d)
			.attr("x", (d: string, i: number) => i * this.gridSize)
			.attr("y", 0)
			.style("text-anchor", "middle")
			.attr("transform", `translate(${this.gridSize / 2}, -6)`)
			.attr(
				"class",
				(d: string, i: number) =>
					i >= 7 && i <= 16
						? "timeLabel mono axis axis-worktime"
						: "timeLabel mono axis"
			);
	}

	public generateHeatmap(tsvFile: string): void {
		// tslint:disable-next-line:no-console
		console.log("generating heatmap");
		d3.tsv(`../data/${tsvFile}`)
			.then(
				(data: IDSVParsedArray<IDSVRowAny>): ITSVImported[] => {
					// tslint:disable-next-line:no-console
					console.log('data', data)
					return data.map((row: IDSVRowAny) => {
						return {
							day: Number(row.day),
							hour: Number(row.hour),
							value: Number(row.value)
						};
					});
				}
			)
			.then(
				(data: ITSVImported[]): void => {
					this.generateSVG();

					const valueMax = Math.max.apply(
						Math,
						data.map((d: ITSVImported) => Number(d.value))
					);
					const colorScale = d3
						.scaleQuantile<string>()
						.domain([0, this.buckets - 1, valueMax])
						.range(this.colors);

					const cards = this.svg
						.selectAll(".hour")
						.data(data, (d: ITSVImported) => `${+d.day}:${+d.hour}`);

					cards.append("title");

					cards
						.enter()
						.append("rect")
						.attr("x", (d: ITSVImported) => (d.hour - 1) * this.gridSize)
						.attr("y", (d: ITSVImported) => (d.day - 1) * this.gridSize)
						.attr("rx", 4)
						.attr("ry", 4)
						.attr("class", "hour bordered")
						.attr("width", this.gridSize)
						.attr("height", this.gridSize)
						.style("fill", (d: ITSVImported) => colorScale(d.value));

					cards
						.transition()
						.duration(1000)
						.style("fill", (d: ITSVImported) => colorScale(d.value));

					cards.select("title").text((d: ITSVImported) => d.value);

					cards.exit().remove();

					this.dayLabels();
					this.timeLabels();

					const legend = this.svg
						.selectAll(".legend")
						.data([0].concat(colorScale.quantiles()), (d: number) => d);

					// tslint:disable-next-line:no-console
					console.log(
						"legend colors",
						[0].concat(colorScale.quantiles()),
						(d: number) => d
					);
					legend
						.enter()
						.append("g")
						.attr("class", "legend");

					legend
						.append("rect")
						.attr("x", (d: string, i: number) => this.legendElementWidth * i)
						.attr("y", this.height)
						.attr("width", this.legendElementWidth)
						.attr("height", this.gridSize / 2)
						.style("fill", (d: string, i: number) => this.colors[i]);

					legend
						.append("text")
						.attr("class", "mono")
						.text((d: number) => `≥ $Math.round(d)`)
						.attr("x", (d: number, i: number) => this.legendElementWidth * i)
						.attr("y", this.height + this.gridSize);

					legend.exit().remove();
				}
			);
	}
}
