window.modules["quiz-personality.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    parser = require(177).parse;

function parseQuestions(questions) {
  return parser(questions);
} // turns the score markdown into an object


function parseScore(scoreMarkdown) {
  var splitData,
      finalScoreObject = {
    results: {}
  },
      resultTxt;
  splitData = encodeURIComponent(scoreMarkdown).split('%0A');
  splitData.forEach(function (data) {
    var splitData2 = data.split('%7D%20'),
        values = [],
        lastValue; // maps each score range or category to an array that contains the result text and corresponding social share message

    if (splitData2.length > 1) {
      resultTxt = decodeURIComponent(splitData2[1]).replace(/\*/, '<span>').replace(/\*/, '</span>');
      values.push(resultTxt);
      finalScoreObject.results[splitData2[0].replace('%7B', '')] = values;
    } else {
      lastValue = finalScoreObject.results[Object.keys(finalScoreObject.results)[Object.keys(finalScoreObject.results).length - 1]];

      if (Array.isArray(lastValue)) {
        lastValue.push(decodeURIComponent(splitData2));
      }
    }
  });
  return JSON.stringify(finalScoreObject);
}

function render(ref, data) {
  data.transformedData = parseQuestions(data.questions);

  if (utils.has(data.results)) {
    data.transformedScore = parseScore(data.results);
  }

  return data;
}

module.exports.render = render; // TODO: convert to module.exports.save
}, {"43":43,"177":177}];
