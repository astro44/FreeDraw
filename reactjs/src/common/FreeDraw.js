import React, { Component, textarea } from 'react'
import ReactDOM from "react-dom";
import "./wbStyles.css";
import varManager from '../cr_vars.js';

class FreeDraw extends Component {
  constructor(props) {
    super();
    this.state = {    /* initial your state. without any added component */
      data: [],
      width: 0, height: 0,
      text:""
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
    const main = MainIn.main(this.mainCanvas.current);
    console.log(main)
    main.getBoard().subscribeShapeNOW(this.shapeListener)
    // debugger
  }
  shapeListener = (shape)=>{
    console.log(shape)
    if (shape && shape.type === 'text') {
      this.setState({shape,text:shape.text.text})
    }else{
      this.setState({shape})
    }
    
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions=()=>{
    this.setState({ width: this.mainContainer.current.offsetWidth, height: this.mainContainer.current.offsetHeight });
  }
  handleSubmit = (e)=>{
    e.preventDefault()
    const { shape, text } = this.state
    if (shape.type === 'text') {
      shape.setText(text)
    }
  }
  render() {
    const { width, height, shape, text } = this.state
    return(  
      <div ref={this.mainContainer} style={{width:"100%",height:"100vh"}}>
        { shape && shape.type ==="text" && 
          <form onSubmit={this.handleSubmit}>
            <input type="text" onChange={({target})=>this.setState({text:target.value})} value={text}/>

            <button>Send data!</button>
          </form>
        }
        <canvas ref={this.mainCanvas}  width={width} height={height}></canvas>
      </div>
      ) 
  }
}//

export default FreeDraw






