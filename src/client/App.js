import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import LineChart from './chart/line-chart';
import openSocket from 'socket.io-client';
import {Observable, Subject, fromEvent} from 'rxjs';
import {first, takeUntil, take, of} from 'rxjs/operators';

const  io = openSocket('http://localhost:8000');
// io.on('connect', function(socket){
//   console.log('connection is')
// });

var data = [];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      value: 0,
      oddCount: 0,
      evenCount: 0,
      medium: 0,
      difference: 0,
      chart1Data: [],
      chart2Data: [],
      chart3Data: [],
      chart4Data: []
    }
    window.myData = [];
  }

  componentWillMount() {
    //this.getValue();
    this.source =  new Subject();
    this.source2 =  new Subject();
  }

  componentDidMount() {
    let connection$ = fromEvent(io, 'connect');

    
    let that = this;
    connection$.subscribe(socket => {
        console.log(`Client connected`);

        // Observables
        const disconnect$ = fromEvent(io, 'disconnect').pipe(first());
        // const event$ = Subject.create('subscribeToTimer');
        // event$.next(1000);
        io.emit('subscribeToTimer', 1000);
        const message$ = fromEvent(io, 'timer').pipe(takeUntil(disconnect$));

        // Subscriptions
        message$.subscribe(data => {
            console.log(`Got message from client with data: ${data}`);
            // io.emit('message', data); // Emit to all clients
            //cb(null, timestamp)
            // let time = data.time;
            // let value = data.value;
            // oddCount = data.value % 2 === 0 ? oddCount : oddCount++;
            // evenCount = data.value % 2 === 0 ? evenCount++ : evenCount;
            // medium = medium + data.value/oddCount+evenCount;
            // difference = this.state.chart4Data[this.state.chart4Data.length-1] - data.value;
            //window.source.map(x => console.log('x going to be', x))
            // data.push({'a': d.value, 'b': d.value*2})
            // pairs(data)
            // .subscribe()
           // window.myData = of([data.value]);
             this.source.next(data.value);
          this.source2.next(data.value * 2);

        });

        disconnect$.subscribe(() => {
            console.log(`Client disconnected`);
        })
    });
  }

  subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
  }

  render() {
    const { number } = this.state;
    console.log('get to know here');
    return (
      <div>
        {number ? <h1>{`Hello ${number}`}</h1> : <h1>Loading.. please wait!</h1>}
        <LineChart data={this.source} id="myChart"/>
        <div style={{marginTop: 200}}>
        <LineChart data={this.source2} id="myChart1"/>
        </div>
        {/* {this.subscribeToTimer((err, val) => {
          console.log('subscribing again n again')
          console.log('timeis', val)
        })} */}   
            
        {setTimeout(() =>  io.disconnect(), 5000)}
      </div>
    );
  }
}
