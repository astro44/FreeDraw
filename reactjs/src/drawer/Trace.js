export default function() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        var str = [];
        for(var i = 0, l = arguments.length; i < l; i++){
            str.push(arguments[i]);
        }
        try {
            console.log(str.join(" "));
        } catch (e) { }
    } else {
        // production code
    }    
}