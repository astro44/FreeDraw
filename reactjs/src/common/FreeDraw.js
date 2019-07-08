import React, { Component, textarea } from 'react'
import ReactDOM from "react-dom";
import "./wbStyles.css";
import varManager from '../cr_vars.js';

class FreeDraw extends Component {
  constructor(props) {
     super();

    this.blurIT = this.blurIT.bind(this);
     this.state = {    /* initial your state. without any added component */
        data: []
     }
     var  vman = varManager;
     vman.get('textObjects');

  }
  componentDidMount(){
    var createjs = this.props.scripts.createjs;
    var WBdraw = this.props.scripts.WBdraw;
    var MainIn = this.props.scripts.wbMain;
    console.log(MainIn)
    var mainCanvas = ReactDOM.findDOMNode(this.refs.mainCanvas);
    var editText= ReactDOM.findDOMNode(this.refs.editText);
    this.props.scripts['txtDOM']=editText
    MainIn.main(mainCanvas);
    

     // this.stage = new createjs.Stage(mainCanvas);
     // var circle = new createjs.Shape();
     // circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
     // circle.x = 100;
     // circle.y = 100;
     // this.stage.addChild(circle);
     // this.stage.update();



     //var  vman = varManager;
     // var objsTxts=vman.get('textObjects');
     // var add_texts=[]
     // objsTxts.forEach(function(txt) {
     //    add_texts.push(
     //    {
     //      "id": "dude"

     //    })
     //  });
// in html you can use setState to change react accordingly....
          // function submitReady(event){
          //   var reactA=window.icdReact["root_autocomplete_description"];
          //   var stateIn = Object.assign({}, reactA.state);//clone
          //   stateIn.value="ddduuudde!!";
          //   //reactA.state=stateIn;
          //   reactA.setState(stateIn);
          //   console.log(reactA.state.value)
          //   reactA.forceUpdate();
          //   console.log(window.icdReact);
          //   debugger;
          // }
          // 
          // 
          // 
    var looper = []
    looper.forEach(function(txt){

    })


    let newly_added_data = {id:"yoyo"};




    this.setState({
        data: [...this.state.data, newly_added_data]
    });

  }
//https://reactjs.org/docs/refs-and-the-dom.html
  blurIT=function(){
    this.props['scripts'].blurNow()

  }
// <textarea name="txt2edit" id="txt2edit" placeholder="enter text here" cols="" 
// rows="" style="width: inherit; font-size: 20px; background: rgba(0, 0, 0, 0); color: black; b
// order: none; overflow: hidden; font-family: Arial; padding: 8px; line-height: 1em; height: inherit;">
// </textarea>
  render() {
    // _handleRemoveButton(key) {
    //     let result = this.state.data.filter( (data) => data.key !== key );

    //     this.setState({
    //         data: result,
    //     });
    // }
    // <div ref="editText" className="wbMainTxtDiv" style={{`${this.props.value}%`}}>
    let rjsDynamic = this.state.data.map( (data, index) => {
      console.log(data)
      var w=223;
      var styleIn= {'width': w+'px'}
      var styleIn2= {'width': w+'px'}
      return(<div></div>)//
        // return (
        //   <div ref="editTextold" className="wbMainTxtDiv" style={styleIn}>
        //     <textarea key="txt2edit" className="txt2edit"  style={styleIn2} onBlur={this.blurIT()}/>
        //   </div>
        // )
    });
    // const { text = '', handleClose } = this.props.inputProps
    return(  
      <div>
        {rjsDynamic}

          <div ref="editText" className="wbMainTxtDiv" >
            <textarea key="txt2edit" className="txt2edit"  onBlur={this.blurIT}/>
          </div>
        <canvas ref="mainCanvas"  width="500" height="300"></canvas>
      </div>
      ) 
  }
}//

export default FreeDraw






