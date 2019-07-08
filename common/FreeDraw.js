import React, { Component } from 'react'
import ReactDOM from "react-dom";
// import Button from '@material-ui/core/Button'
// import Dialog from '@material-ui/core/Dialog'
// import DialogActions from '@material-ui/core/DialogActions'
// import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
// import DialogTitle from '@material-ui/core/DialogTitle'


class FreeDraw extends Component {
  constructor() {
   super();
  }
  componentDidMount(){
     var mainCanvas = ReactDOM.findDOMNode(this.refs.mainCanvas);
     this.stage = new createjs.Stage(mainCanvas);
     var circle = new createjs.Shape();
     circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
     circle.x = 100;
     circle.y = 100;
     this.stage.addChild(circle);
     this.stage.update();
  }

  render() {
    // const { text = '', handleClose } = this.props.inputProps
    return  
      <canvas ref="mainCanvas" width="500" height="300"></canvas>
  }
}

export default CustomDialog
