window.modules["526"] = [function(require,module,exports){var DomUtils = module.exports;

[
	require(532),
	require(530),
	require(528),
	require(531),
	require(527),
	require(529)
].forEach(function(ext){
	Object.keys(ext).forEach(function(key){
		DomUtils[key] = ext[key].bind(DomUtils);
	});
});
}, {"527":527,"528":528,"529":529,"530":530,"531":531,"532":532}];
