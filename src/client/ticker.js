import React, { Component } from 'react';
import './app.css';

export default class Ticker extends Component {
 
    constructor(props) {
       super(props);
       this.state = {
           time: 0,
           value: 0
       }
    }

    componentDidMount() {
        this.props.data.subscribe(data => {
            this.setState({
                time: data.time,
                value: data.value
            })
        })
    }

  render() {
      let ticker = 0;
      if(this.state.time) {
        let date = new Date(this.state.time);
        ticker = date.getHours() + ' : ' + date.getMinutes() + ' : '+ date.getSeconds();
      }
    return (
    <div className="card">
        <div className="card-body" style={{display: 'flex'}}>
            {this.props.isPLaying && <div style={{flex: .2}}><span className="pulse"></span></div>}
            <div style={{flex: 2}}>Time: {ticker}</div>
            <div  style={{flex: 1}}>Value: {this.state.value}</div>
        </div>
    </div>
    );
  }
}
