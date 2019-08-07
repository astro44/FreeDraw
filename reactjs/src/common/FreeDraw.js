import React, { Component, textarea } from 'react'
// import ReactDOM from "react-dom";
import "./wbStyles.css";
// import varManager from '../cr_vars.js';

import Main from '../drawer/Main'
import Grid from '@material-ui/core/Grid';

class FreeDraw extends Component {
  constructor(props) {
    super();
    this.state = {    /* initial your state. without any added component */
      data: [],
      width: 0, height: 0,
      image:null,
      rotation:0
    }
    this.mainCanvas = React.createRef();
    this.mainContainer = React.createRef();
    this.mainTxt = React.createRef();
  }
  componentDidMount(){
    // this.updateWindowDimensions();
    // window.addEventListener('resize', this.updateWindowDimensions);

    // var createjs = this.props.scripts.createjs;
    // var WBdraw = this.props.scripts.WBdraw;
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
    // window.removeEventListener('resize', this.updateWindowDimensions);
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
  selectImage = (event) => {
    const { target:{src=""}} = event
    var image = new Image();
		image.crossOrigin = "Anonymous";
		image.src = src;
		// img.src = "/Homer_Simpson_2006.png";
		image.onload = () => {
      this.setState({
        image,
        src,
        width:image.width,
        height:image.height,
      },() => {
        this.getBoard().setImage(image)
      })
		}
  }
  setRotation = (right) => {
		const { rotation } = this.state
		// debugger
		const image = this.getImage()
    let newRotation = right ? rotation +90 : rotation -90
    let width = 0,height = 0
		switch (newRotation) {
			case 90:
          image.y = image.element.width/2
          image.x = image.element.height/2
          image.rotation = newRotation
          width = image.element.height
          height = image.element.width
					break;
			case 180:
          image.y = image.element.height/2
          image.x = image.element.width/2
          image.rotation = newRotation
          height = image.element.height
          width = image.element.width
					break;
			case -90:
			case 270:
          image.y = image.element.width/2
          image.x = image.element.height/2
          image.rotation = newRotation = 270
          width = image.element.height
          height = image.element.width
					break;		
			default:
          image.y = image.element.height/2
          image.x = image.element.width/2
          image.rotation = newRotation = 0
          height = image.element.height
          width = image.element.width
				break;
		}
		this.setState({
      rotation:newRotation,
      width,
      height
    })
	}
  render() {
    const { width, height, image, src } = this.state
    const images = [
      'https://nc-portal-dev.nuclaim.com/ale/clients/309/files/logo.gif',
      'https://nc-portal-dev.nuclaim.com/ale/clients/309/files/logo.png',
      'https://nc-portal-dev.nuclaim.com/ale/clients/309/files/logo.jpg',
    ]
    return(  
      <div ref={this.mainContainer} style={{
          width:"100%",
          height:"100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#000000c4"
        }}>
        <div style={{
          display:"flex",
          overflow: "auto"
        }}>
          {images.map((e,k)=>(
            <div key={k} 
              style={{
                flex:1,
                margin:"10px"
              }}
            >
              <img src={e} alt="img" width="200"
                onClick={this.selectImage}
                style={src === e?{
                  border:"10px solid #1faf46",
                  borderRadius: "12px"
                  }:{}}
              />
            </div>
          ))}          
        </div>
        <textarea ref={this.mainTxt} name="txt2edit" id="txt2edit" placeholder="enter text here" cols="" rows="" style={{width:'inherit',fontSize:"20px", lineHeight:"1.0em", display:'none'}}></textarea>
        <canvas ref={this.mainCanvas}  width={width} height={height}></canvas>
      </div>
      ) 
  }
}//

export default FreeDraw






