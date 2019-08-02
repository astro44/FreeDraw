import React, { Component } from 'react'
// import logo from './logo.svg';
import './App.css';
import FreeDraw from './common/FreeDraw'

// import varManager from './cr_vars.js';
import {Grid} from '@material-ui/core'

// windowScript()=>{

// }
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';


class App extends Component {

  	constructor(props) {
		super();
		this.state = {
			menuFill:null,
			text:"",
			rotation:0,
			tabsaved:[]
		}
    	// this.toggle = this.toggle.bind(this);
      	// var scripts = props.scripts;
		// var vman = varManager;

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
				{types.map((t,k)=>(
					<MenuItem key={k} onClick={this.sendEvent(form, t)}>{t}</MenuItem>
				))}
			</Menu>
		</>
	)}
	selectShape = (shape) =>{
		if (shape && shape.type === 'text') {
			this.setState({shape,text:shape.text.text})
		}else{
			this.setState({shape})
		}
	}
	textChange = ({target})=>{
		this.setState({text:target.value})
		const { shape } = this.state
		if (shape && shape.type === 'text') {
			shape.setText(target.value)
		}
	}
	setRotation = (right) => () => {
		const { rotation } = this.state
		// debugger
		const image = this.draweer.current.getImage()
		let newRotation = right ? rotation +90 : rotation -90
		switch (newRotation) {
			case 90:
					image.y = image.element.width/2
					image.rotation = newRotation
					break;
			case 180:
					image.y = image.element.height/2
					image.rotation = newRotation
					break;
			case -90:
			case 270:
					image.y = image.element.width/2
					image.rotation = newRotation = 270
					break;		
			default:
					image.y = image.element.height/2
					image.rotation = newRotation = 0
				break;
		}
		this.setState({rotation:newRotation})
	}
	save = () => {
		const board = this.draweer.current.getBoard()
		this.setState({
			tabsaved : [board.allTabs[0].slice(0)]
		})
	}
	import = () => {
		const { tabsaved } = this.state
		const board = this.draweer.current.getBoard()
		board.wbImport(tabsaved)
	}
	render() {
		const { shape, text} = this.state
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
							"star",
							"picture"
						]
					})}
					{this.creteMenuItem({
						form:"modify",
						types:[
							"delete",
							"color",
							"alpha",
							"undo"
						]
					})}
					{this.creteMenuItem({
						form:"clear",
						types:[
							"clear"
						]
					})}
					
					<Button color="inherit" onClick={this.setRotation(false)}>
						Left
					</Button>
					<Button color="inherit" onClick={this.setRotation(true)}>
						Right
					</Button>
					<Button color="inherit" onClick={this.save}>
						Save
					</Button>
					<Button color="inherit" onClick={this.import}>
						Import
					</Button>
					{ shape && shape.type ==="text" &&
						<InputBase
							onChange={this.textChange} value={text}
							/>
					}

					</Toolbar>
				</AppBar>
				<Grid
					container
					direction="column"
					justify="flex-start"
					alignItems="stretch"
				>
					<Grid item xs={12}>
						<FreeDraw selectShape={this.selectShape} ref={this.draweer} scripts={this.props.scripts}/>
					</Grid>
				</Grid>	
			</>
		  );
		}
}

export default App;
