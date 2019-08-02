const extend = function(subclass, superclass) {
        

    function o() { this.constructor = subclass; }
    o.prototype = superclass.prototype;
    return (subclass.prototype = new o());
}
const promote = function(subclass, prefix) {
    

    var subP = subclass.prototype, supP = (Object.getPrototypeOf&&Object.getPrototypeOf(subP))||subP.__proto__;
    if (supP) {
        subP[(prefix+="_") + "constructor"] = supP.constructor; // constructor is not always innumerable
        for (var n in supP) {
            if (subP.hasOwnProperty(n) && (typeof supP[n] == "function")) { subP[prefix + n] = supP[n]; }
        }
    }
    return subclass;
}
const toTitleCase= function(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
const _inheritsLoose = function (subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
module.exports = {
    extend,
    promote,
    toTitleCase,
    _inheritsLoose
}