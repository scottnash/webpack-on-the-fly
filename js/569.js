window.modules["569"] = [function(require,module,exports){"use strict";

const nodeToJson = require(565);
const xmlToNodeobj = require(567);
const x2j = require(567);
const buildOptions = require(564).buildOptions;

exports.parse = function(xmlData, options) {
    options = buildOptions(options,x2j.defaultOptions,x2j.props);
    return nodeToJson.convertToJson(xmlToNodeobj.getTraversalObj(xmlData, options), options);
};
exports.convertTonimn = require(568).convert2nimn;
exports.getTraversalObj = xmlToNodeobj.getTraversalObj;
exports.convertToJson = nodeToJson.convertToJson;
exports.convertToJsonString = require(566).convertToJsonString;
exports.validate = require(570).validate;
exports.j2xParser = require(563);
exports.parseToNimn = function (xmlData,schema,options){
    return exports.convertTonimn(exports.getTraversalObj(xmlData,options), schema, options);
};
}, {"563":563,"564":564,"565":565,"566":566,"567":567,"568":568,"570":570}];
