window.modules["600"] = [function(require,module,exports){module.exports = Stream;

var Parser = require(601);

function Stream(options){
	Parser.call(this, new Cbs(this), options);
}

require(259)(Stream, Parser);

Stream.prototype.readable = true;

function Cbs(scope){
	this.scope = scope;
}

var EVENTS = require(594).EVENTS;

Object.keys(EVENTS).forEach(function(name){
	if(EVENTS[name] === 0){
		Cbs.prototype["on" + name] = function(){
			this.scope.emit(name);
		};
	} else if(EVENTS[name] === 1){
		Cbs.prototype["on" + name] = function(a){
			this.scope.emit(name, a);
		};
	} else if(EVENTS[name] === 2){
		Cbs.prototype["on" + name] = function(a, b){
			this.scope.emit(name, a, b);
		};
	} else {
		throw Error("wrong number of arguments!");
	}
});}, {"259":259,"594":594,"601":601}];
