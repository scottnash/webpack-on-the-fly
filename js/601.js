window.modules["601"] = [function(require,module,exports){module.exports = Stream;

var Parser = require(597);
var WritableStream = require(272).Writable;
var StringDecoder = require(327).StringDecoder;
var Buffer = require(238).Buffer;

function Stream(cbs, options){
	var parser = this._parser = new Parser(cbs, options);
	var decoder = this._decoder = new StringDecoder();

	WritableStream.call(this, {decodeStrings: false});

	this.once("finish", function(){
		parser.end(decoder.end());
	});
}

require(259)(Stream, WritableStream);

WritableStream.prototype._write = function(chunk, encoding, cb){
	if(chunk instanceof Buffer) chunk = this._decoder.write(chunk);
	this._parser.write(chunk);
	cb();
};
}, {"238":238,"259":259,"272":272,"327":327,"597":597}];
