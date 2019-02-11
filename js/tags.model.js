window.modules["tags.model"] = [function(require,module,exports){'use strict';

var _find = require(71),
    _map = require(37),
    _assign = require(57),
    _set = require(87),
    _includes = require(33),
    _require = require(43),
    normalizeTags = _require.normalizeTags,
    invisibleTags = [// invisible tags will be rendered to the page but never visible outside of edit mode
'cut section lede', 'cut homepage lede', 'vulture section lede', 'vulture homepage lede', 'strategist homepage lede', 'no video promo', 'sponsored', 'breaking', 'exclusive', 'top story', 'image gallery', 'fashion week schedule', 'expired sale'];
/**
 * get the rubric from the items
 * @param {array} items
 * @returns {string}
 */


function getRubric(items) {
  var rubric = _find(items, {
    isRubric: true
  });

  return rubric && rubric.text;
}
/**
 * make sure all tags are lowercase and have trimmed whitespace
 * @param  {array} items
 * @return {array}
 */


function clean(items) {
  return _map(items || [], function (item) {
    return _assign({}, item, {
      text: item.text.toLowerCase().trim()
    });
  });
}
/**
 * set an 'invisible' boolean on tags, if they're in the list above
 * @param {array} items
 * @return {array}
 */


function setInvisible(items) {
  return _map(items || [], function (item) {
    return _set(item, 'invisible', _includes(invisibleTags, item.text));
  });
}

module.exports.save = function (uri, data) {
  var items = data.items;
  items = clean(items); // first, make sure everything is lowercase and has trimmed whitespace

  data.normalizedTags = normalizeTags(items);
  items = setInvisible(items); // then figure out which tags should be invisible

  data.featureRubric = getRubric(items); // also grab the feature rubric

  data.items = items;
  return data;
};
}, {"33":33,"37":37,"43":43,"57":57,"71":71,"87":87}];
