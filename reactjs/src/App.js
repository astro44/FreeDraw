import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import FreeDraw from './common/FreeDraw'

import varManager from './cr_vars.js';
import {Grid} from '@material-ui/core'

// windowScript()=>{

// }
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
class App extends Component {

  	constructor(props) {
		super();
		this.state = {
			menuFill:null
		}
    	// this.toggle = this.toggle.bind(this);
      	var scripts = props.scripts;
		var vman = varManager;

		this.draweer = React.createRef();
  	}
  	toggle=()=>{
  		alert("dude")
  		this.setState({"on":true})
  	}
  	handleClick =  (id, target)=> {
		this.setState({[id]:target})
	}
	
	handleClose = (id)=> {
		this.setState({[id]:null})
	}
	sendEvent = (form,type)=>() => {
		this.draweer.current.addEvent(form,type)
		this.handleClose(`menu-${form}`)
	}
	creteMenuItem = ({form, types}) =>{
		const {[`menu-${form}`]:menu} = this.state
		return (
		<>
			<Button color="inherit" aria-controls={`menu-${form}`} aria-haspopup="true" onClick={(e)=>this.handleClick(`menu-${form}`, e.currentTarget)}>
				{form}
			</Button>
			<Menu
				id={`menu-${form}`}
				anchorEl={menu}
				keepMounted
				open={Boolean(menu)}
				onClose={()=>this.handleClose(`menu-${form}`)}
			>
				{types.map(t=>(
					<MenuItem onClick={this.sendEvent(form, t)}>{t}</MenuItem>
				))}
			</Menu>
		</>
	)}
	render() {
		const {menuFill} = this.state
		  return (
			  <>
			   <AppBar position="static">
					<Toolbar>
					<Typography variant="h6" >
						Options
					</Typography>
					{this.creteMenuItem({
						form:"line",
						types:[
							"free",
							"straight",
							"bezier",
							"links"
						]
					})}
					{this.creteMenuItem({
						form:"fill",
						types:[
							"square",
							"circle",
							"star"
						]
					})}
					</Toolbar>
				</AppBar>
				<Grid
					container
					direction="column"
					justify="flex-start"
					alignItems="stretch"
				>
					<Grid item xs={12}>
						<div>12</div>
					</Grid>
					<Grid item xs={12}>
						<FreeDraw ref={this.draweer} scripts={this.props.scripts}/>
					</Grid>
				</Grid>	
			</>
		  );
		}
}

export default App;
