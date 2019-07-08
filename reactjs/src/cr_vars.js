import React from 'react';
//import registerServiceWorker from './registerServiceWorker';
   

class var_Manager {

  constructor(){
   if(! var_Manager.instance){
     this._data = {};
     var_Manager.instance = this;
   }

   return var_Manager.instance;
  }

  add(key, value) {
    this._data[key]=value
    
    //console.log(this._data)
  }

  get(key) {
    // get the value out for the given key
    return this._data[key]
  }

  // etc...
}

const varManager = new var_Manager();
Object.freeze(varManager);

export default varManager;