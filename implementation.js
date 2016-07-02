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
/*
    var binder = function () {
        if (this instanceof bound) {                 // is constructor bound
            var result = target.apply(               // get result value
                this,                                // this scope
                args.concat(slice.call(arguments))   // get arguments
            );
            if (Object(result) === result) {         // if result is not a primitive
                return result;
            }
            return this;                             // or this
        } else {
            return target.apply(                     // get value
                that,                                // another scope
                args.concat(slice.call(arguments))   // get arguments
            );
        }
    };

    var binder = function () {                       // equivalently
        var result;                                  // for a primitive always this scope
        if (instanceof bound) result = this;         // if constructor bound this scope
        else result = that;                          // another scope
        return target.apply(                         // get value
            result,
            args.concat(slice.call(arguments))       // get arguments
        )
    }
*/
    var binder = function () {                       // ternary
        return target.apply(                         // get value
            this instanceof bound ? this : that,     // if constructor bound this scope or other
            args.concat(slice.call(arguments))       // get arguments
        );
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};
