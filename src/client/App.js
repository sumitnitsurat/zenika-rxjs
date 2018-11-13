import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import LineChart from './chart/line-chart';


export default class App extends Component {
  state = { number: null };

  componentDidMount() {
    fetch('/api/getRandomNumber')
      .then(res => res.json())
      .then(response => { this.setState({ number: response.randomNumber })
      var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
})
  }

  render() {
    const { number } = this.state;
    return (
      <div>
        {number ? <h1>{`Hello ${number}`}</h1> : <h1>Loading.. please wait!</h1>}
        <LineChart id="myChart"/>
      </div>
    );
  }
}
