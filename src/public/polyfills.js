/* eslint-disable */
if (typeof Promise === "undefined") {
(function () {
	function Promise(resolver) {
		var
		self = this,
		then = self.then = function () {
			return Promise.prototype.then.apply(self, arguments);
		};

		then.fulfilled = [];
		then.rejected = [];

		function timeout(state, object) {
			then.state = 'pending';

			if (then[state].length) setTimeout(function () {
				timeout(state, then.value = then[state].shift().call(self, object));
			}, 0);
			else then.state = state;
		}

		then.fulfill = function (object) {
			timeout('fulfilled', object);
		};

		then.reject = function (object) {
			timeout('rejected', object);
		};

		resolver.call(self, then.fulfill, then.reject);

		return self;
	}

	Promise.prototype = {
		'constructor': Promise,
		'then': function (onFulfilled, onRejected) {
			if (onFulfilled) this.then.fulfilled.push(onFulfilled);
			if (onRejected) this.then.rejected.push(onRejected);

			if (this.then.state === 'fulfilled') this.then.fulfill(this.then.value);

			return this;
		},
		'catch': function (onRejected) {
			if (onRejected) this.then.rejected.push(onRejected);

			return this;
		}
	};

	Promise.all = function () {
		var
		args = Array.prototype.slice.call(arguments),
		countdown = args.length;

		function process(promise, fulfill, reject) {
			promise.then(function onfulfilled(value) {
				if (promise.then.fulfilled.length > 1) promise.then(onfulfilled);
				else if (!--countdown) fulfill(value);

				return value;
			}, function (value) {
				reject(value);
			});
		}

		return new Promise(function (fulfill, reject) {
			while (args.length) process(args.shift(), fulfill, reject);
		});
	};

	window.Promise = Promise;
})();

}
if (!Array.prototype.indexOf) {
// Array.prototype.indexOf
Array.prototype.indexOf = function indexOf(searchElement) {
	for (var array = this, index = 0, length = array.length; index < length; ++index) {
		if (array[index] === searchElement) {
			return index;
		}
	}

	return -1;
};

}
if (!Date.prototype.toISOString) {
// Date.prototype.toISOString
Date.prototype.toISOString = function toISOString() {
	var date = this;

	return ((date.getUTCMonth() + 1) / 100 + date.toUTCString() + date / 1e3).replace(/..(..).+?(\d+)\D+(\d+).(\S+).*(...)/,'$3-$1-$2T$4.$5Z');
};

}
if (!Array.prototype.forEach) {
// Array.prototype.forEach
Array.prototype.forEach = function forEach(callback, scope) {
	for (var array = this, index = 0, length = array.length; index < length; ++index) {
		callback.call(scope || window, array[index], index, array);
	}
};

}
if (!Array.prototype.filter) {
// Array.prototype.filter
Array.prototype.filter = function filter(callback, scope) {
	for (var array = this, arrayB = [], index = 0, length = array.length, element; index < length; ++index) {
		element = array[index];

		if (callback.call(scope || window, element, index, array)) {
			arrayB.push(element);
		}
	}

	return arrayB;
};

}
if (!Array.prototype.map) {
// Array.prototype.map
Array.prototype.map = function map(callback, scope) {
	for (var array = this, arrayB = [], index = 0, length = array.length, element; index < length; ++index) {
		element = array[index];

		arrayB.push(callback.call(scope || window, array[index], index, array));
	}

	return arrayB;
};

}
if (!Function.prototype.bind) {
// Function.prototype.bind
Function.prototype.bind = function bind(scope) {
	var
	callback = this,
	prepend = Array.prototype.slice.call(arguments, 1),
	Constructor = function () {},
	bound = function () {
		return callback.apply(
			this instanceof Constructor && scope ? this : scope,
			prepend.concat(Array.prototype.slice.call(arguments, 0))
		);
	};

	Constructor.prototype = bound.prototype = callback.prototype;

	return bound;
};

}
if (!Array.prototype.every) {
// Array.prototype.every
Array.prototype.every = function every(callback, scope) {
	for (var array = this, index = 0, length = array.length; index < length; ++index) {
		if (!callback.call(scope || window, array[index], index, array)) {
			break;
		}
	}

	return index === length;
};

}
if (!Array.prototype.reduce) {
// Array.prototype.reduce
Array.prototype.reduce = function reduce(callback, initialValue) {
	var array = this, previousValue = initialValue || 0;

	for (var index = 0, length = array.length; index < length; ++index) {
		previousValue = callback.call(window, previousValue, array[index], index, array);
	}

	return previousValue;
};

}
if (!Array.prototype.some) {
// Array.prototype.some
Array.prototype.some = function some(callback, scope) {
	for (var array = this, index = 0, length = array.length; index < length; ++index) {
		if (callback.call(scope || window, array[index], index, array)) {
			break;
		}
	}

	return index === length;
};

}
if (!Array.prototype.lastIndexOf) {
// Array.prototype.lastIndexOf
Array.prototype.lastIndexOf = function lastIndexOf(searchElement) {
	for (var array = this, index = array.length - 1; index > -1; --index) {
		if (array[index] === searchElement) {
			return index;
		}
	}

	return -1;
};

}
if (!Array.prototype.reduceRight) {
// Array.prototype.reduceRight
Array.prototype.reduceRight = function reduceRight(callback, initialValue) {
	var array = this, previousValue = initialValue || 0;

	for (var index = array.length - 1; index > -1; --index) {
		previousValue = callback.call(window, previousValue, array[index], index, array);
	}

	return previousValue;
};

}
if (!String.prototype.trim) {
// String.prototype.trim
String.prototype.trim = function trim() {
	return this.replace(/^\s+|\s+$/g, '');
};

}
if (typeof Date !== "undefined" && !Date.now) {
// Date.now
Date.now = function now() {
	return new Date().getTime();
};

}
if (typeof Object !== "undefined" && !Object.defineProperty) {
// Object.defineProperty
Object.defineProperty = function (object, property, descriptor) {
	if (descriptor.get) {
		object.__defineGetter__(property, descriptor.get);
	}

	if (descriptor.set) {
		object.__defineSetter__(property, descriptor.set);
	}

	return object;
};

}
if (typeof Object !== "undefined" && !Object.create) {
// Object.create
Object.create = function create(prototype, properties) {
	if (typeof prototype !== 'object') {
		throw new Error('Object prototype may only be an Object or null');
	}

	var Constructor = function () {};

	Constructor.prototype = prototype;

	var object = new Constructor();

	Object.defineProperties(object, properties);

	return object;
};

}
if (typeof Object !== "undefined" && !Object.getPrototypeOf) {
// Object.getPrototypeOf
Object.getPrototypeOf = function getPrototypeOf(object) {
	return object && object.constructor && object.constructor.prototype || null;
};

}
if (typeof Array !== "undefined" && !Array.isArray) {
// Array.isArray
Array.isArray = function isArray(array) {
	return array && Object.prototype.toString.call(array) === '[object Array]';
};

}
if (typeof Object !== "undefined" && !Object.keys) {
// Object.keys
Object.keys = function keys(object) {
	var buffer = [], key;

	for (key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			buffer.push(key);
		}
	}

	return buffer;
};

}
if (typeof Object !== "undefined" && !Object.getOwnPropertyNames) {
// Object.getOwnPropertyNames
Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
	var buffer = [], key;

	for (key in object) {
		buffer.push(key);
	}

	return buffer;
};

}
if (typeof window.atob === 'undefined' || typeof window.btoa === 'undefined') {
/** @license MIT David Lindquist (http://www.webtoolkit.info/javascript-base64.html), Andrew Dodson (drew81.com) */
(function () {
	var keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', keysRe = new RegExp('[^' + keys + ']');

	// Window.prototype.atob
	Window.prototype.atob = function atob(input) {
		var output = [], buffer, bufferB, chrs, index = 0, indexB, length = input.length;

		if ((length % 4 > 0) || (keysRe.test(input)) || (/=/.test(input) && (/=[^=]/.test(input) || /={3}/.test(input)))) {
			throw new Error('Invalid base64 data');
		}

		while (index < length) {
			for (bufferB = [], indexB = index; index < indexB + 4;) {
				bufferB.push(keys.indexOf(input.charAt(index++)));
			}

			buffer = (bufferB[0] << 18) + (bufferB[1] << 12) + ((bufferB[2] & 63) << 6) + (bufferB[3] & 63);

			chrs = [(buffer & (255 << 16)) >> 16, bufferB[2] === 64 ? -1 : (buffer & (255 << 8)) >> 8, bufferB[3] === 64 ? -1 : buffer & 255];

			for (indexB = 0; indexB < 3; ++indexB) {
				if (chrs[indexB] >= 0 || indexB === 0) {
					output.push(String.fromCharCode(chrs[indexB]));
				}
			}
		}

		return output.join('');
	};

	// Window.prototype.btoa
	Window.prototype.btoa = function btoa(input) {
		var output = [], buffer, chrs, index = 0, length = input.length;

		while (index < length) {
			chrs = [input.charCodeAt(index++), input.charCodeAt(index++), input.charCodeAt(index++)];

			buffer = (chrs[0] << 16) + ((chrs[1] || 0) << 8) + (chrs[2] || 0);

			output.push(
				keys.charAt((buffer & (63 << 18)) >> 18),
				keys.charAt((buffer & (63 << 12)) >> 12),
				keys.charAt(isNaN(chrs[1]) ? 64 : (buffer & (63 << 6)) >> 6),
				keys.charAt(isNaN(chrs[2]) ? 64 : (buffer & 63))
			);
		}

		return output.join('');
	};
})();

}
if (typeof Object !== "undefined" && !Object.defineProperties) {
// Object.defineProperties
Object.defineProperties = function defineProperties(object, descriptors) {
	for (var property in descriptors) {
		Object.defineProperty(object, property, descriptors[property]);
	}

	return object;
};

}
