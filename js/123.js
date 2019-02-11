window.modules["123"] = [function(require,module,exports){'use strict';

var layouts = {
  'two-horizontal': {
    captionPrefix: 'From left: ',
    mobileCaptionPrefix: 'From top: ',
    layoutItems: [{
      rendition: 'nym-image-collection-horizontal',
      captionIndex: 0
    }, {
      rendition: 'nym-image-collection-horizontal',
      captionIndex: 1
    }]
  },
  'two-square': {
    captionPrefix: 'From left: ',
    layoutItems: [{
      rendition: 'nym-image-collection-square',
      captionIndex: 0
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 1
    }]
  },
  'two-vertical': {
    captionPrefix: 'From left: ',
    layoutItems: [{
      rendition: 'nym-image-collection-vertical',
      captionIndex: 0
    }, {
      rendition: 'nym-image-collection-vertical',
      captionIndex: 1
    }]
  },
  'two-deep-vertical': {
    captionPrefix: 'From left: ',
    layoutItems: [{
      rendition: 'nym-image-collection-deep-vertical',
      captionIndex: 0
    }, {
      rendition: 'nym-image-collection-deep-vertical',
      captionIndex: 1
    }]
  },
  'two-by': {
    captionPrefix: 'From left: ',
    mobileCaptionPrefix: 'From top: ',
    layoutItems: [{
      rendition: 'nym-image-collection-horizontal',
      captionIndex: 0
    }, {
      rendition: 'nym-image-collection-vertical',
      captionIndex: 1
    }]
  },
  'two-by-reverse': {
    captionPrefix: 'From left: ',
    mobileCaptionPrefix: 'From top: ',
    layoutItems: [{
      rendition: 'nym-image-collection-horizontal',
      captionIndex: 1
    }, {
      rendition: 'nym-image-collection-vertical',
      captionIndex: 0
    }]
  },
  'three-by-vertical': {
    captionPrefix: 'Clockwise from left: ',
    layoutItems: [{
      rendition: 'nym-image-collection-vertical',
      captionIndex: 0,
      mobileCaptionIndex: 0
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 1,
      mobileCaptionIndex: 2
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 2,
      mobileCaptionIndex: 1
    }]
  },
  'three-by-vertical-reverse': {
    captionPrefix: 'Clockwise from top left: ',
    layoutItems: [{
      rendition: 'nym-image-collection-vertical',
      captionIndex: 1,
      mobileCaptionIndex: 2
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 0,
      mobileCaptionIndex: 0
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 2,
      mobileCaptionIndex: 1
    }]
  },
  'three-by-deep-vertical': {
    captionPrefix: 'Clockwise from left: ',
    layoutItems: [{
      rendition: 'nym-image-collection-deep-vertical',
      captionIndex: 0,
      mobileCaptionIndex: 0
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 1,
      mobileCaptionIndex: 2
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 2,
      mobileCaptionIndex: 1
    }]
  },
  'three-by-deep-vertical-reverse': {
    captionPrefix: 'Clockwise from top left: ',
    layoutItems: [{
      rendition: 'nym-image-collection-deep-vertical',
      captionIndex: 1,
      mobileCaptionIndex: 2
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 0,
      mobileCaptionIndex: 0
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 2,
      mobileCaptionIndex: 1
    }]
  },
  'three-by-horizontal': {
    captionPrefix: 'Clockwise from top: ',
    layoutItems: [{
      rendition: 'nym-image-collection-horizontal',
      captionIndex: 0
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 2
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 1
    }]
  },
  'three-by-horizontal-reverse': {
    captionPrefix: 'Clockwise from top left: ',
    layoutItems: [{
      rendition: 'nym-image-collection-horizontal',
      captionIndex: 2
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 0
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 1
    }]
  },
  cross: {
    captionPrefix: 'Clockwise from top left: ',
    layoutItems: [{
      rendition: 'nym-image-collection-square',
      captionIndex: 0
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 1
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 3
    }, {
      rendition: 'nym-image-collection-square',
      captionIndex: 2
    }]
  }
},
    layoutsByCollectionSize = [[], ['two-horizontal', 'two-square', 'two-vertical', 'two-deep-vertical', 'two-by', 'two-by-reverse'], ['three-by-vertical', 'three-by-vertical-reverse', 'three-by-deep-vertical', 'three-by-deep-vertical-reverse', 'three-by-horizontal', 'three-by-horizontal-reverse'], ['cross']];
module.exports.layouts = layouts;
module.exports.layoutsByCollectionSize = layoutsByCollectionSize;
}, {}];
