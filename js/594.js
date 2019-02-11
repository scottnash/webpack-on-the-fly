window.modules["594"] = [function(require,module,exports){var Parser = require(597);
var DomHandler = require(522);

function defineProp(name, value){
	delete module.exports[name];
	module.exports[name] = value;
	return value;
}

module.exports = {
	Parser: Parser,
	Tokenizer: require(598),
	ElementType: require(521),
	DomHandler: DomHandler,
	get FeedHandler(){
		return defineProp("FeedHandler", require(596));
	},
	get Stream(){
		return defineProp("Stream", require(600));
	},
	get WritableStream(){
		return defineProp("WritableStream", require(601));
	},
	get ProxyHandler(){
		return defineProp("ProxyHandler", require(599));
	},
	get DomUtils(){
		return defineProp("DomUtils", require(526));
	},
	get CollectingHandler(){
		return defineProp("CollectingHandler", require(595));
	},
	// For legacy support
	DefaultHandler: DomHandler,
	get RssHandler(){
		return defineProp("RssHandler", this.FeedHandler);
	},
	//helper methods
	parseDOM: function(data, options){
		var handler = new DomHandler(options);
		new Parser(handler, options).end(data);
		return handler.dom;
	},
	parseFeed: function(feed, options){
		var handler = new module.exports.FeedHandler(options);
		new Parser(handler, options).end(feed);
		return handler.dom;
	},
	createDomStream: function(cb, options, elementCb){
		var handler = new DomHandler(cb, options, elementCb);
		return new Parser(handler, options);
	},
	// List of all events that the parser emits
	EVENTS: { /* Format: eventname: number of arguments */
		attribute: 2,
		cdatastart: 0,
		cdataend: 0,
		text: 1,
		processinginstruction: 2,
		comment: 1,
		commentend: 0,
		closetag: 1,
		opentag: 2,
		opentagname: 1,
		error: 1,
		end: 0
	}
};
}, {"521":521,"522":522,"526":526,"595":595,"596":596,"597":597,"598":598,"599":599,"600":600,"601":601}];
