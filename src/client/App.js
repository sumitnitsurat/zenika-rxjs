import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import LineChart from './chart/line-chart';
import Ticker from './ticker';

import connect from 'socket.io-client';
import { Observable, Subject, fromEvent } from 'rxjs';
import { first, takeUntil, take, of } from 'rxjs/operators';

const initialData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const initialLabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export default class App extends Component {
	constructor(props) {
		super(props);
		this.time = 0;
		this.value = 0;
		this.oddCount = 0;
		this.evenCount = 0;
		this.medium = 0;
		this.label = initialLabels;
		this.difference = 0;
		this.chart1Data = initialData.slice();
		this.chart2Data = initialData.slice();
		this.chart3Data1 = initialData.slice();
		this.chart3Data2 = initialData.slice();
		this.chart4Data = initialData.slice();
		this.state = {
			isPLaying: false,
			activeGraph: 'line'
		}
	}

	componentWillMount() {
		this.source$ = new Subject();
		this.currentVal$ = new Subject();
		window.graphType$ = new Subject();
	}

	componentWillUnmount() {
		this.source$.unsubscribe();
		this.currentVal$.unsubscribe();
		window.graphType$.unsubscribe();
	}

	componentDidMount() {
		window.graphType$.next('line');
	}


	//graph to stablish the connection and subcribe to the connection to recieve random value, calculate the graph data and broadcast it to graphs
	playGraph = () => {
		this.io = connect('http://localhost:8000');

		const connection$ = fromEvent(this.io, 'connect');
		connection$.subscribe((d) => {
			console.log(`Client connected`);

			// Observables to recieve the events from socket.io backend
			const disconnect$ = fromEvent(this.io, 'disconnect').pipe(first());

			this.io.emit('subscribeToTimer', 1000);
			const message$ = fromEvent(this.io, 'timer').pipe(takeUntil(disconnect$));

			// Subscriptions
			message$.subscribe(data => {
				this.difference = data.value - this.value;

				this.time = data.time;
				this.value = data.value;

				this.currentVal$.next({ time: this.time, value: this.value });
				this.oddCount = data.value % 2 === 0 ? this.oddCount : ++this.oddCount;
				this.evenCount = data.value % 2 === 0 ? ++this.evenCount : this.evenCount;
				this.medium = this.medium + data.value / (this.oddCount + this.evenCount);
				

				this.label = this.getModifiedData(this.label.slice(), new Date(data.time).getSeconds());
				this.chart1Data = this.getModifiedData(this.chart1Data.slice(), this.value);
				this.chart2Data = this.getModifiedData(this.chart2Data.slice(), this.medium);
				this.chart3Data1 = this.getModifiedData(this.chart3Data1.slice(), this.evenCount);
				this.chart3Data2 = this.getModifiedData(this.chart3Data2.slice(), this.oddCount)
				this.chart4Data = this.getModifiedData(this.chart4Data.slice(), this.difference);

				this.source$.next([{ label: this.label, data: this.chart1Data }, { label: this.label, data: this.chart2Data }, { label: this.label, data1: this.chart3Data1, data2: this.chart3Data2 }, { label: this.label, data: this.chart4Data }]);

			});

			disconnect$.subscribe(() => {
				console.log('client disconnected')
			})

		});

		this.setState({
			isPLaying: true
		})

	}
	//shift the graph array data and push the new value
	getModifiedData = (data, newData) => {
		data.shift();
		data.push(newData);
		return data;
	}
	//disconnect the stream
	stopGraph = () => {
		this.io.disconnect()
		this.setState({
			isPLaying: false
		})
	}
	// switch between bar and line graph and set the graph data and graph type 
	selectGrpah = (type) => {
		window.graphType$.next(type);
		this.source$.next([{ label: this.label, data: this.chart1Data }, { label: this.label, data: this.chart2Data }, { label: this.label, data1: this.chart3Data1, data2: this.chart3Data2 }, { label: this.label, data: this.chart4Data }]);
		this.setState({ activeGraph: type})
	}

	render() {
		const {activeGraph} = this.state;
		return (
			<div className="container-fluid">
				<div className="row" style={{ margin: 10 }}>
					<div className="col-md-3" style={{ marginTop: 10 }}>
						{!this.state.isPLaying ? <button type="button" className="btn btn-primary play-btn" onClick={this.playGraph}>Play</button> :
							<button type="button" className="btn btn-primary play-btn" onClick={this.stopGraph}>Stop</button>}
					</div>
					<div className="col-md-3 btn-group" role="group" style={{ marginTop: 10 }}>
						<button type="button" onClick={() => this.selectGrpah('line')} name="line" className={`btn border-blue ${ activeGraph === 'line' ? 'btn-primary' : 'btn-default'}`}>Line Chart</button>
						<button type="button" onClick={() =>this.selectGrpah('bar')} name="bar" className={`btn border-blue ${ activeGraph === 'bar' ? 'btn-primary' : 'btn-default'}`}>Bar Chart</button>
					</div>
					<div className="col-md-6">
						<Ticker isPLaying={this.state.isPLaying} data={this.currentVal$} />
					</div>
				</div>
				<div className="row col-md-12">
					<div className="col-md-6">
						<LineChart data={this.source$} name="Value Every Second" id="chart1" />
					</div>

					<div className="col-md-6">
						<LineChart data={this.source$} name="Median Value" id="chart2" />
					</div>
				</div>
				<div className="row col-md-12">
					<div className="col-md-6">
						<LineChart data={this.source$} name="Even Count" id="chart3" />
					</div>

					<div className="col-md-6">
						<LineChart data={this.source$} name="Difference of Values" id="chart4" />
					</div>
				</div>

			</div>
		);
	}
}
