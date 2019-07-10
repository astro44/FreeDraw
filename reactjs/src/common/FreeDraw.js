import React, { Component, textarea } from 'react'
import ReactDOM from "react-dom";
import "./wbStyles.css";
import varManager from '../cr_vars.js';

class FreeDraw extends Component {
  constructor(props) {
    super();
    this.state = {    /* initial your state. without any added component */
      data: [],
      width: 0, height: 0
    }
    this.mainCanvas = React.createRef();
    this.mainContainer = React.createRef();
  }
  componentDidMount(){
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    var createjs = this.props.scripts.createjs;
    var WBdraw = this.props.scripts.WBdraw;
    var MainIn = this.props.scripts.wbMain;
    console.log(MainIn)
    MainIn.main(this.mainCanvas.current);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions=()=>{
    this.setState({ width: this.mainContainer.current.offsetWidth, height: this.mainContainer.current.offsetHeight });
  }
  render() {
    const { width, height} = this.state
    return(  
      <div ref={this.mainContainer} style={{width:"100%",height:"100vh"}}>
        <canvas ref={this.mainCanvas}  width={width} height={height}></canvas>
      </div>
      ) 
  }
}//

export default FreeDraw






