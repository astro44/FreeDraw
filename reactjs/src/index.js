import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import { Provider } from 'react-redux';
// import {createStore, applyMiddleware} from 'redux';
// import reducers from './reducers';
// import thunk from 'redux-thunk';

// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)


var all = document.getElementsByTagName("*");
var nodeFound=[]
for (var i=0, max=all.length; i < max; i++) {
	if (!all[i].hasAttribute("id")) continue;
	if ( all[i].getAttribute("id").includes("root_draw_photos") ){
		nodeFound.push(all[i]);
	}
}


for (var i=0, max=nodeFound.length; i < max; i++) {
	window.reactjs[nodeFound[i].getAttribute("id")]= ReactDOM.render(
		<App scripts={window["cr-scripts"]} dom={nodeFound[i]} />, nodeFound[i]);
		
}//

// <Provider store={createStoreWithMiddleware(reducers)}><App scripts={window["cr-scripts"]} dom={nodeFound[i]} /></Provider>, nodeFound[i]);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
