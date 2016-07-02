var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {                       // ternary
        return target.apply(                         // get value
            this instanceof bound ? this : that,     // if constructor bound this scope or other
            args.concat(slice.call(arguments))       // get arguments
        );
    };

    // we do not use separate arguments, we need only the number of
    boundArgs = Array(Math.max(0, 1 + target.length - args.length)).join('$').split('');
    // converting an array to string by default separator comma
    bound = Function('binder', 'return function (' + boundArgs + '){ return binder.apply(this,arguments); }')(binder);
/*
    if (target.prototype) {
        var Empty = function Empty() {};             // get empty function
        Empty.prototype = target.prototype;          // set function prototype, resulting object
        bound.prototype = new Empty();               // set object prototype to bound
        Empty.prototype = null;                      // clean Empty.prototype
    }
*/
    // Function does not have a prototype, the object must be recognized as that of the parent
    // A both instances as at the parent
    bound.prototype = target.prototype;

    return bound;
};
