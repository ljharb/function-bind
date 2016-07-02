var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1),

    // optimize the variable declaration
        bound = Function('binder', 'return function(' +
            Array(Math.max(0, 1 + target.length - args.length)).join('$').split('') +
            '){return binder.apply(this,arguments);}')(
            function () {
               return target.apply(                  // get value
               this instanceof bound ? this : that,  // if constructor bound this scope or other
               args.concat(slice.call(arguments)));  // get arguments
            });
/*
    // I wonder! I'm not sure I have a bad english
    // ECMA-5 15.3.4.5.1 Return the result of calling the [[Call]] internal 
    // method of target providing boundThis as the this value and providing args 
    // as the arguments.
        bound = Function('binder,that,args', 'return function('
         + Array(Math.max(0, 1 + target.length - args.length)).join('$').split('')
         + '){return binder.apply(this instanceof binder?this:that,args.concat(Array.prototype.slice.call(arguments)));}')(target, that, args)
*/
    bound.prototype = target.prototype;

    return bound;
};
