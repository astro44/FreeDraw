import React, { Component } from 'react'
// import logo from './logo.svg';
import './App.css';
import ImageEditor from './common/ImageEditor'

class App extends Component {
	render() {
		  return (
			<div className="draweer">
				<ImageEditor/>
			</div>
			  
		  );
		}
}

export default App;
