import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import FreeDraw from './common/FreeDraw'

import varManager from './cr_vars.js';

// windowScript()=>{

// }

class App extends Component {

  	constructor(props) {
    	super();
    	// this.toggle = this.toggle.bind(this);
      	var scripts = props.scripts;
		var vman = varManager;
  	}
  	toggle=()=>{
  		alert("dude")
  		this.setState({"on":true})
  	}
  	/// BELOW could still be an issue if switching IN and OUT of views!!!!d
	render() {
		const on = this.state
		  return (
		    <div className="App">
		    <button onClick={this.toggle}>test</button>

		      <div className="App-header">
		        <FreeDraw scripts={this.props.scripts}/>
		      </div>
		    </div>
		  );
		}
}

export default App;
