import React, { Component, textarea } from 'react'
import ReactDOM from "react-dom";
import "./wbStyles.css";
import varManager from '../cr_vars.js';

import Main from '../drawer/Main'

class FreeDraw extends Component {
  constructor(props) {
    super();
    this.state = {    /* initial your state. without any added component */
      data: [],
      width: 0, height: 0
    }
    this.mainCanvas = React.createRef();
    this.mainContainer = React.createRef();
    this.mainTxt = React.createRef();
  }
  componentDidMount(){
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    var createjs = this.props.scripts.createjs;
    var WBdraw = this.props.scripts.WBdraw;
    var MainIn = Main // this.props.scripts.wbMain;
    console.log(MainIn)
    this.main = MainIn.main(this.mainCanvas.current, this.mainTxt.current);
    console.log(this.main)
    this.main.getBoard().subscribeShapeNOW(this.shapeListener)
    // debugger
  }
  shapeListener = (shape)=>{
    const { selectShape } = this.props
    selectShape(shape)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions=()=>{
    this.setState({ width: this.mainContainer.current.offsetWidth, height: this.mainContainer.current.offsetHeight });
  }
  addEvent = (form,type) => {
    this.main.getBoard().menu.dispatchEvent({
      type: "MenuEvent",
      param: [form,type]
    })
  }
  getImage = () => {
    return this.main.getBoard().getImage()
  }
  getBoard = () => {
    return this.main.getBoard()
  }
  render() {
    const { width, height } = this.state
    return(  
      <div ref={this.mainContainer} style={{width:"100%",height:"100vh"}}>
        
          <textarea ref={this.mainTxt} name="txt2edit" id="txt2edit" placeholder="enter text here" cols="" rows="" style={{width:'inherit',fontSize:"20px", lineHeight:"1.0em", display:'none'}}></textarea>
        <canvas ref={this.mainCanvas}  width={width} height={height}></canvas>
      </div>
      ) 
  }
}//

export default FreeDraw






