window.modules["kiln_index.kilnplugin"] = [function(require,module,exports){'use strict';

module.exports = function () {
  window.kiln = window.kiln || {}; // create global kiln if it doesn't exist

  window.kiln.helpers = require(1264);
  window.kiln.inputs = window.kiln.inputs || {}; // create global inputs if they don't exist

  window.kiln.modals = window.kiln.modals || {}; // create global modals if they don't exist

  window.kiln.plugins = window.kiln.plugins || {}; // create global vuex plugins if they don't exist

  window.kiln.toolbarButtons = window.kiln.toolbarButtons || {}; // create global toolbar buttons if they don't exist

  window.kiln.validators = window.kiln.validators || {}; // create global validators if they don't exist

  window.kiln.transformers = window.kiln.transformers || {}; // create global transformers if they don't exist
  // require plugins, validators, etc (they will mount themselves on the above properties)

  require("inputs_index.kilnplugin")();

  require("plugins_word-count.kilnplugin")();

  require("plugins_product-count.kilnplugin")();

  require("mediaplay-picker_index.kilnplugin")();

  require("open-in-mediaplay_index.kilnplugin")();

  require("glaze-product_index.kilnplugin")();

  require("plugins_kiln-tracking.kilnplugin")();

  require("plugins_right-rail.kilnplugin")();

  require("plugins_kiln-error-tracking.kilnplugin")();

  require("plugins_cuneiform-sync.kilnplugin")();

  require("syndication_index.kilnplugin")();

  require("article-picker_index.kilnplugin")();

  require("tv-show-picker_index.kilnplugin")();

  require("homepage-tools_index.kilnplugin")();

  require("plugins_page-uri.kilnplugin")();

  require("validators_index.kilnplugin")();

  require("transformers_index.kilnplugin")();
};
}, {"1264":1264,"plugins_product-count.kilnplugin":"plugins_product-count.kilnplugin","plugins_page-uri.kilnplugin":"plugins_page-uri.kilnplugin","plugins_cuneiform-sync.kilnplugin":"plugins_cuneiform-sync.kilnplugin","plugins_right-rail.kilnplugin":"plugins_right-rail.kilnplugin","plugins_kiln-tracking.kilnplugin":"plugins_kiln-tracking.kilnplugin","article-picker_index.kilnplugin":"article-picker_index.kilnplugin","mediaplay-picker_index.kilnplugin":"mediaplay-picker_index.kilnplugin","open-in-mediaplay_index.kilnplugin":"open-in-mediaplay_index.kilnplugin","inputs_index.kilnplugin":"inputs_index.kilnplugin","glaze-product_index.kilnplugin":"glaze-product_index.kilnplugin","tv-show-picker_index.kilnplugin":"tv-show-picker_index.kilnplugin","homepage-tools_index.kilnplugin":"homepage-tools_index.kilnplugin","transformers_index.kilnplugin":"transformers_index.kilnplugin","validators_index.kilnplugin":"validators_index.kilnplugin","plugins_kiln-error-tracking.kilnplugin":"plugins_kiln-error-tracking.kilnplugin","syndication_index.kilnplugin":"syndication_index.kilnplugin","plugins_word-count.kilnplugin":"plugins_word-count.kilnplugin"}];
window.modules["inputs_index.kilnplugin"] = [function(require,module,exports){'use strict';

module.exports = function () {
  window.kiln.inputs['site-select'] = require("inputs_site-select.kilnplugin");
};
}, {"inputs_site-select.kilnplugin":"inputs_site-select.kilnplugin"}];
window.modules["inputs_site-select.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var InputSelect = window.kiln.inputs['input-select'],
    _get = require(32);

module.exports = {
  props: ['name', 'data', 'schema', 'args'],
  data: function data() {
    return {};
  },
  created: function created() {
    var sites = _get(this.$store, 'state.allSites', {});

    this.args.options = Object.values(sites).map(function (site) {
      return {
        name: site.name,
        value: site.slug
      };
    }).sort(function (a, b) {
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    });
  },
  components: {
    InputSelect: InputSelect
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('input-select',{attrs:{"name":_vm.name,"data":_vm.data,"schema":_vm.schema,"args":_vm.args}})}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-31315bc3", __vue__options__)
  } else {
    hotAPI.reload("data-v-31315bc3", __vue__options__)
  }
})()}}, {"8":8,"10":10,"32":32}];
window.modules["article-picker_article.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var UiRippleInk = window.kiln.utils.components.UiRippleInk,
    UiIcon = window.kiln.utils.components.UiIcon,
    _includes = require(33),
    callout = require(80),
    mediaplay = require(53),
    dateHelper = require(1265);

module.exports = {
  props: ['article'],
  data: function data() {
    return {
      selecting: false
    };
  },
  computed: {
    isSelected: function isSelected() {
      return this.article.isSelected;
    },
    imageUrl: function imageUrl() {
      return mediaplay.getDynamicRendition(this.article.imageUrl, 100, 100, false);
    },
    imageSourceSet: function imageSourceSet() {
      var x1 = mediaplay.getDynamicRendition(this.article.imageUrl, 100, 100, false),
          x2 = mediaplay.getDynamicRendition(this.article.imageUrl, 100, 100, true);
      return "".concat(x1, " 1x, ").concat(x2, " 2x");
    },
    headline: function headline() {
      return this.article.headline;
    },
    formattedDate: function formattedDate() {
      return dateHelper(this.article.date);
    },
    siteName: function siteName() {
      return this.article.site ? this.article.site.label : '';
    },
    siteImage: function siteImage() {
      return this.article.site ? "https://assets.nymag.com/media/sites/".concat(this.article.site.value, "/icon.svg") : '';
    },
    calloutType: function calloutType() {
      return callout(this.article);
    },
    calloutImage: function calloutImage() {
      var calloutType = this.calloutType;
      return calloutType ? "https://assets.nymag.com/media/sites/nymag/".concat(calloutType, ".svg") : '';
    }
  },
  methods: {
    select: function select() {
      var _this = this;

      if (!this.isSelected) {
        this.selecting = true;
        this.$nextTick(function () {
          return _this.$emit('select', _this.article);
        });
      }
    },
    unselect: function unselect() {
      var _this2 = this;

      if (this.isSelected && !this.selecting) {
        this.$nextTick(function () {
          return _this2.$emit('select', _this2.article);
        });
      } else if (this.isSelected) {
        this.selecting = false;
      }
    }
  },
  components: {
    UiRippleInk: UiRippleInk,
    UiIcon: UiIcon
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"article",staticClass:"article-picker-article kiln-accent-color",on:{"mousedown":_vm.select,"mouseup":_vm.unselect}},[_c('div',{staticClass:"article-picker-article-img-wrap"},[_c('img',{staticClass:"article-picker-article-img",attrs:{"src":_vm.imageUrl,"srcset":_vm.imageSourceSet}}),_vm._v(" "),(_vm.calloutType)?_c('span',{staticClass:"article-picker-article-callout-wrap"},[_c('img',{staticClass:"article-picker-article-callout",attrs:{"src":_vm.calloutImage,"alt":_vm.calloutType}})]):_vm._e()]),_vm._v(" "),_c('ui-ripple-ink',{attrs:{"trigger":"article"}}),_vm._v(" "),_c('div',{staticClass:"article-picker-article-info"},[_c('span',{staticClass:"article-picker-article-date kiln-body"},[_c('img',{staticClass:"article-picker-article-site",attrs:{"src":_vm.siteImage,"alt":_vm.siteName}}),_vm._v("\n      "+_vm._s(_vm.formattedDate)+"\n    ")]),_vm._v(" "),_c('span',{staticClass:"article-picker-article-headline kiln-body",domProps:{"innerHTML":_vm._s(_vm.headline)}})]),_vm._v(" "),(_vm.isSelected)?_c('ui-icon',{staticClass:"article-picker-article-check",attrs:{"icon":"check","ariaLabel":"Selected"}}):_vm._e(),_vm._v(" "),(_vm.isSelected)?_c('div',{staticClass:"article-picker-article-selected-overlay kiln-accent-color"}):_vm._e()],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-223de7bc", __vue__options__)
  } else {
    hotAPI.reload("data-v-223de7bc", __vue__options__)
  }
})()}}, {"8":8,"10":10,"33":33,"53":53,"80":80,"1265":1265}];
window.modules["article-picker_index.kilnplugin"] = [function(require,module,exports){'use strict';

module.exports = function () {
  window.kiln.inputs['article-picker'] = require("article-picker_input.kilnplugin");
  window.kiln.modals['article-picker'] = require("article-picker_modal.kilnplugin");
  window.kiln.selectorButtons['article-picker'] = require("article-picker_selector-button.kilnplugin");
};
}, {"article-picker_selector-button.kilnplugin":"article-picker_selector-button.kilnplugin","article-picker_input.kilnplugin":"article-picker_input.kilnplugin","article-picker_modal.kilnplugin":"article-picker_modal.kilnplugin"}];
window.modules["article-picker_input.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var UiIconButton = window.kiln.utils.components.UiIconButton;
module.exports = {
  props: ['name', 'data', 'schema', 'args'],
  data: function data() {
    return {};
  },
  methods: {
    openPicker: function openPicker() {
      var multiple = !!this.args.multiple,
          useCurrentSite = !!this.args.useCurrentSite,
          uri = this.$store.state.ui.currentForm.uri,
          path = this.$store.state.ui.currentForm.path,
          field = this.name;
      var config = {
        title: 'Find an Article',
        size: 'large',
        type: 'article-picker',
        data: {
          uri: uri,
          field: field,
          multiple: multiple,
          useCurrentSite: useCurrentSite
        }
      };

      if (!this.args.autoClose) {
        config.redirectTo = {
          uri: uri,
          path: path,
          field: field
        };
      }

      this.$store.dispatch('openModal', config);
    }
  },
  components: {
    UiIconButton: UiIconButton
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ui-icon-button',{attrs:{"buttonType":"button","color":"default","type":"secondary","tooltip":"Find an Article","icon":"search"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.openPicker($event)}}})}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-081ae1f6", __vue__options__)
  } else {
    hotAPI.reload("data-v-081ae1f6", __vue__options__)
  }
})()}}, {"8":8,"10":10}];
window.modules["article-picker_modal.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UiTextbox = window.kiln.utils.components.UiTextbox,
    UiCheckboxGroup = window.kiln.utils.components.UiCheckboxGroup,
    UiCheckbox = window.kiln.utils.components.UiCheckbox,
    UiDatepicker = window.kiln.utils.components.UiDatepicker,
    UiButton = window.kiln.utils.components.UiButton,
    UiProgressCircular = window.kiln.utils.components.UiProgressCircular,
    queryService = require(49),
    sanitize = require(39),
    _filter = require(51),
    _find = require(71),
    _get = require(32),
    _set = require(87),
    _cloneDeep = require(47),
    _isEmpty = require(75),
    dateFormat = require(52),
    article = require("article-picker_article.kilnplugin"),
    TODAY = new Date(),
    SEARCH_INDEX = 'published-articles',
    SEARCH_MAX = 100,
    SEARCH_FIELDS = ['plaintextPrimaryHeadline^1.5', 'teaser^1', 'tags^1', 'pageDescription^0.5', 'pageTitle^0.5'],
    RESULT_FIELDS = ['primaryHeadline', 'feedImgUrl', 'date', 'canonicalUrl', 'site', 'featureTypes', 'tags'],
    CONTENT_TYPES = ['Feature', 'Gallery', 'Video'],
    SITES = [{
  label: 'Intelligencer',
  value: 'intelligencer'
}, {
  label: 'The Cut',
  value: 'wwwthecut'
}, {
  label: 'Vulture',
  value: 'vulture'
}, {
  label: 'Grub Street',
  value: 'grubstreet'
}, {
  label: 'The Strategist',
  value: 'strategist'
}],
    currentSiteInPicker = _find(SITES, function (s) {
  return s.value === _get(window.kiln.locals.site, 'slug', '');
});

function getArticles(filters) {
  var queryTerm = sanitize.toSmartText(filters.queryTerm.trim()),
      tagList = filters.tags.trim() ? filters.tags.split(',').map(function (tag) {
    return tag.trim().toLowerCase();
  }) : [],
      query = queryService(SEARCH_INDEX, window.kiln.locals),
      siteSubQuery,
      contentSubQuery,
      dateRange,
      multiMust = {
    multi_match: {
      query: queryTerm,
      fields: SEARCH_FIELDS,
      type: 'best_fields',
      cutoff_frequency: 0.0007,
      operator: 'and'
    }
  },
      phraseShould = {
    constant_score: {
      filter: {
        match_phrase_prefix: {
          plaintextPrimaryHeadline: queryTerm
        }
      },
      boost: 1.5
    }
  };

  if (queryTerm) {
    queryService.addMust(query, multiMust);
    queryService.addShould(query, phraseShould);
    queryService.addSort(query, {
      _score: 'desc'
    });
  }

  if (filters.selectedSites.length) {
    siteSubQuery = queryService(SEARCH_INDEX, window.kiln.locals);
    filters.selectedSites.forEach(function (site) {
      return queryService.addShould(siteSubQuery, {
        term: {
          site: site
        }
      });
    });
    queryService.addMinimumShould(siteSubQuery, 1);
    queryService.addFilter(query, siteSubQuery.body.query);
  }

  if (filters.selectedContentTypes.length) {
    contentSubQuery = queryService(SEARCH_INDEX, window.kiln.locals);

    if (filters.selectedContentTypes.includes('Feature')) {
      queryService.addShould(contentSubQuery, {
        term: {
          'featureTypes.Feature': true
        }
      });
    }

    if (filters.selectedContentTypes.includes('Gallery')) {
      queryService.addShould(contentSubQuery, {
        terms: {
          tags: ['gallery', 'slideshow']
        }
      });
    }

    if (filters.selectedContentTypes.includes('Video')) {
      queryService.addShould(contentSubQuery, {
        term: {
          'featureTypes.Video-Original': true
        }
      });
      queryService.addShould(contentSubQuery, {
        term: {
          'featureTypes.Video-Original News': true
        }
      });
      queryService.addShould(contentSubQuery, {
        term: {
          'featureTypes.Video-Aggregation': true
        }
      });
    }

    queryService.addMinimumShould(contentSubQuery, 1);
    queryService.addFilter(query, contentSubQuery.body.query);
  }

  if (tagList.length) {
    queryService.addFilter(query, {
      terms: {
        tags: tagList
      }
    });
  }

  if (filters.publishedFrom || filters.publishedTo) {
    dateRange = {
      range: {
        date: {
          time_zone: '-05:00',
          format: 'yyyy-MM-dd'
        }
      }
    };

    if (filters.publishedFrom) {
      dateRange.range.date.gte = dateFormat(filters.publishedFrom, 'YYYY-MM-DD');
    }

    if (filters.publishedTo) {
      dateRange.range.date.lt = "".concat(dateFormat(filters.publishedTo, 'YYYY-MM-DD'), "||+1d");
    }

    queryService.addFilter(query, dateRange);
  } else {
    queryService.addShould(query, {
      range: {
        date: {
          gt: 'now-7d',
          boost: 4
        }
      }
    });
    queryService.addShould(query, {
      range: {
        date: {
          gt: 'now-1M',
          boost: 2
        }
      }
    });
  }

  if (!filters.includeNonFeed) {
    queryService.addFilter(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
  }

  if (_isEmpty(query.body.query)) {
    delete query.body.query;
  }

  queryService.onlyWithTheseFields(query, RESULT_FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, SEARCH_MAX);
  return queryService.searchByQueryWithRawResult(query).then(function (result) {
    return {
      articles: _.map(result.hits.hits, '_source'),
      count: result.hits.total
    };
  });
}

function getResultDescription(filters) {
  var builtDesc = 'Latest articles',
      joiner = ' by',
      siteDesc = '';

  if (filters.queryTerm) {
    return 'Search results';
  }

  if (filters.publishedFrom || filters.publishedTo) {
    builtDesc = 'Articles by date';
    joiner = filters.selectedContentTypes.length && filters.tags ? ',' : ' and';
  }

  if (filters.selectedContentTypes.length) {
    builtDesc += "".concat(joiner, " content type");
    joiner = ' and';
  }

  if (filters.tags) {
    builtDesc += "".concat(joiner, " tag");
  }

  if (filters.selectedSites.length) {
    siteDesc = 'multiple sites';

    if (filters.selectedSites.length === 1) {
      siteDesc = _find(SITES, function (s) {
        return s.value === filters.selectedSites[0];
      }).label;
    }

    builtDesc += " on ".concat(siteDesc);
  }

  return builtDesc;
}

;

function parseArticle(article) {
  var site = _find(SITES, function (site) {
    return site.value === article.site;
  });

  return {
    headline: article.primaryHeadline,
    imageUrl: article.feedImgUrl,
    date: article.date,
    url: article.canonicalUrl,
    featureTypes: article.featureTypes,
    tags: article.tags,
    site: site,
    isSelected: false
  };
}

module.exports = {
  props: ['data'],
  data: function data() {
    var initialSites = this.data.useCurrentSite && window.kiln.locals && currentSiteInPicker ? [window.kiln.locals.site.slug] : [];
    return {
      isLoading: true,
      isExpanded: false,
      results: {
        articles: [],
        totalCount: 0,
        description: ''
      },
      filters: {
        queryTerm: '',
        contentTypes: CONTENT_TYPES,
        selectedContentTypes: [],
        sites: SITES,
        selectedSites: initialSites,
        tags: '',
        maxDate: TODAY,
        publishedFrom: null,
        publishedTo: null,
        includeNonFeed: false
      }
    };
  },
  computed: {
    selectText: function selectText() {
      return "Select Article".concat(this.data.multiple ? 's' : '');
    },
    expandIcon: function expandIcon() {
      return this.isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    },
    expandText: function expandText() {
      return this.isExpanded ? 'Hide advanced filters' : 'Show advanced filters';
    },
    noArticlesFound: function noArticlesFound() {
      return this.results.totalCount === 0;
    },
    selectedArticles: function selectedArticles() {
      return _filter(this.results.articles, function (article) {
        return article.isSelected;
      }).map(function (article) {
        return article.url;
      });
    },
    hasSelectedArticles: function hasSelectedArticles() {
      return this.selectedArticles.length !== 0;
    },
    resultCount: function resultCount() {
      var suffix = this.results.totalCount === 1 ? '' : 's';

      if (this.results.totalCount > SEARCH_MAX) {
        return "First ".concat(SEARCH_MAX, " of ").concat(this.results.totalCount > 1000 ? '1,000+' : this.results.totalCount, " article").concat(suffix);
      }

      return "".concat(this.results.totalCount, " article").concat(suffix);
    }
  },
  methods: {
    toggleAdvancedFilters: function toggleAdvancedFilters() {
      this.isExpanded = !this.isExpanded;
    },
    handleQuery: function handleQuery() {
      var _this = this;

      this.isLoading = true;
      getArticles(this.filters).then(function (result) {
        _this.results.articles = result.articles.map(parseArticle);
        _this.results.totalCount = result.count;
        _this.results.description = getResultDescription(_this.filters);
        _this.isLoading = false;
      }).catch(function () {
        _this.results.articles = [];
        _this.results.totalCount = 0;
        _this.results.description = '';
        _this.isLoading = false;
      });
    },
    reset: function reset() {
      this.filters.queryTerm = '';
      this.$refs.siteFilterBoxes.reset();
      this.$refs.contentFilterBoxes.reset();
      this.filters.tags = '';
      this.filters.publishedFrom = null;
      this.filters.publishedTo = null;
      this.filters.includeNonFeed = false;
      this.handleQuery();
    },
    close: function close() {
      this.$store.dispatch('closeModal');
    },
    select: function select(article) {
      if (article.isSelected) {
        article.isSelected = false;
      } else if (this.hasSelectedArticles && this.data.multiple) {
        article.isSelected = true;
      } else if (this.hasSelectedArticles) {
        var currentSelectedArticle = _find(this.results.articles, function (a) {
          return a.isSelected;
        });

        currentSelectedArticle.isSelected = false;
        article.isSelected = true;
      } else {
        article.isSelected = true;
      }
    },
    addArticles: function addArticles() {
      var _this2 = this;

      var currentURI = this.data.uri,
          currentField = this.data.field,
          topLevelField = currentField.split('.')[0],
          articleUrls = this.selectedArticles.join(',');

      var fieldData = _get(this.$store, "state.components['".concat(currentURI, "']['").concat(topLevelField, "']")),
          currentData = _defineProperty({}, topLevelField, _cloneDeep(fieldData));

      _set(currentData, currentField, articleUrls);

      this.$store.dispatch('saveComponent', {
        uri: currentURI,
        data: currentData
      }).then(function () {
        return _this2.close();
      });
    }
  },
  mounted: function mounted() {
    this.handleQuery();
  },
  components: {
    UiTextbox: UiTextbox,
    UiCheckboxGroup: UiCheckboxGroup,
    UiCheckbox: UiCheckbox,
    UiDatepicker: UiDatepicker,
    UiButton: UiButton,
    UiProgressCircular: UiProgressCircular,
    'article-result': article
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"article-picker"},[_c('div',{staticClass:"article-picker-wrap"},[_c('div',{staticClass:"article-picker-head"},[_c('div',{staticClass:"article-picker-filter-item"},[_c('ui-textbox',{attrs:{"type":"search","placeholder":"Search headlines, teasers, and tags","autofocus":true},on:{"keydown-enter":_vm.handleQuery},model:{value:(_vm.filters.queryTerm),callback:function ($$v) {_vm.$set(_vm.filters, "queryTerm", $$v)},expression:"filters.queryTerm"}})],1),_vm._v(" "),_c('div',{staticClass:"article-picker-filter-item article-picker-checkboxes"},[_c('ui-checkbox-group',{ref:"siteFilterBoxes",attrs:{"options":_vm.filters.sites,"color":"primary"},on:{"change":_vm.handleQuery},model:{value:(_vm.filters.selectedSites),callback:function ($$v) {_vm.$set(_vm.filters, "selectedSites", $$v)},expression:"filters.selectedSites"}},[_vm._v("Filter by site")])],1),_vm._v(" "),_c('div',{staticClass:"article-picker-filter-item article-picker-checkboxes"},[_c('ui-checkbox-group',{ref:"contentFilterBoxes",attrs:{"options":_vm.filters.contentTypes,"color":"primary"},on:{"change":_vm.handleQuery},model:{value:(_vm.filters.selectedContentTypes),callback:function ($$v) {_vm.$set(_vm.filters, "selectedContentTypes", $$v)},expression:"filters.selectedContentTypes"}},[_vm._v("Filter by content type")])],1),_vm._v(" "),_c('ui-button',{staticClass:"article-picker-expand-button",attrs:{"type":"secondary","color":"accent","buttonType":"button","iconPosition":"right","size":"small","disableRipple":true,"icon":_vm.expandIcon,"ariaLabel":_vm.expandText},on:{"click":function($event){$event.stopPropagation();return _vm.toggleAdvancedFilters($event)}}},[_vm._v("Advanced options")]),_vm._v(" "),(_vm.isExpanded)?_c('div',{staticClass:"article-picker-expanded-filters"},[_c('div',{staticClass:"article-picker-filter-item"},[_c('ui-textbox',{attrs:{"help":"To match multiple tags, separate with a comma. Articles will be included if they match ANY tag"},on:{"keydown-enter":_vm.handleQuery},model:{value:(_vm.filters.tags),callback:function ($$v) {_vm.$set(_vm.filters, "tags", $$v)},expression:"filters.tags"}},[_vm._v("Filter by tag")])],1),_vm._v(" "),_c('div',{staticClass:"article-picker-filter-item article-picker-date-range"},[_c('ui-datepicker',{attrs:{"max-date":_vm.filters.maxDate,"color":"primary"},on:{"input":_vm.handleQuery},model:{value:(_vm.filters.publishedFrom),callback:function ($$v) {_vm.$set(_vm.filters, "publishedFrom", $$v)},expression:"filters.publishedFrom"}},[_vm._v("Published after")]),_vm._v(" "),_c('ui-datepicker',{attrs:{"max-date":_vm.filters.maxDate,"color":"primary"},on:{"input":_vm.handleQuery},model:{value:(_vm.filters.publishedTo),callback:function ($$v) {_vm.$set(_vm.filters, "publishedTo", $$v)},expression:"filters.publishedTo"}},[_vm._v("Published before")])],1),_vm._v(" "),_c('div',{staticClass:"article-picker-filter-item"},[_c('ui-checkbox',{attrs:{"color":"primary"},on:{"change":_vm.handleQuery},model:{value:(_vm.filters.includeNonFeed),callback:function ($$v) {_vm.$set(_vm.filters, "includeNonFeed", $$v)},expression:"filters.includeNonFeed"}},[_vm._v("Include non-newsfeed articles")])],1)]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"article-picker-head-btns"},[_c('ui-button',{attrs:{"type":"primary","buttonType":"button","color":"accent","icon":"search","iconPosition":"right","size":"small"},on:{"click":function($event){$event.stopPropagation();return _vm.handleQuery($event)}}},[_vm._v("Search")]),_vm._v(" "),_c('ui-button',{attrs:{"type":"primary","buttonType":"button","color":"default","size":"small"},on:{"click":function($event){$event.stopPropagation();return _vm.reset($event)}}},[_vm._v("Reset Filters")])],1)],1),_vm._v(" "),_c('div',{staticClass:"article-picker-body"},[_c('transition',{attrs:{"mode":"out-in","name":"fade"}},[(_vm.isLoading)?_c('div',{key:"loading-spinner",staticClass:"article-picker-filler"},[_c('ui-progress-circular',{attrs:{"size":56}})],1):_c('div',{key:"loaded-content",staticClass:"article-picker-search-results"},[_c('div',{staticClass:"article-picker-results-heading"},[_c('h2',{staticClass:"kiln-list-header"},[_vm._v(_vm._s(_vm.results.description))]),_vm._v(" "),_c('span',{staticClass:"kiln-list-header"},[_vm._v(_vm._s(_vm.resultCount))])]),_vm._v(" "),(_vm.noArticlesFound)?_c('div',{key:"no-content",staticClass:"article-picker-filler kiln-display1"},[_vm._v("No articles found")]):_c('ol',{staticClass:"article-picker-items"},_vm._l((_vm.results.articles),function(article){return _c('li',{staticClass:"article-picker-item kiln-accent-color"},[_c('article-result',{attrs:{"article":article},on:{"select":function($event){_vm.select(article)}}})],1)}),0)])])],1)]),_vm._v(" "),_c('div',{staticClass:"article-picker-foot ui-button-group"},[_c('ui-button',{attrs:{"type":"primary","buttonType":"button","color":"default"},on:{"click":function($event){$event.stopPropagation();return _vm.close($event)}}},[_vm._v("Cancel")]),_vm._v(" "),_c('ui-button',{attrs:{"type":"primary","buttonType":"button","color":"accent","disabled":!_vm.hasSelectedArticles},on:{"click":function($event){$event.stopPropagation();return _vm.addArticles($event)}}},[_vm._v(_vm._s(_vm.selectText))])],1)])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-23b15b59", __vue__options__)
  } else {
    hotAPI.reload("data-v-23b15b59", __vue__options__)
  }
})()}}, {"8":8,"10":10,"32":32,"39":39,"47":47,"49":49,"51":51,"52":52,"71":71,"75":75,"87":87,"article-picker_article.kilnplugin":"article-picker_article.kilnplugin"}];
window.modules["article-picker_selector-button.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var UiIconButton = window.kiln.utils.components.UiIconButton,
    _require = require(56),
    getComponentName = _require.getComponentName,
    PICKER_COMPONENTS = [{
  name: 'manual-article',
  field: 'articleUrl',
  autoClose: true
}, {
  name: 'nymag-latest-feed',
  field: 'newManualArticles',
  multiple: true,
  autoClose: true
}];

module.exports = {
  data: function data() {
    return {};
  },
  computed: {
    hasArticlePicker: function hasArticlePicker() {
      var params = this.getComponentParams();
      return !!params && params.field;
    },
    promptText: function promptText() {
      var params = this.getComponentParams();
      return params && params.multiple ? 'Select Articles' : 'Select Article';
    }
  },
  methods: {
    getComponentParams: function getComponentParams() {
      var uri = this.$store.state.ui.currentSelection.uri,
          componentName = getComponentName(uri);
      return PICKER_COMPONENTS.find(function (cmpt) {
        return cmpt.name === componentName;
      });
    },
    openArticlePicker: function openArticlePicker() {
      var uri = this.$store.state.ui.currentSelection.uri,
          cmptParams = this.getComponentParams();
      var config = {
        title: 'Find an Article',
        size: 'large',
        type: 'article-picker',
        data: {
          uri: uri,
          field: cmptParams.field,
          multiple: cmptParams.multiple || false,
          useCurrentSite: cmptParams.useCurrentSite || false
        }
      };

      if (!cmptParams.autoClose) {
        config.redirectTo = {
          uri: uri,
          path: path,
          field: field
        };
      }

      this.$store.dispatch('openModal', config);
    }
  },
  components: {
    UiIconButton: UiIconButton
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.hasArticlePicker)?_c('ui-icon-button',{staticClass:"quick-bar-button",attrs:{"buttonType":"button","color":"primary","type":"secondary","icon":"search","tooltip":_vm.promptText},on:{"click":function($event){$event.stopPropagation();return _vm.openArticlePicker($event)}}}):_vm._e()}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8c2a89e8", __vue__options__)
  } else {
    hotAPI.reload("data-v-8c2a89e8", __vue__options__)
  }
})()}}, {"8":8,"10":10,"56":56}];
window.modules["plugins_cuneiform-sync.kilnplugin"] = [function(require,module,exports){(function (process){
'use strict';
/* A plugin for editing a page populated by Cuneiform.
 * When a user updates a Cuneiform component, this plugin asks Cuneiform
 * for a list of components to be updated and updates each component
 * in that list.
 */

var rest = require(5),
    _get = require(32),
    _intersection = require(173),
    CUNEIFORM_HOST = window.process.env.CUNEIFORM_HOST,
    WATCH_FIELDS = ['cuneiformQuery', 'cuneiformScopes', 'cuneiformIgnore', 'cuneiformPinned', 'cuneiformQueries'];

var updatingPage = false,
    updatingComponent;
/**
 * Check if a component with the specified URI is a Cuneiform component
 * @param {Object} data component data
 * @returns {boolean}
 */

function isCuneiformCmpt(data) {
  return !!(data.cuneiformQuery || data.cuneiformIgnore !== undefined || data.cuneiformScopes || data.cuneiformPinned !== undefined);
}
/**
 * Request updated components for the current page.
 * @param {String} page
 * @returns {Promise} resolves with updated components (Object[])
 */


function requestUpdatedComponents(page) {
  return rest.post("".concat(CUNEIFORM_HOST), {
    page: page,
    // tell the service NOT to PUT new instance data; Kiln will
    commitInstances: false
  });
}
/**
 * Save the given updated instances to the given store.
 * @param {Object} store
 * @param {Object[]} updatedInstances
 * @return {Promise}
 */


function saveUpdates(store, updatedInstances) {
  return Promise.all(updatedInstances.map(function (instance) {
    return store.dispatch('saveComponent', {
      uri: instance._ref,
      data: {
        cuneiformResults: instance.cuneiformResults
      }
    });
  }));
}
/**
 * Update the current page with new article data based on the
 * microservice.
 * @param {object} store
 * @returns {Promise}
 */


function updatePage(store) {
  var pageUrl = "".concat(_get(window, 'location.protocol', 'http:'), "//").concat(_get(store, 'state.page.uri'));
  var componentEl;
  updatingPage = true;

  if (updatingComponent) {
    componentEl = document.querySelector("[data-uri=\"".concat(updatingComponent, "\"]"));

    if (componentEl) {
      componentEl.style.opacity = '.2';
      componentEl.style.background = 'grey';
    }
  }

  return requestUpdatedComponents(pageUrl).then(saveUpdates.bind(this, store)).catch(console.error).then(function () {
    updatingPage = false;

    if (componentEl) {
      componentEl.style.removeProperty('opacity');
      componentEl.style.removeProperty('background');
    }
  });
}
/**
 * Check if a Kiln mutation should trigger a page update.
 * @param {object} mutation
 * @returns {boolean}
 */


function shouldUpdatePage(mutation) {
  if (mutation.type !== 'UPDATE_COMPONENT') return;
  if (!isCuneiformCmpt(mutation.payload.data)) return; // if we're in the middle of a page update, don't trigger another update!

  if (updatingPage) return; // only trigger cuneiform when query fields are changed

  if (_intersection(mutation.payload.fields, WATCH_FIELDS).length === 0) return;
  updatingComponent = mutation.payload.uri;
  return true;
}
/**
 * Updates the page after the last save has completed.
 * @param {object} store
 */


function updateOnSaveComplete(store) {
  var unsubscribe = store.subscribe(function (mutation) {
    if (mutation.type === 'FINISH_PROGRESS' && mutation.payload === 'save') {
      updatePage(store);
      unsubscribe();
    }
  });
}

module.exports = function () {
  window.kiln.plugins['cuneiform'] = function (store) {
    store.subscribe(function (mutation) {
      if (!shouldUpdatePage(mutation)) return;
      updateOnSaveComplete(store);
    });
  };
};

}).call(this,require(22))}, {"5":5,"22":22,"32":32,"173":173}];
window.modules["glaze-product_index.kilnplugin"] = [function(require,module,exports){'use strict';

module.exports = function () {
  window.kiln = window.kiln || {}; // create global kiln if it doesn't exist

  window.kiln.inputs = window.kiln.inputs || {}; // create global inputs if they don't exist

  window.kiln.modals = window.kiln.modals || {}; // create global modals if they don't exist

  window.kiln.inputs['product-image'] = require("glaze-product_input.kilnplugin");
  window.kiln.modals['product-image'] = require("glaze-product_modal.kilnplugin");
};
}, {"glaze-product_modal.kilnplugin":"glaze-product_modal.kilnplugin","glaze-product_input.kilnplugin":"glaze-product_input.kilnplugin"}];
window.modules["glaze-product_input.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var UiIconButton = window.kiln.utils.components.UiIconButton;
module.exports = {
  props: ['name', 'data', 'schema', 'args'],
  data: function data() {
    return {};
  },
  methods: {
    openGlaze: function openGlaze() {
      var overridePath = this.args.overridePath,
          uri = this.$store.state.ui.currentForm.uri,
          path = this.name;
      var modalConfig = {
        title: 'Upload New Product Image',
        size: 'large',
        type: 'product-image',
        data: {
          uri: uri,
          path: path,
          overridePath: overridePath
        }
      };
      modalConfig.redirectTo = {
        uri: uri,
        path: this.$store.state.ui.currentForm.path,
        field: this.name
      };
      this.$store.dispatch('openModal', modalConfig);
    }
  },
  components: {
    UiIconButton: UiIconButton
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ui-icon-button',{attrs:{"buttonType":"button","color":"default","type":"secondary","tooltip":"Upload New Product Image","icon":"cloud_upload"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.openGlaze($event)}}})}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7750f8c4", __vue__options__)
  } else {
    hotAPI.reload("data-v-7750f8c4", __vue__options__)
  }
})()}}, {"8":8,"10":10}];
window.modules["glaze-product_modal.kilnplugin"] = [function(require,module,exports){(function (process){
;(function(){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UiButton = window.kiln.utils.components.UiButton,
    UiIcon = window.kiln.utils.components.UiIcon,
    UiTextbox = window.kiln.utils.components.UiTextbox,
    UiProgressCircular = window.kiln.utils.components.UiProgressCircular,
    _every = require(93),
    _get = require(32),
    _set = require(87),
    _size = require(909),
    _cloneDeep = require(47),
    _require = require(1266),
    getSitePath = _require.getSitePath,
    rest = require(5),
    GLAZE_HOST = window.process.env.GLAZE_HOST,
    GLAZE_ENDPOINT = "".concat(GLAZE_HOST, "/");

require(182);

function sendToGlaze(imageUrl, mediaplayPath) {
  var payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      imageUrl: imageUrl,
      mediaplayPath: mediaplayPath
    })
  };
  return fetch(GLAZE_ENDPOINT, payload).then(function (res) {
    return res.json();
  }).then(function (data) {
    var mediaplayUrl = data.mediaplayUrl;

    if (!mediaplayUrl) {
      var message = data.message || 'mediaplayUrl expected in payload',
          e = new Error(message);
      e.name = data.errorType;
      throw e;
    }

    return mediaplayUrl;
  });
}

function parseFiles(result, file) {
  if (file.isDirectory) {
    result.directories.push(file.basename);
  }

  return result;
}

module.exports = {
  props: ['data'],
  data: function data() {
    return {
      createFolderName: '',
      directories: [],
      isDoneProcessingImage: false,
      isLoading: true,
      isProcessingImage: false,
      filename: '',
      glazeError: '',
      path: '',
      showCreateFolder: '',
      sourceUrl: ''
    };
  },
  computed: {
    showOverlay: function showOverlay() {
      return this.isProcessingImage || this.isDoneProcessingImage;
    },
    requiresNewDirectory: function requiresNewDirectory() {
      return this.showCreateFolder ? !!this.createFolderName : true;
    },
    hasRequiredFields: function hasRequiredFields() {
      var _this = this;

      var requiredFields = ['filename', 'sourceUrl', 'requiresNewDirectory'];
      return _every(requiredFields, function (field) {
        return !!_this[field];
      });
    },
    pathArray: function pathArray() {
      return this.path.length ? this.path.split('/') : [];
    }
  },
  methods: {
    sanitizeFields: function sanitizeFields() {
      this.filename = this.filename.split(' ').join('-');
      this.createFolderName = this.createFolderName.split(' ').join('-');
    },
    processImage: function processImage() {
      var _this2 = this;

      var mediaplayPath;
      this.sanitizeFields();

      if (this.showCreateFolder && this.createFolderName) {
        mediaplayPath = "".concat(this.path, "/").concat(this.createFolderName, "/").concat(this.filename);
      } else {
        mediaplayPath = "".concat(this.path, "/").concat(this.filename);
      }

      mediaplayPath = mediaplayPath.match(/jp[e]*g/) ? mediaplayPath : "".concat(mediaplayPath, ".jpg");
      this.glazeError = '';
      this.isProcessingImage = true;
      sendToGlaze(this.sourceUrl, mediaplayPath).then(function (imgUrl) {
        _this2.mediaplayImageUrl = imgUrl;
        _this2.isDoneProcessingImage = true;
        setTimeout(_this2.setImageUrl.bind(_this2), 1000);
      }).catch(function (err) {
        var type = err.name;

        if (type === 'ImageSizeError') {
          _this2.glazeError = 'This image is too small, it must be at least 600 pixels in width.<br/><br/>' + "If you can't find a larger image, please submit your request through the photo team.";
        } else if (type === 'ImageVerticalError') {
          _this2.glazeError = 'Vertical images with a non-white background cannot be handled by this tool.<br/><br/>' + "Please submit your request through the photo team.";
        } else {
          _this2.glazeError = 'There was an error processing your image, please try again';
        }

        _this2.resetProcessingState();
      });
    },
    revealCreateFolder: function revealCreateFolder() {
      this.showCreateFolder = true;
    },
    hideCreateFolder: function hideCreateFolder() {
      this.createFolderName = '';
      this.showCreateFolder = false;
    },
    resetProcessingState: function resetProcessingState() {
      this.isProcessingImage = false;
      this.isDoneProcessingImage = false;
    },
    setImageUrl: function setImageUrl() {
      var currentURI = this.data.uri,
          currentPath = this.data.path,
          rootPath = currentPath.split('.')[0];

      if (this.mediaplayImageUrl) {
        var currentField = _get(this.$store, "state.components['".concat(currentURI, "']['").concat(rootPath, "']")),
            currentData = _defineProperty({}, rootPath, _cloneDeep(currentField));

        _set(currentData, currentPath, this.mediaplayImageUrl);

        return this.$store.dispatch('saveComponent', {
          uri: currentURI,
          data: currentData
        }).then(this.close);
      }
    },
    navPath: function navPath() {
      var _this3 = this;

      this.path = this.path.replace(/^\//, '');
      this.path = this.path.replace(/\/$/, '');
      this.isLoading = true;
      return rest.get("https://api.nymag.com/v1/content/assets/files?parent-path=".concat(this.path, "&limit=1000")).then(function (res) {
        if (_size(res.pagination)) {
          _this3.isLoading = false;
          _this3.directories = [];
        } else {
          var _res$files$reduce = res.files.reduce(parseFiles, {
            directories: []
          }),
              directories = _res$files$reduce.directories;

          _this3.isLoading = false;
          _this3.directories = directories;
        }
      }).catch(function () {
        _this3.isLoading = false;
        _this3.directories = [];
      });
    },
    navIndex: function navIndex(index) {
      this.hideCreateFolder();
      this.path = this.pathArray.slice(0, index + 1).join('/');
      this.navPath();
    },
    close: function close() {
      this.$store.dispatch('closeModal');
    },
    setFolder: function setFolder(directory) {
      this.hideCreateFolder();
      this.path = "".concat(this.path, "/").concat(directory);
      this.navPath();
    }
  },
  mounted: function mounted() {
    var slug = _get(this.$store, 'state.site.slug');

    this.path = this.data.overridePath || getSitePath(slug);
    this.navPath();
  },
  components: {
    UiButton: UiButton,
    UiIcon: UiIcon,
    UiTextbox: UiTextbox,
    UiProgressCircular: UiProgressCircular
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"glaze-product"},[_c('transition',{attrs:{"mode":"out-in","name":"fade"}},[(_vm.showOverlay)?_c('div',{staticClass:"glaze-product-overlay"},[(!_vm.isDoneProcessingImage)?_c('div',{staticClass:"glaze-product-overlay-message"},[_vm._v("\n        Please wait while your image is being processed\n        "),_c('ui-progress-circular',{attrs:{"size":50}})],1):_c('div',{staticClass:"glaze-product-overlay-message"},[_vm._v("\n        Your image has been uploaded\n        "),_c('ui-icon',{attrs:{"icon":"done"}})],1)]):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"glaze-product-body"},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.glazeError),expression:"glazeError"}],staticClass:"glaze-product-error"},[_c('p',{domProps:{"innerHTML":_vm._s(_vm.glazeError)}})]),_vm._v(" "),_c('div',{staticClass:"glaze-product-input"},[_c('ui-textbox',{class:{ 'is-empty': !_vm.sourceUrl },attrs:{"floatingLabel":true,"label":"Original Image URL*"},model:{value:(_vm.sourceUrl),callback:function ($$v) {_vm.sourceUrl=$$v},expression:"sourceUrl"}})],1),_vm._v(" "),_c('div',{staticClass:"glaze-product-input"},[(_vm.isLoading)?_c('div',{key:"loading-spinner",staticClass:"glaze-product-filler"},[_c('ui-progress-circular',{attrs:{"size":56}})],1):_c('div',{key:"loaded-content",staticClass:"glaze-product-items ui-button-group"},[_c('span',{staticClass:"glaze-product-breadcrumbs-header"},[_vm._v("Where would you like to save this image?")]),_vm._v(" "),_c('div',{staticClass:"glaze-product-breadcrumbs"},_vm._l((_vm.pathArray),function(segment,index){return _c('div',{key:index,staticClass:"glaze-product-breadcrumb"},[_c('ui-button',{attrs:{"type":"secondary","buttonType":"button","color":"default","size":"medium"},on:{"click":function($event){$event.stopPropagation();_vm.navIndex(index)}}},[_vm._v(_vm._s(segment)+"\n            ")]),_vm._v(" "),(index < _vm.pathArray.length - 1)?_c('ui-icon',{attrs:{"icon":"chevron_right"}}):_vm._e()],1)}),0),_vm._v(" "),_c('div',{staticClass:"ui-button-group"},[_vm._l((_vm.directories),function(directory){return _c('ui-button',{key:directory,staticClass:"glaze-product-directory",attrs:{"type":"secondary","buttonType":"button","color":"default","size":"medium","raised":"true","icon":"folder"},on:{"click":function($event){_vm.setFolder(directory)}}},[_vm._v("\n            "+_vm._s(directory)+"\n          ")])}),_vm._v(" "),(!_vm.showCreateFolder)?_c('ui-button',{staticClass:"glaze-product-directory",attrs:{"type":"secondary","buttonType":"button","color":"accent","size":"medium","raised":"true","icon":"add"},on:{"click":_vm.revealCreateFolder}},[_vm._v("Create New Folder")]):_vm._e()],2)])]),_vm._v(" "),(_vm.showCreateFolder)?_c('div',{staticClass:"glaze-product-create-folder glaze-product-input"},[_c('ui-textbox',{class:{ 'is-empty': !_vm.createFolderName },attrs:{"floatingLabel":true,"label":"New Folder Name*"},model:{value:(_vm.createFolderName),callback:function ($$v) {_vm.createFolderName=$$v},expression:"createFolderName"}}),_vm._v(" "),_c('ui-button',{on:{"click":_vm.hideCreateFolder}},[_c('ui-icon',{attrs:{"icon":"clear"}})],1)],1):_vm._e(),_vm._v(" "),_c('div',{staticClass:"glaze-product-input"},[_c('ui-textbox',{class:{ 'is-empty': !_vm.filename },attrs:{"floatingLabel":true,"label":"New Image Title*"},model:{value:(_vm.filename),callback:function ($$v) {_vm.filename=$$v},expression:"filename"}})],1)]),_vm._v(" "),_c('div',{staticClass:"glaze-product-foot"},[_c('div',{staticClass:"ui-button-group"},[_c('ui-button',{attrs:{"type":"primary","buttonType":"button","color":"default"},on:{"click":function($event){$event.stopPropagation();return _vm.close($event)}}},[_vm._v("Cancel")]),_vm._v(" "),_c('ui-button',{attrs:{"type":"primary","buttonType":"button","color":"accent","disabled":!_vm.hasRequiredFields},on:{"click":function($event){$event.stopPropagation();return _vm.processImage($event)}}},[_vm._v("Upload")])],1)])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-402405fe", __vue__options__)
  } else {
    hotAPI.reload("data-v-402405fe", __vue__options__)
  }
})()}
}).call(this,require(22))}, {"5":5,"8":8,"10":10,"22":22,"32":32,"47":47,"87":87,"93":93,"182":182,"909":909,"1266":1266}];
window.modules["homepage-tools_cut-button.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var UiIconButton = window.kiln.utils.components.UiIconButton,
    _get = require(32),
    _cloneDeep = require(47),
    _require = require("homepage-tools_helpers.kilnplugin"),
    isManualArticle = _require.isManualArticle,
    updateClipboard = _require.updateClipboard,
    fields = _require.fields,
    getClipboard = _require.getClipboard;

module.exports = {
  computed: {
    componentUri: function componentUri() {
      return this.$store.state.ui.currentSelection.uri;
    },
    componentData: function componentData() {
      var components = _get(this.$store, 'state.components');

      return components[this.componentUri];
    },
    showButton: function showButton() {
      return isManualArticle(this.componentUri) && this.hasArticleUrl;
    },
    hasArticleUrl: function hasArticleUrl() {
      return !!this.componentData.articleUrl;
    }
  },
  methods: {
    cutArticle: function cutArticle() {
      var data = _cloneDeep(this.componentData);

      updateClipboard(data);
      fields.forEach(function (field) {
        data[field] = '';
      });
      this.$store.dispatch('saveComponent', {
        uri: this.componentUri,
        data: data
      });
    }
  },
  components: {
    UiIconButton: UiIconButton
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.showButton)?_c('ui-icon-button',{staticClass:"quick-bar-button",attrs:{"buttonType":"button","color":"primary","type":"secondary","icon":"file_copy","tooltip":"Clear Article and Copy to Clipboard"},on:{"click":function($event){$event.stopPropagation();return _vm.cutArticle($event)}}}):_vm._e()}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1a13624a", __vue__options__)
  } else {
    hotAPI.reload("data-v-1a13624a", __vue__options__)
  }
})()}}, {"8":8,"10":10,"32":32,"47":47,"homepage-tools_helpers.kilnplugin":"homepage-tools_helpers.kilnplugin"}];
window.modules["homepage-tools_helpers.kilnplugin"] = [function(require,module,exports){'use strict';

var _require = require(56),
    getComponentName = _require.getComponentName,
    _pick = require(174),
    _cloneDeep = require(47),
    _isEmpty = require(75),
    COMPONENTS = ['manual-article'],
    FIELDS = ['rubric', 'teaser', 'article', 'authors', 'callout', 'headline', 'imageUrl', 'articleUrl', 'canonicalUrl', 'originalImageUrl'];

var clipboard = {};

function updateClipboard(data) {
  var newData = _pick(_cloneDeep(data), FIELDS);

  clipboard = newData;
}

function getClipboard() {
  return clipboard;
}

function isClipboardEmpty() {
  return _isEmpty(clipboard);
}

function clearClipboard() {
  clipboard = {};
}

module.exports.fields = FIELDS;
module.exports.updateClipboard = updateClipboard;
module.exports.getClipboard = getClipboard;
module.exports.clearClipboard = clearClipboard;
module.exports.isClipboardEmpty = isClipboardEmpty;

module.exports.isManualArticle = function (uri) {
  return COMPONENTS.includes(getComponentName(uri));
};
}, {"47":47,"56":56,"75":75,"174":174}];
window.modules["homepage-tools_index.kilnplugin"] = [function(require,module,exports){'use strict';

module.exports = function () {
  window.kiln.selectorButtons['open-article'] = require("homepage-tools_open-article-button.kilnplugin");
  window.kiln.selectorButtons['cut-article'] = require("homepage-tools_cut-button.kilnplugin");
  window.kiln.selectorButtons['paste-article'] = require("homepage-tools_paste-button.kilnplugin");
};
}, {"homepage-tools_paste-button.kilnplugin":"homepage-tools_paste-button.kilnplugin","homepage-tools_open-article-button.kilnplugin":"homepage-tools_open-article-button.kilnplugin","homepage-tools_cut-button.kilnplugin":"homepage-tools_cut-button.kilnplugin"}];
window.modules["homepage-tools_open-article-button.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var UiIconButton = window.kiln.utils.components.UiIconButton,
    _get = require(32),
    _require = require("homepage-tools_helpers.kilnplugin"),
    isManualArticle = _require.isManualArticle;

module.exports = {
  computed: {
    componentUri: function componentUri() {
      return this.$store.state.ui.currentSelection.uri;
    },
    componentData: function componentData() {
      var components = _get(this.$store, 'state.components');

      return components[this.componentUri];
    },
    showButton: function showButton() {
      return isManualArticle(this.componentUri) && this.hasArticleUrl;
    },
    hasArticleUrl: function hasArticleUrl() {
      return !!this.componentData.articleUrl;
    }
  },
  methods: {
    openArticle: function openArticle() {
      window.open(this.componentData.articleUrl, 'blank');
    }
  },
  components: {
    UiIconButton: UiIconButton
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.showButton)?_c('ui-icon-button',{staticClass:"quick-bar-button",attrs:{"buttonType":"button","color":"primary","type":"secondary","icon":"launch","tooltip":"Open Article"},on:{"click":function($event){$event.stopPropagation();return _vm.openArticle($event)}}}):_vm._e()}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-321a0622", __vue__options__)
  } else {
    hotAPI.reload("data-v-321a0622", __vue__options__)
  }
})()}}, {"8":8,"10":10,"32":32,"homepage-tools_helpers.kilnplugin":"homepage-tools_helpers.kilnplugin"}];
window.modules["homepage-tools_paste-button.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var UiIconButton = window.kiln.utils.components.UiIconButton,
    _get = require(32),
    _cloneDeep = require(47),
    _require = require("homepage-tools_helpers.kilnplugin"),
    isManualArticle = _require.isManualArticle,
    fields = _require.fields,
    getClipboard = _require.getClipboard,
    isClipboardEmpty = _require.isClipboardEmpty,
    updateClipboard = _require.updateClipboard,
    clearClipboard = _require.clearClipboard;

module.exports = {
  computed: {
    componentUri: function componentUri() {
      return this.$store.state.ui.currentSelection.uri;
    },
    componentData: function componentData() {
      var components = _get(this.$store, 'state.components');

      return components[this.componentUri];
    },
    showButton: function showButton() {
      return isManualArticle(this.componentUri) && !isClipboardEmpty();
    },
    hasArticleUrl: function hasArticleUrl() {
      return !!this.componentData.articleUrl;
    },
    getLabel: function getLabel() {
      if (this.showButton) {
        var headline = getClipboard().headline;
        return "Paste Article (".concat(headline, ")");
      }

      return 'Paste Article';
    }
  },
  methods: {
    pasteArticle: function pasteArticle() {
      var data = _cloneDeep(this.componentData),
          newData = getClipboard();

      this.$store.dispatch('saveComponent', {
        uri: this.componentUri,
        data: Object.assign({}, data, newData)
      }).then(function () {
        if (data.articleUrl) {
          updateClipboard(data);
        } else {
          clearClipboard();
        }
      });
    }
  },
  components: {
    UiIconButton: UiIconButton
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.showButton)?_c('ui-icon-button',{staticClass:"quick-bar-button",attrs:{"buttonType":"button","color":"primary","type":"secondary","icon":"assignment","tooltip":_vm.getLabel},on:{"click":function($event){$event.stopPropagation();return _vm.pasteArticle($event)}}}):_vm._e()}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-30f8afce", __vue__options__)
  } else {
    hotAPI.reload("data-v-30f8afce", __vue__options__)
  }
})()}}, {"8":8,"10":10,"32":32,"47":47,"homepage-tools_helpers.kilnplugin":"homepage-tools_helpers.kilnplugin"}];
window.modules["plugins_kiln-error-tracking.kilnplugin"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _includes = require(33),
    ms = require(1120),
    adBlock = require(642),
    rest = require(5);

function isProd() {
  return _includes(['nymag.com', 'www.thecut.com', 'www.grubstreet.com', 'www.vulture.com'], window.location.hostname);
}

module.exports = function () {
  window.kiln.plugins['kiln-error-tracking'] = function (store) {
    window._trackJs = {
      token: '8be6b90939194b9699a603268f5a3742',
      version: _get(window, 'kiln.utils.version')
    };

    if (isProd()) {
      // instantiate error tracking
      require(1179);

      if (!window.trackJs) {
        return;
      } // attempt to determine if user's adblock extension is on


      window.trackJs.addMetadata('adblock', adBlock.isDetected()); // grab public IP address to determine if users are on VPN

      rest.getHTML('https://api.ipify.org') // technically getting text (not html), but don't tell anyone
      .then(function (ip) {
        window.trackJs.addMetadata('vpn', ip !== '173.251.18.194'); // office has a single ip address
      }).catch(function () {
        window.trackJs.addMetadata('vpn', 'Error: Could not fetch IP address from ipify!');
      }); // wait for the end of the load event, so we can track full load times

      window.addEventListener('load', function () {
        return window.setTimeout(function () {
          var timing = window.performance.timing,
              pageLoadTime = timing.loadEventEnd - timing.fetchStart,
              responseTime = timing.responseEnd - timing.requestStart,
              domLoadTime = timing.domComplete - timing.domLoading;
          window.trackJs.addMetadata('pageLoadTime', ms(pageLoadTime, {
            secDecimalDigits: 2
          }));
          window.trackJs.addMetadata('responseTime', ms(responseTime, {
            secDecimalDigits: 2
          }));
          window.trackJs.addMetadata('domLoadTime', ms(domLoadTime, {
            secDecimalDigits: 2
          }));
        }, 0);
      }); // wait for the store to be populated, so we can track users

      store.subscribe(function (mutation, state) {
        // add user info once it has been loaded into the store
        if (mutation.type === 'PRELOAD_SUCCESS' || mutation.type === 'PRELOAD_USER') {
          window.trackJs.configure({
            userId: _get(state, 'user.username')
          });
        }
      });
    }
  };
};
}, {"5":5,"32":32,"33":33,"642":642,"1120":1120,"1179":1179}];
window.modules["plugins_kiln-tracking.kilnplugin"] = [function(require,module,exports){/* global ga:false */
'use strict';

var _includes = require(33),
    _require = require(56),
    getComponentName = _require.getComponentName,
    getComponentInstance = _require.getComponentInstance; // google analytics script (de-minified from google)


function appendScript() {
  var script = document.createElement('script'),
      firstScript = document.getElementsByTagName('script')[0];

  window.ga = window.ga || function () {
    (ga.q = ga.q || []).push(arguments);
  };

  ga.l = +new Date(); // set up ga function

  script.async = 1;
  script.src = 'https://www.google-analytics.com/analytics.js';
  firstScript.parentNode.insertBefore(script, firstScript);
}

function isProd() {
  return _includes(['nymag.com', 'www.thecut.com', 'www.grubstreet.com', 'www.vulture.com'], window.location.hostname);
}
/**
 * send event to google analytics
 * @param  {string} action
 * @param  {string} [label]
 * @param  {object} customDimensions
 */


function track(action, label, customDimensions) {
  customDimensions ? window.ga('send', 'event', 'kiln', action, label, customDimensions) : window.ga('send', 'event', 'kiln', action, label);
}
/**
 * add username to ga tracking
 * @param {object} state
 */


function addUsername(state) {
  var username = state && state.user && state.user.username;
  window.ga('set', 'dimension1', username); // set through the Google Analytics dashboard
}
/**
 * track when users open forms
 * @param  {object} mutation
 */


function trackOpenForm(mutation) {
  var uri = mutation.payload.uri,
      component = getComponentName(uri),
      instance = getComponentInstance(uri),
      path = mutation.payload.path,
      hashString = "".concat(component, "~").concat(instance, "~").concat(path);
  track('open form', hashString);
}

module.exports = function () {
  window.kiln.plugins['kiln-tracking'] = function (store) {
    appendScript(); // create analytics connection

    window.ga('create', 'UA-18163580-12', 'auto'); // don't actually send data for local/QA
    // from https://developers.google.com/analytics/devguides/collection/analyticsjs/debugging

    if (!isProd()) {
      ga('set', 'sendHitTask', null);
    } // track page view


    window.ga('send', 'pageview'); // track state mutations (panes, undo/redo)
    // also set user data when it's available in the store

    store.subscribe(function (mutation, state) {
      // eslint-disable-line
      switch (mutation.type) {
        case 'PRELOAD_SUCCESS':
        case 'PRELOAD_USER':
          return addUsername(state);

        case 'OPEN_DRAWER':
          return track('open drawer', mutation.payload);

        case 'OPEN_NAV':
          return track('open nav', mutation.payload.name);

        case 'UNDO':
          return track('undo');

        case 'REDO':
          return track('redo');

        case 'OPEN_FORM':
          return trackOpenForm(mutation);

        case 'STOP_EDITING':
          return track('stop editing');

        case 'SWITCH_TAB':
          return track('switch tab', mutation.payload);

        case 'CREATE_PAGE':
          return track('create page', mutation.payload);

        case 'FILTER_PAGELIST_SITE':
          return track('filter page list site', mutation.payload);

        case 'FILTER_PAGELIST_STATUS':
          return track('filter page list status', mutation.payload);

        case 'FILTER_PAGELIST_SEARCH':
          return track('filter page list search text', mutation.payload);

        case 'OPEN_PREVIEW_LINK':
          return track('open preview link', mutation.payload);

        case 'COPY_PREVIEW_LINK':
          return track('copy preview link', mutation.payload);

        case 'OPEN_VALIDATION_LINK':
          return track('open validation link', mutation.payload);

        case 'CREATE_COMPONENTS':
          return track('create components', mutation.payload);

        case 'DUPLICATE_COMPONENT':
          return track('duplicate component', mutation.payload);

        case 'DUPLICATE_COMPONENT_WITH_DATA':
          return track('duplicate component with data', mutation.payload);

        case 'ADD_PAGE_TEMPLATE':
          return track('add page template', mutation.payload);

        case 'REMOVE_COMPONENT':
          var removeMsg = mutation.payload && mutation.payload.msg;
          return removeMsg ? track('remove component', getComponentName(mutation.payload.uri), {
            dimension2: removeMsg
          }) : track('remove component', getComponentName(mutation.payload.uri));

        default:
          return null;
        // no need to track everything
      }
    });
  };
};
}, {"33":33,"56":56}];
window.modules["mediaplay-picker_image.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var UiProgressCircular = window.kiln.utils.components.UiProgressCircular,
    UiRippleInk = window.kiln.utils.components.UiRippleInk,
    UiIcon = window.kiln.utils.components.UiIcon,
    UiTooltip = window.kiln.utils.components.UiTooltip,
    _upperFirst = require(891),
    dateFormat = require(52),
    dateParse = require(54);

module.exports = {
  props: ['image'],
  data: function data() {
    return {
      selecting: false
    };
  },
  computed: {
    isSelected: function isSelected() {
      return this.image.isSelected;
    },
    isLoaded: function isLoaded() {
      return this.image.isLoaded;
    },
    name: function name() {
      var filename = this.image.filename,
          noprefix = filename.match(/^(?:\d+-)?(.*)/i)[1];
      return noprefix.split('-').map(_upperFirst).join(' ');
    },
    thumbnail: function thumbnail() {
      return this.image.thumb;
    },
    formattedDate: function formattedDate() {
      return dateFormat(dateParse(this.image.date), 'MM/DD/YYYY');
    }
  },
  methods: {
    select: function select() {
      var _this = this;

      if (!this.isSelected) {
        this.selecting = true;
        window.setTimeout(function () {
          return _this.$emit('select', _this.image);
        }, 0);
      }
    },
    unselect: function unselect() {
      var _this2 = this;

      if (this.isSelected && !this.selecting) {
        window.setTimeout(function () {
          return _this2.$emit('select', _this2.image);
        }, 0);
      } else if (this.isSelected) {
        this.selecting = false;
      }
    }
  },
  components: {
    UiProgressCircular: UiProgressCircular,
    UiRippleInk: UiRippleInk,
    UiIcon: UiIcon,
    UiTooltip: UiTooltip
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"image",staticClass:"mediaplay-picker-image kiln-accent-color",on:{"mousedown":_vm.select,"mouseup":_vm.unselect}},[(!_vm.isLoaded)?_c('ui-progress-circular',{attrs:{"size":36}}):_vm._e(),_vm._v(" "),(_vm.image.isLoaded)?_c('img',{staticClass:"mediaplay-picker-image-actual",attrs:{"src":_vm.image.thumb}}):_vm._e(),_vm._v(" "),(_vm.isSelected)?_c('div',{staticClass:"mediaplay-picker-image-selected-overlay kiln-accent-color"}):_vm._e(),_vm._v(" "),(_vm.isLoaded)?_c('ui-ripple-ink',{attrs:{"trigger":"image"}}):_vm._e(),_vm._v(" "),(_vm.image.isLoaded)?_c('div',{staticClass:"mediaplay-picker-image-info"},[_c('span',{staticClass:"mediaplay-picker-image-name kiln-body"},[_vm._v(_vm._s(_vm.name))]),_vm._v(" "),(_vm.isSelected)?_c('ui-icon',{staticClass:"mediaplay-picker-image-check",attrs:{"icon":"check"}}):_vm._e()],1):_vm._e(),_vm._v(" "),_c('ui-tooltip',{attrs:{"trigger":"image","openDelay":300}},[_vm._v("Uploaded "+_vm._s(_vm.formattedDate))])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ab73a0b6", __vue__options__)
  } else {
    hotAPI.reload("data-v-ab73a0b6", __vue__options__)
  }
})()}}, {"8":8,"10":10,"52":52,"54":54,"891":891}];
window.modules["mediaplay-picker_index.kilnplugin"] = [function(require,module,exports){'use strict';

module.exports = function () {
  window.kiln.inputs['mediaplay-picker'] = require("mediaplay-picker_input.kilnplugin");
  window.kiln.modals['mediaplay-picker'] = require("mediaplay-picker_modal.kilnplugin");
};
}, {"mediaplay-picker_input.kilnplugin":"mediaplay-picker_input.kilnplugin","mediaplay-picker_modal.kilnplugin":"mediaplay-picker_modal.kilnplugin"}];
window.modules["mediaplay-picker_input.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var UiIconButton = window.kiln.utils.components.UiIconButton;
module.exports = {
  props: ['name', 'data', 'schema', 'args'],
  data: function data() {
    return {};
  },
  methods: {
    openPicker: function openPicker() {
      var overridePath = this.args.overridePath,
          multiple = !!this.args.multiple,
          uri = this.$store.state.ui.currentForm.uri,
          path = this.name;
      var modalConfig = {
        title: 'Browse Images',
        size: 'large',
        type: 'mediaplay-picker',
        data: {
          uri: uri,
          path: path,
          overridePath: overridePath,
          multiple: multiple
        }
      };

      if (this.args.reopenForm) {
        modalConfig.redirectTo = {
          uri: uri,
          path: this.$store.state.ui.currentForm.path,
          field: this.name
        };
      }

      this.$store.dispatch('openModal', modalConfig);
    }
  },
  components: {
    UiIconButton: UiIconButton
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ui-icon-button',{attrs:{"buttonType":"button","color":"default","type":"secondary","tooltip":"Browse Images","icon":"search"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.openPicker($event)}}})}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-445c0e94", __vue__options__)
  } else {
    hotAPI.reload("data-v-445c0e94", __vue__options__)
  }
})()}}, {"8":8,"10":10}];
window.modules["mediaplay-picker_modal.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UiButton = window.kiln.utils.components.UiButton,
    UiIcon = window.kiln.utils.components.UiIcon,
    UiIconButton = window.kiln.utils.components.UiIconButton,
    UiTextbox = window.kiln.utils.components.UiTextbox,
    UiProgressCircular = window.kiln.utils.components.UiProgressCircular,
    image = require("mediaplay-picker_image.kilnplugin"),
    _get = require(32),
    _set = require(87),
    _size = require(909),
    _filter = require(51),
    _find = require(71),
    _tail = require(910),
    _cloneDeep = require(47),
    rest = require(5),
    _require = require(1266),
    getSitePath = _require.getSitePath;

function moMoneyMoProblems(file) {
  var filename = file.basename || file.name,
      copyright = _get(file, 'metadata.copyright');

  if (copyright && copyright.match(/(Contour|Trunk Archive|Everett Collection|August|Mega|Backgrid|Splash|AKM\/GSI|Fame Flynet|Pacific Coast News|PacificCoastNews)/i)) {
    return false;
  } else {
    return !filename.match(/^$$$/);
  }
}

function parseFiles(result, file) {
  if (file.isDirectory) {
    result.directories.push(file.basename);
  } else {
    var ext = file.basename.match(/(\..+)/)[0],
        filename = file.basename.replace(ext, '');
    result.images.push({
      filename: filename,
      url: "http://pixel.nymag.com/imgs/".concat(file.dirname, "/").concat(file.basename),
      thumb: "http://pixel.nymag.com/imgs/".concat(file.dirname, "/").concat(filename, ".w300.h300").concat(ext),
      isLoaded: false,
      isSelected: false
    });
  }

  return result;
}

function parseImages(image) {
  var ext = image.name.match(/(\..+)/)[0],
      filename = image.name.replace(ext, '');
  return {
    filename: filename,
    url: "http://pixel.nymag.com/imgs/".concat(image.directory, "/").concat(image.name),
    thumb: "http://pixel.nymag.com/imgs/".concat(image.directory, "/").concat(filename, ".w300.h300").concat(ext),
    isLoaded: false,
    isSelected: false,
    date: image.uploadDate
  };
}

function loadImages(images) {
  images.forEach(function (image) {
    var loadedImage = new Image();

    loadedImage.onload = function () {
      image.isLoaded = true;
    };

    loadedImage.src = image.thumb;
  });
}

module.exports = {
  props: ['data'],
  data: function data() {
    return {
      query: '',
      searchedFor: '',
      path: '',
      defaultPath: '',
      isSearching: false,
      isLoading: true,
      isTooLarge: false,
      directories: [],
      images: []
    };
  },
  computed: {
    hasNoLoadedContent: function hasNoLoadedContent() {
      return !this.isLoading && !this.isTooLarge && !this.directories.length && !this.images.length;
    },
    pathArray: function pathArray() {
      return this.path.length ? this.path.split('/') : [];
    },
    selectedImages: function selectedImages() {
      return _filter(this.images, function (image) {
        return image.isSelected;
      }).map(function (image) {
        return image.url;
      });
    },
    hasSelectedImages: function hasSelectedImages() {
      return this.selectedImages.length !== 0;
    },
    addText: function addText() {
      return this.selectedImages.length > 1 ? "Insert ".concat(this.selectedImages.length, " Images") : 'Insert Image';
    },
    selectAllText: function selectAllText() {
      return this.selectedImages.length === this.images.length && !this.hasNoLoadedContent ? 'Select None' : 'Select All';
    },
    allSelected: function allSelected() {
      return this.selectedImages.length === this.images.length && !this.hasNoLoadedContent;
    }
  },
  methods: {
    navPath: function navPath() {
      var _this = this;

      this.path = this.path.replace(/^\//, '');
      this.path = this.path.replace(/\/$/, '');
      this.isSearching = false;
      this.isLoading = true;
      return rest.get("https://api.nymag.com/v1/content/assets/files?parent-path=".concat(this.path, "&limit=1000")).then(function (res) {
        if (_size(res.pagination)) {
          _this.isTooLarge = true;
          _this.isLoading = false;
          _this.directories = [];
          _this.images = [];
        } else {
          var _res$files$filter$red = res.files.filter(moMoneyMoProblems).reduce(parseFiles, {
            directories: [],
            images: []
          }),
              directories = _res$files$filter$red.directories,
              images = _res$files$filter$red.images;

          _this.isTooLarge = false;
          _this.isLoading = false;
          _this.directories = directories;
          _this.images = images;
          loadImages(_this.images);
        }
      }).catch(function () {
        _this.isTooLarge = false;
        _this.isLoading = false;
        _this.directories = [];
        _this.images = [];
      });
    },
    navSearch: function navSearch() {
      var _this2 = this;

      this.isLoading = true;
      return rest.get("https://api.nymag.com/v1/content/assets/images/_search?q=".concat(this.query, "&sort=modifiedDate%3Adesc&limit=100")).then(function (res) {
        var images = res.images.filter(moMoneyMoProblems).map(parseImages);
        _this2.isTooLarge = false;
        _this2.isLoading = false;
        _this2.directories = [];
        _this2.images = images;
        loadImages(_this2.images);
      }).catch(function () {
        _this2.isTooLarge = false;
        _this2.isLoading = false;
        _this2.directories = [];
        _this2.images = [];
      });
    },
    handleQuery: function handleQuery() {
      var query = this.query;

      if (!query || !query.length) {
        this.navPath();
      } else if (query.indexOf('/') > -1) {
        this.path = query;
        this.navPath();
      } else {
        this.searchedFor = this.query;
        this.isSearching = true;
        this.navSearch();
      }
    },
    navIndex: function navIndex(index) {
      this.path = this.pathArray.slice(0, index + 1).join('/');
      this.navPath();
    },
    navBack: function navBack() {
      this.query = '';
      this.navPath();
    },
    close: function close() {
      this.$store.dispatch('closeModal');
    },
    select: function select(image) {
      if (image.isSelected) {
        image.isSelected = false;
      } else if (this.hasSelectedImages && this.data.multiple) {
        image.isSelected = true;
      } else if (this.hasSelectedImages) {
        var currentSelectedImage = _find(this.images, function (i) {
          return i.isSelected;
        });

        currentSelectedImage.isSelected = false;
        image.isSelected = true;
      } else {
        image.isSelected = true;
      }
    },
    selectAll: function selectAll() {
      var selected = this.allSelected;
      this.images.forEach(function (image) {
        image.isSelected = !selected;
      });
    },
    addImages: function addImages() {
      var _this3 = this;

      var currentURI = this.data.uri,
          currentPath = this.data.path,
          rootPath = currentPath.split('.')[0],
          firstImageURL = this.selectedImages[0];
      var promises;

      if (this.selectedImages.length > 0) {
        var currentField = _get(this.$store, "state.components['".concat(currentURI, "']['").concat(rootPath, "']")),
            currentData = _defineProperty({}, rootPath, _cloneDeep(currentField));

        _set(currentData, currentPath, firstImageURL);

        promises = this.$store.dispatch('saveComponent', {
          uri: currentURI,
          data: currentData
        });
      }

      if (this.selectedImages.length > 1) {
        promises.then(function () {
          var refAttr = window.kiln.utils.references.refAttr,
              editAttr = window.kiln.utils.references.editAttr,
              componentEl = document.querySelector("[".concat(refAttr, "=\"").concat(currentURI, "\"]")),
              parentEl = window.kiln.utils.componentElements.getParentComponent(componentEl),
              parentURI = parentEl.getAttribute(refAttr),
              parentPath = componentEl.parentNode.getAttribute(editAttr),
              name = window.kiln.utils.references.getComponentName(currentURI);
          return _this3.$store.dispatch('addComponents', {
            currentURI: currentURI,
            parentURI: parentURI,
            path: parentPath,
            replace: false,
            components: _tail(_this3.selectedImages).map(function (imageURL) {
              var componentData = {},
                  newPath = currentPath.replace(/\.d+\./g, '.0.');

              _set(componentData, newPath, imageURL);

              return {
                name: name,
                data: componentData
              };
            })
          });
        });
      }

      return promises.then(function () {
        return _this3.close();
      });
    },
    setDirectoryAndNav: function setDirectoryAndNav(directory) {
      this.path = "".concat(this.path, "/").concat(directory);
      return this.navPath();
    },
    isDefaultDirectory: function isDefaultDirectory(directory) {
      var possiblePath = "".concat(this.path, "/").concat(directory),
          matchLength = possiblePath.split('/').length,
          matchingDefault = this.defaultPath.split('/').slice(0, matchLength).join('/');
      return possiblePath === matchingDefault;
    }
  },
  mounted: function mounted() {
    var slug = _get(this.$store, 'state.site.slug');

    this.path = this.data.overridePath || getSitePath(slug);
    this.defaultPath = this.path;
    this.navPath();
  },
  components: {
    UiButton: UiButton,
    UiIcon: UiIcon,
    UiIconButton: UiIconButton,
    UiTextbox: UiTextbox,
    UiProgressCircular: UiProgressCircular,
    'mediaplay-image': image
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"mediaplay-picker"},[_c('div',{staticClass:"mediaplay-picker-head"},[_c('transition',{staticClass:"mediaplay-picker-head-top",attrs:{"tag":"div","mode":"out-in","name":"fade"}},[(_vm.isSearching)?_c('div',{key:"searchresults",staticClass:"mediaplay-picker-searchresults"},[_c('ui-icon-button',{attrs:{"buttonType":"button","color":"default","type":"secondary","icon":"arrow_back"},on:{"click":function($event){$event.stopPropagation();return _vm.navBack($event)}}}),_vm._v(" "),_c('span',{staticClass:"mediaplay-picker-searchresults-text kiln-button"},[_vm._v("Search Results for \""+_vm._s(_vm.searchedFor)+"\"")])],1):_c('div',{key:"breadcrumbs",staticClass:"mediaplay-picker-breadcrumbs"},_vm._l((_vm.pathArray),function(segment,index){return _c('div',{key:index,staticClass:"mediaplay-picker-breadcrumb"},[_c('ui-button',{attrs:{"type":"secondary","buttonType":"button","color":"default","size":"small"},on:{"click":function($event){$event.stopPropagation();_vm.navIndex(index)}}},[_vm._v(_vm._s(segment))]),_vm._v(" "),(index < _vm.pathArray.length - 1)?_c('ui-icon',{attrs:{"icon":"chevron_right"}}):_vm._e()],1)}),0)]),_vm._v(" "),_c('ui-textbox',{staticClass:"mediaplay-picker-search",attrs:{"type":"search","placeholder":"Search for images","autofocus":true,"iconPosition":"right"},on:{"keydown-enter":_vm.handleQuery},model:{value:(_vm.query),callback:function ($$v) {_vm.query=$$v},expression:"query"}},[_c('ui-icon-button',{attrs:{"slot":"icon","buttonType":"button","color":"default","type":"secondary","icon":"search"},on:{"click":function($event){$event.stopPropagation();return _vm.handleQuery($event)}},slot:"icon"})],1)],1),_vm._v(" "),_c('div',{staticClass:"mediaplay-picker-body"},[_c('transition',{attrs:{"mode":"out-in","name":"fade"}},[(_vm.isLoading)?_c('div',{key:"loading-spinner",staticClass:"mediaplay-picker-filler"},[_c('ui-progress-circular',{attrs:{"size":56}})],1):(_vm.hasNoLoadedContent)?_c('div',{key:"no-content",staticClass:"mediaplay-picker-filler kiln-display1"},[_vm._v("Nothing Here")]):(_vm.isTooLarge)?_c('div',{key:"too-much-content",staticClass:"mediaplay-picker-filler kiln-display1"},[_vm._v("Folder contains too many items to display")]):_c('div',{key:"loaded-content",staticClass:"mediaplay-picker-items ui-button-group"},[(_vm.directories.length)?_c('span',{staticClass:"mediaplay-picker-items-header kiln-list-header"},[_vm._v("Folders")]):_vm._e(),_vm._v(" "),_vm._l((_vm.directories),function(directory){return _c('ui-button',{key:directory,staticClass:"mediaplay-picker-directory",attrs:{"type":"secondary","buttonType":"button","color":_vm.isDefaultDirectory(directory) ? 'accent' : 'default',"size":"large","raised":true,"icon":_vm.isDefaultDirectory(directory) ? 'folder_special' : 'folder'},on:{"click":function($event){_vm.setDirectoryAndNav(directory)}}},[_vm._v(_vm._s(directory))])}),_vm._v(" "),(_vm.images.length)?_c('span',{staticClass:"mediaplay-picker-items-header kiln-list-header"},[_vm._v("Images")]):_vm._e(),_vm._v(" "),_vm._l((_vm.images),function(image){return _c('mediaplay-image',{key:image,attrs:{"image":image},on:{"select":function($event){_vm.select(image)}}})})],2)])],1),_vm._v(" "),_c('div',{staticClass:"mediaplay-picker-foot ui-button-group"},[_c('div',{staticClass:"ui-button-group"},[_c('ui-button',{attrs:{"type":"primary","buttonType":"button","color":"default"},on:{"click":function($event){$event.stopPropagation();return _vm.close($event)}}},[_vm._v("Cancel")]),_vm._v(" "),(_vm.data.multiple)?_c('ui-button',{attrs:{"type":"secondary","buttonType":"button","color":_vm.allSelected ? 'red' : 'accent',"disabled":_vm.hasNoLoadedContent},on:{"click":function($event){$event.stopPropagation();return _vm.selectAll($event)}}},[_vm._v(_vm._s(_vm.selectAllText))]):_vm._e()],1),_vm._v(" "),_c('ui-button',{attrs:{"type":"primary","buttonType":"button","color":"accent","disabled":!_vm.hasSelectedImages},on:{"click":function($event){$event.stopPropagation();return _vm.addImages($event)}}},[_vm._v(_vm._s(_vm.addText))])],1)])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5ff287f7", __vue__options__)
  } else {
    hotAPI.reload("data-v-5ff287f7", __vue__options__)
  }
})()}}, {"5":5,"8":8,"10":10,"32":32,"47":47,"51":51,"71":71,"87":87,"909":909,"910":910,"1266":1266,"mediaplay-picker_image.kilnplugin":"mediaplay-picker_image.kilnplugin"}];
window.modules["open-in-mediaplay_index.kilnplugin"] = [function(require,module,exports){'use strict';

module.exports = function () {
  window.kiln.inputs['open-in-mediaplay'] = require("open-in-mediaplay_input.kilnplugin");
};
}, {"open-in-mediaplay_input.kilnplugin":"open-in-mediaplay_input.kilnplugin"}];
window.modules["open-in-mediaplay_input.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var _get = require(32),
    mediaPlay = require(53),
    UiIconButton = window.kiln.utils.components.UiIconButton,
    pixelDomain = 'pixel.nymag.com',
    mediaplayDomain = 'mediaplay.prd.nymetro.com/admin/imgs';

module.exports = {
  props: ['data'],
  computed: {
    mediaplayPath: function mediaplayPath() {
      var pixelUrl = this.data,
          isMediaPlayurl = mediaPlay.isMediaPlay(pixelUrl),
          mediaplayPath = mediaPlay.getImgPath(pixelUrl);
      return mediaplayPath;
    },
    isDisabled: function isDisabled() {
      return !this.mediaplayPath;
    }
  },
  methods: {
    openMediaplayLink: function openMediaplayLink() {
      var mediaplayLink = "//".concat(mediaplayDomain, "/").concat(this.mediaplayPath);
      window.open(mediaplayLink, 'blank');
    }
  },
  components: {
    UiIconButton: UiIconButton
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ui-icon-button',{attrs:{"buttonType":"button","color":"default","type":"secondary","tooltip":"Open Image In Mediaplay","icon":"open_in_new","disabled":_vm.isDisabled},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.openMediaplayLink($event)}}})}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5ecb2c70", __vue__options__)
  } else {
    hotAPI.reload("data-v-5ecb2c70", __vue__options__)
  }
})()}}, {"8":8,"10":10,"32":32,"53":53}];
window.modules["plugins_page-uri.kilnplugin"] = [function(require,module,exports){'use strict';

var page = require(116),
    _get = require(32);
/**
 *
 * @param {string} uri
 * @returns {boolean}
 */


function isGtmPageComponent(uri) {
  return uri.includes('/_components/gtm-page/');
}
/**
 * updates the `pageUri` property of the `gtm-page` component
 * @param {object} store
 * @param {object} state
 * @param {string} pageUri
 */


function updateGtmPageComponent(store, state, pageUri) {
  Object.keys(_get(state, 'components', {})).filter(isGtmPageComponent).forEach(function (gtmPageComponentUri) {
    return store.dispatch('saveComponent', {
      uri: gtmPageComponentUri,
      data: {
        pageUri: pageUri
      }
    });
  });
}

module.exports = function () {
  window.kiln.plugins['page-uri'] = function (store) {
    store.subscribe(function (mutation, state) {
      if (mutation.type === 'LOADING_SUCCESS' || mutation.type === 'SWITCH_TAB' && mutation.payload === 'Publish') {
        var pageUri = page.getPageUri();
        updateGtmPageComponent(store, state, pageUri);
      }
    });
  };
};
}, {"32":32,"116":116}];
window.modules["plugins_product-count.kilnplugin"] = [function(require,module,exports){'use strict';

var _pickBy = require(59),
    _isEmpty = require(75),
    _get = require(32);
/**
 * updates the `hasProduct` property of the `gtm-page` component
 * @param {object} store
 * @param {object} state
 * @param {number} count
 */


function updateGtmPageComponent(store, state, count) {
  Object.keys(_get(state, 'components', {})).filter(function (val) {
    return val.includes('/_components/gtm-page/');
  }).forEach(function (gtmPageComponentUri) {
    store.dispatch('saveComponent', {
      uri: gtmPageComponentUri,
      data: {
        hasProduct: count > 0
      }
    });
  });
}
/**
 * update product count element after vue's current tick
 * @param  {number} count
 */


function updateProductCount(count) {
  var productCountEl = document.querySelector('.product-count');
  window.setTimeout(function () {
    if (productCountEl) {
      productCountEl.classList.remove('hidden');
      productCountEl.innerHTML = 'Products: ' + count;
    }
  }, 0);
}
/**
 * gets and returns the amount of product components currently on page
 * @param  {array} components
 * @returns  {number}
 */


function calculateProductCount(components) {
  var productsOnPage = _pickBy(components, function (value, key) {
    return key.includes('/product/') && !_isEmpty(value);
  });

  return Object.keys(productsOnPage).length;
}

module.exports = function () {
  window.kiln.plugins['product-count'] = function (store) {
    store.subscribe(function (mutation, state) {
      if (mutation.type === 'PRELOAD_SUCCESS' || _get(mutation, 'payload.uri', '').includes('/product/')) {
        var count = calculateProductCount(state.components);
        updateProductCount(count);
        updateGtmPageComponent(store, state, count);
      }
    });
  };
};
}, {"32":32,"59":59,"75":75}];
window.modules["plugins_right-rail.kilnplugin"] = [function(require,module,exports){'use strict';

var _require = require(56),
    getComponentName = _require.getComponentName;
/**
 * pushDownRightRail
 *
 * Adjusts the top padding of the right rail to make room for the overflowing
 * full-width article header
 *
 */


function pushDownRightRail() {
  var articleHeader = document.querySelector('.article-header'),
      rightRail = document.querySelector('.layout > .wrapper > .tertiary'),
      height;

  if (articleHeader && rightRail) {
    height = articleHeader.getBoundingClientRect().height;
    rightRail.style.paddingTop = "".concat(height + 40, "px");
  }
}

function isArticleMutation(type, uri) {
  var cmptName;

  if (!uri) {
    return false;
  }

  cmptName = getComponentName(uri);
  return type === 'RENDER_COMPONENT' && (cmptName === 'article-details' || cmptName === 'article');
}

module.exports = function () {
  window.kiln.plugins['right-rail'] = function (store) {
    store.subscribe(function (mutation) {
      var uri = mutation.payload && mutation.payload.uri;

      if (mutation.type === 'FINISHED_DECORATING' || isArticleMutation(mutation.type, uri)) {
        pushDownRightRail();
      }
    });
  };
};
}, {"56":56}];
window.modules["syndication_button.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var UiIconButton = window.kiln.utils.components.UiIconButton,
    _get = require(32),
    _find = require(71),
    _filter = require(51),
    _require = require(56),
    getComponentName = _require.getComponentName;

module.exports = {
  data: function data() {
    return {};
  },
  computed: {
    isPagePublished: function isPagePublished() {
      return _get(this.$store, 'state.page.state.published', false);
    },
    article: function article() {
      return _find(_get(this.$store, 'state.components', {}), function (component, uri) {
        return getComponentName(uri) === 'article';
      });
    },
    hasArticle: function hasArticle() {
      return !!this.article;
    },
    isArticleSyndicated: function isArticleSyndicated() {
      return _get(this, 'article.syndicationStatus') === 'copy';
    },
    hasSitesToSyndicateTo: function hasSitesToSyndicateTo() {
      var currentProtocol = _get(this.$store, 'state.site.protocol'),
          sites = _get(this.$store, 'state.allSites');

      if (currentProtocol === 'https') {
        return _filter(sites, function (site) {
          return site.protocol === 'https';
        }).length > 1;
      } else {
        return true;
      }
    }
  },
  methods: {
    openSyndication: function openSyndication() {
      this.$store.dispatch('openModal', {
        title: 'Article Syndication',
        size: 'normal',
        type: 'article-syndication'
      });
    }
  },
  mounted: function mounted() {
    var _this = this;

    setTimeout(function () {
      var article = _this.article;

      if (article && article.syndicatedUrl) {
        _this.$store.dispatch('addAlert', {
          type: 'warning',
          text: "You are editing a syndicated article. Changes you make will NOT be reflected on the <a href=\"".concat(article.syndicatedUrl, "\">original</a>.")
        });
      }

      if (article && article.syndicationStatus === 'syndicated') {
        _this.$store.dispatch('addAlert', {
          type: 'info',
          text: 'This article has been syndicated. Changes here will NOT be reflected on syndicated copies.'
        });
      }
    }, 1000);
  },
  components: {
    UiIconButton: UiIconButton
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ui-icon-button',{staticClass:"toolbar-action-button",attrs:{"disabled":!_vm.isPagePublished || !_vm.hasArticle || _vm.isArticleSyndicated || !_vm.hasSitesToSyndicateTo,"color":"white","size":"large","type":"secondary","icon":"rss_feed","tooltip":"Syndicate Article"},on:{"click":_vm.openSyndication}})}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-542c7590", __vue__options__)
  } else {
    hotAPI.reload("data-v-542c7590", __vue__options__)
  }
})()}}, {"8":8,"10":10,"32":32,"51":51,"56":56,"71":71}];
window.modules["syndication_index.kilnplugin"] = [function(require,module,exports){'use strict';

module.exports = function () {
  window.kiln.toolbarButtons['article-syndication'] = require("syndication_button.kilnplugin");
  window.kiln.modals['article-syndication'] = require("syndication_modal.kilnplugin");
};
}, {"syndication_button.kilnplugin":"syndication_button.kilnplugin","syndication_modal.kilnplugin":"syndication_modal.kilnplugin"}];
window.modules["syndication_modal.kilnplugin"] = [function(require,module,exports){(function (__filename){
;(function(){
'use strict';

var UiButton = window.kiln.utils.components.UiButton,
    UiSelect = window.kiln.utils.components.UiSelect,
    _get = require(32),
    _map = require(37),
    _uniqBy = require(913),
    _reduce = require(124),
    _assign = require(57),
    _includes = require(33),
    _forEach = require(27),
    _last = require(24),
    _find = require(71),
    _findKey = require(206),
    _toPlainObject = require(804),
    _isArray = require(129),
    _mapValues = require(178),
    rest = require(5),
    asyncReplace = require(1147),
    _require = require(56),
    getComponentName = _require.getComponentName,
    log = window.kiln.utils.logger(__filename),
    internalPageProps = ['layout', 'customUrl', 'url', 'urlHistory'];

var convertedItems;

function clearArticleProperties(data, originalUrl) {
  data.featureTypes = _mapValues(data.featureTypes, function () {
    return false;
  });
  data.storyCharacteristics = _mapValues(data.storyCharacteristics, function () {
    return false;
  });
  data.contentChannel = '';
  data.syndicationStatus = 'copy';
  data.syndicatedUrl = originalUrl;
  delete data.graphicBrandingRubric;
  delete data.graphicBrandingRubricMediaPath;
  delete data.hypenatedBrandingRubric;
}

function getPageComponents(currentPage, currentSite, componentsRoute, pageUri) {
  var protocol = currentSite.protocol ? "".concat(currentSite.protocol, ":") : window.location.protocol,
      port = currentSite.port && currentSite.port !== 80 ? ":".concat(currentSite.port) : '',
      prefix = "".concat(protocol, "//").concat(currentSite.host).concat(port).concat(currentSite.path),
      componentPromises = _reduce(Object.keys(currentPage), function (promises, key) {
    if (!_includes(internalPageProps, key)) {
      _forEach(currentPage[key], function (uri) {
        var url = "".concat(prefix).concat(uri.substring(uri.indexOf(componentsRoute)), ".json");
        promises.push(rest.get(url).then(function (data) {
          return {
            uri: uri,
            data: data
          };
        }));
      });
    }

    return promises;
  }, []);

  return Promise.all(componentPromises).then(function (promises) {
    return promises.concat({
      uri: pageUri,
      data: _toPlainObject(currentPage)
    });
  });
}

function convert(uriPrefix, componentsRoute, pagesRoute) {
  return function (rootObjects) {
    return Promise.all(_map(rootObjects, function (rootObject) {
      if (_includes(rootObject.uri, pagesRoute)) {
        return {
          uri: "".concat(uriPrefix).concat(rootObject.uri.substring(rootObject.uri.indexOf(pagesRoute))),
          data: _reduce(rootObject.data, function (result, val, key) {
            if (_isArray(val)) {
              result[key] = _map(val, function (uri) {
                return "".concat(uriPrefix).concat(uri.substring(uri.indexOf(componentsRoute)));
              });
            }

            return result;
          }, {})
        };
      } else {
        var str = JSON.stringify(rootObject.data);
        return new Promise(function (resolve, reject) {
          asyncReplace(str, /"_ref":"(.*?)\/_?components\//g, "\"_ref\":\"".concat(uriPrefix).concat(componentsRoute), function (err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }).then(JSON.parse).then(function (convertedData) {
          return {
            uri: "".concat(uriPrefix).concat(rootObject.uri.substring(rootObject.uri.indexOf(componentsRoute))),
            data: convertedData
          };
        });
      }
    }));
  };
}

module.exports = {
  data: function data() {
    return {
      templateOptions: [],
      selectedSite: {
        label: 'None',
        value: ''
      },
      selectedTemplate: {
        label: 'None',
        value: ''
      }
    };
  },
  computed: {
    isUnderscoredRoute: function isUnderscoredRoute() {
      return _get(this, '$store.state.page.uri').includes('/_pages/');
    },
    isSiteSelected: function isSiteSelected() {
      return this.selectedSite.value !== '';
    },
    isTemplateSelected: function isTemplateSelected() {
      return this.selectedTemplate.value !== '';
    },
    hasSelectedTarget: function hasSelectedTarget() {
      return this.isSiteSelected && this.isTemplateSelected;
    },
    currentSite: function currentSite() {
      return _get(this, '$store.state.site');
    },
    sites: function sites() {
      return _get(this, '$store.state.allSites');
    },
    siteOptions: function siteOptions() {
      var currentSite = this.currentSite;
      return _reduce(this.sites, function (sites, site) {
        if (site.slug === currentSite.slug) {
          return sites;
        } else if (currentSite.protocol === 'https' && site.protocol !== 'https') {
          return sites;
        } else {
          sites.push({
            label: site.name,
            value: site.slug
          });
          return sites;
        }
      }, []);
    }
  },
  methods: {
    close: function close() {
      this.$store.dispatch('closeModal');
    },
    selectSite: function selectSite(selectedSite) {
      var _this = this;

      var site = this.sites[selectedSite.value],
          listsRoute = this.isUnderscoredRoute ? '/_lists/' : '/lists/',
          pagesRoute = this.isUnderscoredRoute ? '/_pages/' : '/pages/',
          protocol = site.protocol ? "".concat(site.protocol, ":") : window.location.protocol,
          port = site.port && site.port !== 80 ? ":".concat(site.port) : '',
          prefix = "".concat(protocol, "//").concat(site.host).concat(port).concat(site.path),
          listsUrl = "".concat(prefix).concat(listsRoute, "new-pages"),
          templatePromises = rest.get(listsUrl).then(function (categories) {
        return _reduce(categories, function (promises, category) {
          if (category.children) {
            return promises.concat(_map(category.children, function (template) {
              return rest.get("".concat(prefix).concat(pagesRoute).concat(template.id)).then(function (pageData) {
                return {
                  label: template.title,
                  value: pageData.layout
                };
              });
            }));
          } else {
            return promises.concat(rest.get("".concat(prefix).concat(pagesRoute).concat(category.id)).then(function (pageData) {
              return {
                label: category.title,
                value: pageData.layout
              };
            }));
          }
        }, []);
      });
      return templatePromises.then(function (templatePromises) {
        return Promise.all(templatePromises).then(function (templates) {
          _this.templateOptions = _uniqBy(templates, 'value');
        }).catch(function (e) {
          log.error("Unable to load templates for ".concat(selectedSite.label), e);

          _this.$store.dispatch('addAlert', {
            type: 'error',
            text: "Cannot syndicate to ".concat(selectedSite.label, ", please try another site.")
          });
        });
      });
    },
    prepareSyndication: function prepareSyndication() {
      var site = this.sites[this.selectedSite.value],
          currentPage = _get(this, '$store.state.page.data'),
          componentsRoute = this.isUnderscoredRoute ? '/_components/' : '/components/',
          pagesRoute = this.isUnderscoredRoute ? '/_pages/' : '/pages/',
          uriPrefix = "".concat(site.host).concat(site.path),
          originalUrl = _get(this, '$store.state.page.state.url');

      return getPageComponents(currentPage, this.currentSite, componentsRoute, _get(this, '$store.state.page.uri')).then(convert(uriPrefix, componentsRoute, pagesRoute)).then(function (converted) {
        var article = _find(converted, function (component) {
          return _includes(component.uri, 'components/article/');
        });

        clearArticleProperties(article.data, originalUrl);
        convertedItems = converted;
      });
    },
    syndicate: function syndicate() {
      var _this2 = this;

      var site = this.sites[this.selectedSite.value],
          layout = this.selectedTemplate.value,
          pagesRoute = this.isUnderscoredRoute ? '/_pages/' : '/pages/',
          componentsRoute = this.isUnderscoredRoute ? '/_components/' : '/components/',
          protocol = site.protocol ? "".concat(site.protocol, ":") : window.location.protocol,
          port = site.port && site.port !== 80 ? ":".concat(site.port) : '',
          prefix = "".concat(protocol, "//").concat(site.host).concat(port).concat(site.path),
          pageID = _last(_get(this, '$store.state.page.uri').split('/')),
          pagesUrl = "".concat(prefix).concat(pagesRoute).concat(pageID),
          currentArticle = _findKey(_get(this, '$store.state.components', {}), function (component, uri) {
        return getComponentName(uri) === 'article';
      });

      return Promise.all(_map(convertedItems, function (item) {
        if (_includes(item.uri, pagesRoute)) {
          return rest.put(pagesUrl, _assign({}, item.data, {
            layout: layout
          }), true);
        } else {
          var url = "".concat(prefix).concat(item.uri.substring(item.uri.indexOf(componentsRoute)));
          return rest.put(url, item.data, true);
        }
      })).then(function () {
        var article = _get(_this2, "$store.state.components['".concat(currentArticle, "']"), {}),
            payload = {},
            currentProtocol = _this2.currentSite.protocol ? "".concat(_this2.currentSite.protocol, ":") : window.location.protocol,
            currentPort = _this2.currentSite.port && _this2.currentSite.port !== 80 ? ":".concat(_this2.currentSite.port) : '',
            currentPrefix = "".concat(currentProtocol, "//").concat(_this2.currentSite.host).concat(currentPort).concat(_this2.currentSite.path);

        if (article.plaintextPrimaryHeadline) {
          payload.title = article.plaintextPrimaryHeadline;
        }

        if (article.authors) {
          payload.authors = _map(article.authors, function (author) {
            return author.text;
          });
        }

        return rest.patch("".concat(site.protocol, "://").concat(site.host).concat(site.path).concat(pagesRoute).concat(pageID, "/meta"), payload, true);
      }).then(function () {
        return _this2.$store.dispatch('saveComponent', {
          uri: currentArticle,
          data: {
            syndicationStatus: 'syndicated'
          }
        });
      }).then(function () {
        _this2.close();

        _this2.$store.dispatch('showSnackbar', {
          message: "Syndicated to ".concat(site.name),
          action: 'View',
          onActionClick: function onActionClick() {
            return window.open("".concat(pagesUrl, ".html?edit=true"));
          }
        });
      }).catch(function (e) {
        log.error("Unable to create page on ".concat(site.name, " with ").concat(layout), e);

        _this2.$store.dispatch('addAlert', {
          type: 'error',
          text: "Cannot syndicate to ".concat(site.name, ", please try another site or page template.")
        });
      });
    }
  },
  components: {
    UiButton: UiButton,
    UiSelect: UiSelect
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"article-syndication"},[_c('div',{staticClass:"article-syndication-body"},[_c('ui-select',{staticClass:"site-select",attrs:{"options":_vm.siteOptions,"hasSearch":true,"label":"Select Site","floatingLabel":true,"help":"Choose which site to syndicate to"},on:{"select":_vm.selectSite},model:{value:(_vm.selectedSite),callback:function ($$v) {_vm.selectedSite=$$v},expression:"selectedSite"}}),_vm._v(" "),_c('ui-select',{staticClass:"template-select",attrs:{"disabled":!_vm.isSiteSelected,"options":_vm.templateOptions,"hasSearch":true,"label":"Select Page Template","floatingLabel":true,"help":"Choose which page template to use"},on:{"select":_vm.prepareSyndication},model:{value:(_vm.selectedTemplate),callback:function ($$v) {_vm.selectedTemplate=$$v},expression:"selectedTemplate"}})],1),_vm._v(" "),_c('div',{staticClass:"article-syndication-foot ui-button-group"},[_c('ui-button',{attrs:{"type":"primary","buttonType":"button","color":"default"},on:{"click":function($event){$event.stopPropagation();return _vm.close($event)}}},[_vm._v("Cancel")]),_vm._v(" "),_c('ui-button',{attrs:{"type":"primary","buttonType":"button","color":"accent","disabled":!_vm.hasSelectedTarget},on:{"click":function($event){$event.stopPropagation();return _vm.syndicate($event)}}},[_vm._v("Syndicate Article")])],1)])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9e7716d2", __vue__options__)
  } else {
    hotAPI.reload("data-v-9e7716d2", __vue__options__)
  }
})()}
}).call(this,"/services/kiln/plugins/syndication/modal.vue")}, {"5":5,"8":8,"10":10,"24":24,"27":27,"32":32,"33":33,"37":37,"56":56,"57":57,"71":71,"124":124,"129":129,"178":178,"206":206,"804":804,"913":913,"1147":1147}];
window.modules["tv-show-picker_index.kilnplugin"] = [function(require,module,exports){'use strict';

module.exports = function () {
  window.kiln.inputs['tv-show-picker'] = require("tv-show-picker_input.kilnplugin");
  window.kiln.modals['tv-show-picker'] = require("tv-show-picker_modal.kilnplugin");
};
}, {"tv-show-picker_input.kilnplugin":"tv-show-picker_input.kilnplugin","tv-show-picker_modal.kilnplugin":"tv-show-picker_modal.kilnplugin"}];
window.modules["tv-show-picker_input.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var UiIconButton = window.kiln.utils.components.UiIconButton;
module.exports = {
  props: ['name', 'data', 'schema', 'args'],
  data: function data() {
    return {};
  },
  methods: {
    openPicker: function openPicker() {
      var overridePath = this.args.overridePath,
          uri = this.$store.state.ui.currentForm.uri,
          path = this.name,
          modalConfig = {
        title: 'Browse Shows',
        size: 'large',
        type: 'tv-show-picker',
        data: {
          uri: uri,
          path: path,
          overridePath: overridePath
        },
        redirectTo: {
          uri: uri,
          path: this.$store.state.ui.currentForm.path,
          field: this.name
        }
      };
      this.$store.dispatch('openModal', modalConfig);
    }
  },
  components: {
    UiIconButton: UiIconButton
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ui-icon-button',{attrs:{"buttonType":"button","color":"default","type":"secondary","tooltip":"Browse Shows","icon":"search"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.openPicker($event)}}})}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-55681c78", __vue__options__)
  } else {
    hotAPI.reload("data-v-55681c78", __vue__options__)
  }
})()}}, {"8":8,"10":10}];
window.modules["tv-show-picker_modal.kilnplugin"] = [function(require,module,exports){;(function(){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UiTextbox = window.kiln.utils.components.UiTextbox,
    UiButton = window.kiln.utils.components.UiButton,
    UiProgressCircular = window.kiln.utils.components.UiProgressCircular,
    queryService = require(49),
    sanitize = require(39),
    SEARCH_INDEX = 'tv-show',
    tv = require("tv-show-picker_tv.kilnplugin"),
    _get = require(32),
    _cloneDeep = require(47),
    FIELDS = ['showName', 'showImageURL'],
    _set = require(87);

function getTvShow() {
  var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var queryTerm = filters && filters.queryTerm ? sanitize.toSmartText(filters.queryTerm.trim()) : '',
      query = queryService(SEARCH_INDEX, window.kiln.locals);
  queryService.onlyWithTheseFields(query, FIELDS);

  if (queryTerm) {
    queryService.addFilter(query, {
      match_phrase_prefix: {
        showName: queryTerm
      }
    });
  } else {
    _set(query, 'body.query.match_all', {});
  }

  return queryService.searchByQueryWithRawResult(query).then(function (result) {
    return {
      tvshows: _.map(result.hits.hits, '_source'),
      count: result.hits.total
    };
  });
}

module.exports = {
  props: ['data'],
  data: function data() {
    return {
      isLoading: true,
      results: {
        tvshows: [],
        totalCount: 0
      },
      filters: {
        queryTerm: ''
      }
    };
  },
  computed: {
    noTvShowFound: function noTvShowFound() {
      return this.results.totalCount === 0;
    },
    resultCount: function resultCount() {
      var suffix = this.results.totalCount === 1 ? '' : 's';
      return "".concat(this.results.totalCount, " Tv Show").concat(suffix);
    }
  },
  methods: {
    handleQuery: function handleQuery() {
      var _this = this;

      this.isLoading = true;
      getTvShow(this.filters).then(function (result) {
        _this.results.tvshows = result.tvshows;
        _this.results.totalCount = result.count;
        _this.isLoading = false;
      }).catch(function (e) {
        _this.results.tvshows = [];
        _this.results.totalCount = 0;
        _this.isLoading = false;
      });
    },
    close: function close() {
      this.$store.dispatch('closeModal');
    },
    select: function select(tvShow) {
      var _this2 = this;

      var currentURI = this.data.uri,
          currentField = this.data.path,
          fieldData = _get(this.$store, "state.components['".concat(currentURI, "']['").concat(currentField, "']")),
          currentData = _defineProperty({}, currentField, _cloneDeep(fieldData));

      _set(currentData, currentField, tvShow.showName);

      this.$store.dispatch('saveComponent', {
        uri: currentURI,
        data: currentData
      }).then(function () {
        return _this2.close();
      });
    }
  },
  mounted: function mounted() {
    this.handleQuery();
  },
  components: {
    UiTextbox: UiTextbox,
    UiButton: UiButton,
    UiProgressCircular: UiProgressCircular,
    'tv-result': tv
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tv-show-picker"},[_c('div',{staticClass:"tv-show-picker-wrap"},[_c('div',{staticClass:"tv-show-picker-head"},[_c('div',{staticClass:"tv-show-picker-filter-item"},[_c('ui-textbox',{attrs:{"type":"search","placeholder":"Search show names","autofocus":true},on:{"keydown-enter":_vm.handleQuery},model:{value:(_vm.filters.queryTerm),callback:function ($$v) {_vm.$set(_vm.filters, "queryTerm", $$v)},expression:"filters.queryTerm"}})],1)]),_vm._v(" "),_c('div',{staticClass:"tv-show-picker-body"},[(_vm.isLoading)?_c('div',{key:"loading-spinner",staticClass:"tv-show-picker-filler"},[_c('ui-progress-circular',{attrs:{"size":56}})],1):_c('div',{key:"loaded-content",staticClass:"tv-show-picker-search-results"},[_c('div',{staticClass:"tv-show-picker-results-heading"},[_c('h2',{staticClass:"kiln-list-header"},[_vm._v("List Of Tv Shows")]),_vm._v(" "),_c('span',{staticClass:"kiln-list-header"},[_vm._v(_vm._s(_vm.resultCount))])]),_vm._v(" "),(_vm.noTvShowFound)?_c('div',{key:"no-content",staticClass:"tv-show-picker-filler kiln-display1"},[_vm._v("No Tv Show found")]):_c('ol',{staticClass:"tv-show-picker-items"},_vm._l((_vm.results.tvshows),function(tv){return _c('li',{staticClass:"tv-show-picker-item kiln-accent-color"},[_c('tv-result',{attrs:{"tv":tv},on:{"select":function($event){_vm.select(tv)}}})],1)}),0)])]),_vm._v(" "),_c('div',{staticClass:"tv-show-picker-foot"},[_c('ui-button',{attrs:{"type":"primary","buttonType":"button","color":"default"},on:{"click":function($event){$event.stopPropagation();return _vm.close($event)}}},[_vm._v("Cancel")])],1)])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1e3b29b2", __vue__options__)
  } else {
    hotAPI.reload("data-v-1e3b29b2", __vue__options__)
  }
})()}}, {"8":8,"10":10,"32":32,"39":39,"47":47,"49":49,"87":87,"tv-show-picker_tv.kilnplugin":"tv-show-picker_tv.kilnplugin"}];
window.modules["tv-show-picker_tv.kilnplugin"] = [function(require,module,exports){;(function(){
'use strict';

var _includes = require(33),
    callout = require(80),
    mediaplay = require(53),
    dateHelper = require(1265);

module.exports = {
  props: ['tv'],
  computed: {
    imageUrl: function imageUrl() {
      return mediaplay.getDynamicRendition(this.tv.showImageURL, 100, 100, false);
    },
    imageSourceSet: function imageSourceSet() {
      var x1 = mediaplay.getDynamicRendition(this.tv.showImageURL, 100, 100, false),
          x2 = mediaplay.getDynamicRendition(this.tv.showImageURL, 100, 100, true);
      return "".concat(x1, " 1x, ").concat(x2, " 2x");
    },
    showName: function showName() {
      return this.tv.showName;
    }
  },
  methods: {
    select: function select() {
      var _this = this;

      this.$nextTick(function () {
        return _this.$emit('select', _this.tv);
      });
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"tv-show",staticClass:"tv-show-picker-tv kiln-accent-color",on:{"mousedown":_vm.select}},[_c('div',{staticClass:"tv-show-picker-tv-img-wrap"},[_c('img',{staticClass:"tv-show-picker-img",attrs:{"src":_vm.imageUrl,"srcset":_vm.imageSourceSet}})]),_vm._v(" "),_c('div',{staticClass:"tv-show-picker-tv-info"},[_c('span',{staticClass:"tv-show-picker-tv-headline kiln-body",domProps:{"innerHTML":_vm._s(_vm.showName)}})])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c23a0210", __vue__options__)
  } else {
    hotAPI.reload("data-v-c23a0210", __vue__options__)
  }
})()}}, {"8":8,"10":10,"33":33,"53":53,"80":80,"1265":1265}];
window.modules["plugins_word-count.kilnplugin"] = [function(require,module,exports){'use strict';

var wordCount = require(1267);
/**
 * update word count element after vue's current tick
 * @param  {number} count
 */


function updateWordCount(count) {
  window.setTimeout(function () {
    var wordCountEl = document.querySelector('.word-count');

    if (wordCountEl) {
      wordCountEl.innerHTML = 'Words: ' + count;
    }
  }, 0);
}

module.exports = function () {
  window.kiln.plugins['word-count'] = function (store) {
    // update word count whenever a paragraph, blockquote, article, etc is re-rendered
    store.subscribe(function (mutation, state) {
      var uri = mutation.payload && mutation.payload.uri;

      if (mutation.type === 'PRELOAD_SUCCESS' || mutation.type === 'RENDER_COMPONENT' && wordCount.isComponentWithWords(uri)) {
        updateWordCount(wordCount.count(state.components));
      }
    });
  };
};
}, {"1267":1267}];
window.modules["transformers_get-product-titles.kilnplugin"] = [function(require,module,exports){'use strict'; // Test stubbing is not possible if we destructure {get} here.
// https://stackoverflow.com/questions/34575750/how-to-stub-exported-function-in-es6

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var rest = require(5),
    _require = require(56),
    getComponentName = _require.getComponentName,
    arrayToSentence = require(250),
    _get = require(32);
/**
 * recursively find references to a key within an object
 * outputs a flattend array referenced values
 * @param {object} obj - object to iterate over
 * @param {string} key
 * @return {array}
 */


function collectChildrenWithKey() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var acc = [];
  if (obj.constructor.name !== 'Object') return acc;

  if (obj[key] !== undefined) {
    acc.push(obj[key]);
    collectChildrenWithKey(obj[key], key);
  }

  return acc;
}
/**
 * Collect all the product names listed on the page and populate the field with them
 * Stay under a character limit defined by maxLength
 * @param {String} fieldValue
 * @returns {String}
 */


module.exports = function () {
  var fieldValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var maxLength = 250,
      afterOut = '.',
      beforeOut = ' including ',
      spaceLeft = maxLength - fieldValue.length - beforeOut.length - afterOut.length; // early return if there's no room to add product names

  if (spaceLeft <= 0) return fieldValue; // Collect product titles

  return rest.get("".concat(window.location.pathname.replace(/\.[^/.]+$/, ''), ".json")).then(function (_ref2) {
    var main = _ref2.main;

    var productNames = _get(main, '[0].content', []) // collect and flatted all _refs in the content
    .reduce(function (acc, item) {
      acc.push.apply(acc, [item].concat(_toConsumableArray(collectChildrenWithKey(item['_ref'], '_ref'))));
      return acc;
    }, []).filter(function (_ref3) {
      var _ref = _ref3._ref;
      return getComponentName(_ref) === 'product';
    }).map(function (_ref4) {
      var name = _ref4.name;
      return name;
    }) // de-dupe product names from fieldValue
    .filter(function (name) {
      return !fieldValue.includes(name);
    }) // push names into accumulator if space allows
    .reduce(function (names, name) {
      // check if array as a sentence will fit in remaining space.
      // Otherwise return the accumulator w/o pushing.
      if (arrayToSentence(names.concat(name)).length > spaceLeft) {
        return names;
      }

      ;
      return names.concat(name);
    }, []); // no product names to add


    if (productNames.length < 1) return fieldValue;
    return "".concat(fieldValue).concat(beforeOut).concat(arrayToSentence(productNames)).concat(afterOut);
  }).catch(console.error);
};
}, {"5":5,"32":32,"56":56,"250":250}];
window.modules["transformers_index.kilnplugin"] = [function(require,module,exports){'use strict';

module.exports = function () {
  window.kiln.transformers.getProductTitles = require("transformers_get-product-titles.kilnplugin");
};
}, {"transformers_get-product-titles.kilnplugin":"transformers_get-product-titles.kilnplugin"}];
window.modules["validators_at-bottom.kilnplugin"] = [function(require,module,exports){'use strict';

var _reduceRight = require(908),
    _findIndex = require(79),
    _filter = require(51),
    _map = require(37),
    helpers = require("validators_helpers.kilnplugin"),
    shouldBeAtBottom = [// ordered array of components at the bottom
'single-related-story', // penultimate
'related', 'annotations' // last
];

function matchesVariation(bottomComponent, currentComponent, data) {
  if (bottomComponent === 'related' && currentComponent === 'related') {
    return !(data.componentVariation === 'related_gallery' || data.componentVariation === 'related_sponsored');
  }

  return bottomComponent === currentComponent;
}

module.exports = {
  label: 'Bottom Components',
  description: 'Certain components must be at the bottom of the article',
  type: 'error',
  validate: function validate(state) {
    var article = helpers.findArticle(state.components),
        content = article && article.content,
        length = content && content.length;
    var previousMatches = [];

    if (length) {
      return _reduceRight(content, function (errors, component, index) {
        var uri = component[helpers.refProp],
            name = helpers.getComponentName(component[helpers.refProp]),
            matchedIndex = _findIndex(shouldBeAtBottom, function (n) {
          return matchesVariation(n, name, state.components[uri]);
        }),
            // find the index of the matched name in the shouldBeAtBottom array
        shouldComeAfterMatchedIndexes = _filter(previousMatches, function (i) {
          return i < matchedIndex;
        }),
            mustBeAtBottom = matchedIndex > -1,
            isNotAtEnd = index < length - 1 - previousMatches.length,
            isOutOfOrder = shouldComeAfterMatchedIndexes.length > 0;

        if (mustBeAtBottom) {
          // this is a component that's in the shouldBeAtBottom array
          if (isNotAtEnd) {
            // component should be at the end of the article content, but isn't
            errors.push({
              uri: uri,
              // no field, since we can't focus on component lists
              location: "".concat(helpers.labelUtil(name)),
              preview: 'Must be at the bottom of the article.'
            });
          } else if (isOutOfOrder) {
            // component should come before a certain other one, but it isn't
            errors.push({
              uri: uri,
              // no field, since we can't focus on component lists
              location: "".concat(helpers.labelUtil(name)),
              preview: "Must be at the bottom of the article, and below ".concat(_map(shouldComeAfterMatchedIndexes, function (i) {
                return helpers.labelUtil(shouldBeAtBottom[i]);
              }).join(', '), ".")
            });
          }

          previousMatches.push(matchedIndex); // record the match
        }

        return errors;
      }, []);
    }
  }
};
}, {"37":37,"51":51,"79":79,"908":908,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_combined-length.kilnplugin"] = [function(require,module,exports){'use strict';

var helpers = require("validators_helpers.kilnplugin"),
    _get = require(32),
    _require = require(56),
    getComponentName = _require.getComponentName,
    _require2 = require(39),
    toPlainText = _require2.toPlainText,
    components = [{
  name: 'newsletter-flex-text',
  fields: ['defaultTitle', 'defaultDescription'],
  variation: 'newsletter-flex-text_homepage',
  combinedMax: 75
}, {
  name: 'collection-package',
  fields: ['title', 'teaser'],
  combinedMax: 55
}],
    forEachComponent = window.kiln.utils.validationHelpers.forEachComponent;

function displayFields(state, cmptName, fields) {
  var joint = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ' or ';
  return fields.map(function (field) {
    return helpers.labelUtil(field, _get(state.schemas, "".concat(cmptName, ".").concat(field)));
  }).join(joint);
}

function isInvalid(accu, state) {
  return function (data, uri) {
    var name = getComponentName(uri),
        opts = components.find(function (cmpt) {
      return cmpt.name === name;
    }),
        combined = toPlainText(opts.fields.reduce(function (all, field) {
      return all + data[field];
    }, ''));

    if (opts.variation && data.componentVariation !== opts.variation) {
      return;
    }

    if (combined.length > opts.combinedMax) {
      accu.push({
        uri: uri,
        field: opts.fields[0],
        location: "".concat(helpers.labelUtil(name), " \xBB ").concat(displayFields(state, name, opts.fields)),
        preview: "".concat(displayFields(state, name, opts.fields, ' + '), " must have a combined character count of ").concat(opts.combinedMax, " characters or fewer")
      });
    }

    return;
  };
}

module.exports = {
  label: 'Combined Field Length',
  description: 'Some fields cannot exceed a certain combined character count',
  type: 'error',
  validate: function validate(state) {
    var errors = [];
    forEachComponent(state, isInvalid(errors, state), components.map(function (c) {
      return c.name;
    }));
    return errors;
  }
};
}, {"32":32,"39":39,"56":56,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_component-list-length.kilnplugin"] = [function(require,module,exports){'use strict';

var helpers = require("validators_helpers.kilnplugin"),
    _reduce = require(124),
    _filter = require(51),
    _map = require(37),
    _find = require(71),
    cmpts = [// add a component, the field name of the component list you want to validate, and the min and max length here
{
  name: 'image-gallery',
  listField: 'images',
  maxLength: 300,
  minLength: 5
}, {
  name: 'product-list',
  listField: 'content',
  maxLength: 300,
  minLength: 3
}, {
  name: 'image-layout',
  listField: 'images',
  maxLength: 2,
  minLength: 1
}, {
  name: 'sticky-container',
  listField: 'content',
  maxLength: 2,
  minLength: 2
}];
/**
 * filterComponentsOnPage
 *
 * @param {Object} components
 * @returns {Array} component instances from the state that are of the types we're looking to validate
 */


function filterComponentsOnPage(components) {
  var componentNames = _map(cmpts, function (c) {
    return c.name;
  }); // get component names to look for
  // return only the components that appear in the list above


  return _filter(Object.keys(components), function (name) {
    return componentNames.indexOf(helpers.getComponentName(name)) > -1;
  });
}

module.exports = {
  label: 'Component List Length',
  description: 'Component(s) on this page have component-list(s) that do not satisfy length requirements',
  type: 'error',
  validate: function validate(state) {
    var rules, list;
    return _reduce(filterComponentsOnPage(state.components), function (errors, instance) {
      rules = _find(cmpts, function (cmpt) {
        return cmpt.name === helpers.getComponentName(instance);
      }); // get the "rules" for this component type

      list = state.components[instance][rules.listField]; // get the component list we're looking to validate

      if (list.length > rules.maxLength || list.length < rules.minLength) {
        errors.push({
          uri: instance,
          field: rules.listField,
          location: "".concat(helpers.labelUtil(helpers.getComponentName(instance))),
          preview: list.length > rules.maxLength ? "The ".concat(rules.listField, " field cannot exceed ").concat(rules.maxLength, " items.") : "Must have at least ".concat(rules.minLength, " items in the ").concat(rules.listField, " list.")
        });
      }

      return errors;
    }, []);
  }
};
}, {"37":37,"51":51,"71":71,"124":124,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_component-pairs.kilnplugin"] = [function(require,module,exports){'use strict';

var _reduce = require(124),
    helpers = require("validators_helpers.kilnplugin"),
    pairs = [{
  firstComponent: 'interactive-homelessness-tab',
  secondComponent: 'interactive-homelessness-panel',
  errorMessage: 'The number of tabs does not match the number of tab panels.'
}]; // add more component pairs you want to validate into here


module.exports = {
  label: 'Component Pairs',
  description: 'The number of components in certain pairs must match',
  type: 'error',
  validate: function validate(state) {
    return _reduce(pairs, function (errors, pair) {
      var diff = helpers.countComponents(state, pair.firstComponent) - helpers.countComponents(state, pair.secondComponent);

      if (diff > 0) {
        // too many of the first component
        errors.push({
          uri: helpers.getLastComponent(state, pair.firstComponent),
          // no field, since we can't focus on component lists
          location: "".concat(helpers.labelUtil(pair.firstComponent)),
          preview: pair.errorMessage
        });
      } else if (diff < 0) {
        // too many of the second component
        errors.push({
          uri: helpers.getLastComponent(state, pair.secondComponent),
          // no field, since we can't focus on component lists
          location: "".concat(helpers.labelUtil(pair.secondComponent)),
          preview: pair.errorMessage
        });
      }

      return errors;
    }, []);
  }
};
}, {"124":124,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_component-string-pairs.kilnplugin"] = [function(require,module,exports){'use strict';

var _reduce = require(124),
    _get = require(32),
    _isString = require(164),
    helpers = require("validators_helpers.kilnplugin"),
    pairs = [{
  matchComponent: 'annotation',
  matchString: {
    component: 'clay-paragraph',
    field: 'text',
    string: 'span class="clay-annotated kiln-phrase"'
  },
  errorMessage: 'Article annotations do not match annotations components.'
}]; // add more component/string pairs you want to validate into here

/**
 * count the number of components that have a field with a certain string
 * @param  {object} state
 * @param  {object} matchString
 * @return {number}
 */


function countStrings(state, matchString) {
  return _reduce(state.components, function (matches, component, uri) {
    if (helpers.isSameComponent(uri, matchString.component, component)) {
      var fieldValue = _get(component, matchString.field);

      if (_isString(fieldValue)) {
        // find all matches in a component
        matches = matches + fieldValue.split(matchString.string).length - 1;
      }
    }

    return matches;
  }, 0);
}

module.exports = {
  label: 'Matching Components',
  description: 'The number of certain components must match the number of text references',
  type: 'error',
  validate: function validate(state) {
    return _reduce(pairs, function (errors, pair) {
      var numberOfStrings = countStrings(state, pair.matchString),
          numberOfComponents = helpers.countComponents(state, pair.matchComponent),
          diff = numberOfStrings - numberOfComponents;

      if (diff > 0) {
        // too many strings
        errors.push({
          uri: helpers.getLastComponent(state, pair.matchString.component),
          field: pair.matchString.field,
          location: "".concat(helpers.labelUtil(pair.matchString.component)),
          preview: "".concat(pair.errorMessage, " (").concat(numberOfStrings, " vs ").concat(numberOfComponents, ")")
        });
      } else if (diff < 0) {
        // too many components
        errors.push({
          uri: helpers.getLastComponent(state, pair.matchComponent),
          // no field, since we can't focus on component lists
          location: "".concat(helpers.labelUtil(pair.matchComponent)),
          preview: "".concat(pair.errorMessage, " (").concat(numberOfStrings, " vs ").concat(numberOfComponents, ")")
        });
      }

      return errors;
    }, []);
  }
};
}, {"32":32,"124":124,"164":164,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_feature-rubric.kilnplugin"] = [function(require,module,exports){'use strict';

var _find = require(71),
    _findKey = require(206),
    _get = require(32),
    helpers = require("validators_helpers.kilnplugin");

module.exports = {
  label: 'Feature Rubrics',
  type: 'error',
  validate: function validate(state) {
    var article = _find(state.components, function (cmpt, uri) {
      return helpers.getComponentName(uri) === 'article';
    }),
        tags = _findKey(state.components, function (cmpt, uri) {
      return helpers.getComponentName(uri) === 'tags';
    });

    if (!tags || !article || _get(article, ['featureTypes', 'Sponsor Story'], false)) {
      return [];
    }

    if (!article.rubric) {
      return [{
        uri: tags,
        field: 'items',
        location: "".concat(helpers.labelUtil('tags')),
        preview: 'Articles must have a feature rubric'
      }];
    }

    if (article.rubric.length > 31) {
      return [{
        uri: tags,
        field: 'items',
        location: "".concat(helpers.labelUtil('tags')),
        preview: 'Feature rubric must be 31 characters or fewer in length'
      }];
    }

    return [];
  }
};
}, {"32":32,"71":71,"206":206,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_google-standout.kilnplugin"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _join = require(166),
    _intersection = require(173),
    _noop = require(864),
    dateFormat = require(52),
    differenceInCalendarDays = require(484),
    circulationService = require(55),
    helpers = require("validators_helpers.kilnplugin"),
    warningTriggerTags = ['breaking', 'breaking news', 'feature', 'interactives'];

function getTagValues(tagsComponent) {
  if (!tagsComponent) {
    return [];
  }

  return tagsComponent.items.map(function (item) {
    return item.text.toLowerCase();
  });
}

module.exports = {
  label: 'Google Standout Available',
  description: "This article was tagged with one of the tags ".concat(_join(warningTriggerTags, ', '), ". Ask your editor about adding the Google News Standout tag."),
  type: 'warning',
  validate: function validate(state) {
    var articleUri = helpers.getLastComponent(state, 'article'),
        tagsUri = helpers.getLastComponent(state, 'tags'),
        tags = state.components[tagsUri],
        tagValues = getTagValues(tags),
        hasTargetTag = _intersection(tagValues, warningTriggerTags).length > 0,
        googleStandoutUri = helpers.getLastComponent(state, 'google-standout'),
        googleStandout = state.components[googleStandoutUri],
        now = new Date(),
        firstPublishTime = _get(state, 'page.state.firstPublishTime', null),
        daysSincePublish = differenceInCalendarDays(dateFormat(now), dateFormat(firstPublishTime || now));

    if (daysSincePublish < 2 && hasTargetTag && googleStandout && !googleStandout.active) {
      return circulationService.getRollingStandoutArticles(state.locals).then(function (queryResult) {
        if (queryResult.length < 7) {
          return [{
            uri: articleUri,
            field: 'shouldBeGoogleStandout',
            location: "".concat(helpers.labelUtil('article'), " \xBB Mark Google Standout")
          }];
        }
      }).catch(_noop);
    }
  }
};
}, {"32":32,"52":52,"55":55,"166":166,"173":173,"484":484,"864":864,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_hed-dek.kilnplugin"] = [function(require,module,exports){'use strict';

var helpers = require("validators_helpers.kilnplugin"),
    _find = require(71),
    _findKey = require(206);

module.exports = {
  label: 'Headline + Teaser Length',
  description: 'Headline and display teaser combined character count exceeds 150 characters. The teaser will be hidden in the published version of this article.',
  type: 'warning',
  validate: function validate(state) {
    var article = _find(state.components, function (cmpt, uri) {
      return helpers.getComponentName(uri) === 'article';
    });

    if (!article) {
      return [];
    }

    if (article.ledeSize !== 'feature' && article.ledeSize !== 'special-feature') {
      return [];
    }

    if (article.hideTeaser) {
      return [{
        uri: _findKey(state.components, function (cmpt, uri) {
          return helpers.getComponentName(uri) === 'article';
        }),
        field: 'displayTeaser',
        location: helpers.labelUtil('article')
      }];
    }

    return [];
  }
};
}, {"71":71,"206":206,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_helpers.kilnplugin"] = [function(require,module,exports){'use strict';

var _startCase = require(111),
    _find = require(71),
    _filter = require(51),
    _findLastKey = require(897),
    _isEmpty = require(75),
    _require = require(56),
    getComponentName = _require.getComponentName;

function dropClay(name) {
  return name.replace(/^clay\-/i, '');
}
/**
 * determine if a component is a the specified one
 * note: check to see if the component has been deleted, by checking its data
 * @param  {string}  uri
 * @param  {string}  name
 * @param {object} data
 * @return {Boolean}
 */


function isSameComponent(uri, name, data) {
  return module.exports.getComponentName(uri) === name && !_isEmpty(data);
}
/**
 * count number of matching components in the state
 * @param  {object} state
 * @param  {string} name
 * @return {number}
 */


function countComponents(state, name) {
  return _filter(state.components, function (component, uri) {
    return isSameComponent(uri, name, component);
  }).length;
}
/**
 * get uri of the last matching component
 * @param  {object} state
 * @param  {string} name
 * @return {string}
 */


function getLastComponent(state, name) {
  return _findLastKey(state.components, function (component, uri) {
    return isSameComponent(uri, name, component);
  });
}
/**
 * getLastComponentData
 *
 * @param {Object} state
 * @param {String} name
 * @returns {Object} data from component found in getLastComponent
 */


function getLastComponentData(state, name) {
  return state.components[getLastComponent(state, name)];
}

module.exports = {
  // from kiln/utils/references
  getComponentName: getComponentName,
  // from kiln/utils/references
  refProp: '_ref',
  labelProp: '_label',
  // from kiln/utils/label
  labelUtil: function labelUtil(name, schema) {
    var label = schema && schema[module.exports.labelProp];

    if (label) {
      return label;
    } else {
      return dropClay(name).split('-').map(_startCase).join(' '); // split on hyphens
    }
  },
  // from kiln/validators/helpers
  getPreviewText: function getPreviewText(text, index, length) {
    var cutStart = 20,
        cutEnd = 20; // don't add ellipses if we're this close to the start or end

    var previewText = text,
        endIndex = index;

    if (index > cutStart) {
      previewText = "\u2026".concat(text.substr(index - cutStart));
      endIndex = index - (index - cutStart) + 1;
    }

    if (previewText.length > endIndex + cutEnd) {
      previewText = "".concat(previewText.substr(0, endIndex + cutEnd + length), "\u2026");
    }

    return previewText;
  },
  findArticle: function findArticle(components) {
    return _find(components, function (data, uri) {
      return getComponentName(uri) === 'article';
    });
  },
  isSameComponent: isSameComponent,
  countComponents: countComponents,
  getLastComponent: getLastComponent,
  getLastComponentData: getLastComponentData
};
}, {"51":51,"56":56,"71":71,"75":75,"111":111,"897":897}];
window.modules["validators_imagelayout-restriction.kilnplugin"] = [function(require,module,exports){'use strict';

var _reduce = require(124),
    _startsWith = require(34),
    _map = require(37),
    _transform = require(912),
    helpers = require("validators_helpers.kilnplugin");

module.exports = {
  label: 'Image Layout',
  description: 'Rendition and layout have specific requirements.',
  type: 'error',
  validate: function validate(state) {
    // create a collection of all mediaplay images ref'd by their uri as a key
    var mediaPlays = _transform(state.components, function (result, component, uri) {
      if (helpers.getComponentName(uri) === 'mediaplay-image') {
        result[uri] = component;
      }
    }, {});

    return _reduce(state.components, function (errors, component, uri) {
      if (helpers.getComponentName(uri) === 'image-layout') {
        _map(component.images, function (image) {
          if (mediaPlays[image._ref].componentVariation !== 'mediaplay-image_layout') {
            errors.push({
              uri: image._ref,
              field: 'componentVariation',
              location: "".concat(helpers.labelUtil(helpers.getComponentName(image._ref)), " \xBB Component Variation"),
              preview: 'The Component Variation must be set to \'Layout\'.'
            });
          }

          if (!_startsWith(mediaPlays[image._ref].rendition, 'flex')) {
            errors.push({
              uri: image._ref,
              field: 'rendition',
              location: "".concat(helpers.labelUtil(helpers.getComponentName(image._ref)), " \xBB Size"),
              preview: 'Image Layout images must have one of the following sizes: Flex, Flex Small or Flex Large'
            });
          }
        });
      }

      return errors;
    }, []);
  }
};
}, {"34":34,"37":37,"124":124,"912":912,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_index.kilnplugin"] = [function(require,module,exports){'use strict';

module.exports = function () {
  window.kiln.validators['at-bottom'] = require("validators_at-bottom.kilnplugin");
  window.kiln.validators['component-pairs'] = require("validators_component-pairs.kilnplugin");
  window.kiln.validators['component-string-pairs'] = require("validators_component-string-pairs.kilnplugin");
  window.kiln.validators['max-instances'] = require("validators_max-instances.kilnplugin");
  window.kiln.validators['one-required'] = require("validators_one-required.kilnplugin");
  window.kiln.validators['renditions'] = require("validators_renditions.kilnplugin");
  window.kiln.validators['unique-url'] = require("validators_unique-url.kilnplugin");
  window.kiln.validators['component-list-length'] = require("validators_component-list-length.kilnplugin");
  window.kiln.validators['subscription-plans-selection'] = require("validators_only-one-required.kilnplugin");
  window.kiln.validators['google-standout'] = require("validators_google-standout.kilnplugin");
  window.kiln.validators['imagelayout-restriction'] = require("validators_imagelayout-restriction.kilnplugin");
  window.kiln.validators['feature-rubric'] = require("validators_feature-rubric.kilnplugin");
  window.kiln.validators['hed-dek'] = require("validators_hed-dek.kilnplugin");
  window.kiln.validators['related'] = require("validators_related.kilnplugin");
  window.kiln.validators['nymag-lede-container-limits'] = require("validators_nymag-lede-container-limits.kilnplugin");
  window.kiln.validators['combined-length'] = require("validators_combined-length.kilnplugin");
  window.kiln.validators['teaser-cap'] = require("validators_teaser-cap.kilnplugin");
};
}, {"validators_teaser-cap.kilnplugin":"validators_teaser-cap.kilnplugin","validators_unique-url.kilnplugin":"validators_unique-url.kilnplugin","validators_component-pairs.kilnplugin":"validators_component-pairs.kilnplugin","validators_component-string-pairs.kilnplugin":"validators_component-string-pairs.kilnplugin","validators_max-instances.kilnplugin":"validators_max-instances.kilnplugin","validators_one-required.kilnplugin":"validators_one-required.kilnplugin","validators_renditions.kilnplugin":"validators_renditions.kilnplugin","validators_feature-rubric.kilnplugin":"validators_feature-rubric.kilnplugin","validators_hed-dek.kilnplugin":"validators_hed-dek.kilnplugin","validators_component-list-length.kilnplugin":"validators_component-list-length.kilnplugin","validators_nymag-lede-container-limits.kilnplugin":"validators_nymag-lede-container-limits.kilnplugin","validators_only-one-required.kilnplugin":"validators_only-one-required.kilnplugin","validators_imagelayout-restriction.kilnplugin":"validators_imagelayout-restriction.kilnplugin","validators_at-bottom.kilnplugin":"validators_at-bottom.kilnplugin","validators_combined-length.kilnplugin":"validators_combined-length.kilnplugin","validators_related.kilnplugin":"validators_related.kilnplugin","validators_google-standout.kilnplugin":"validators_google-standout.kilnplugin"}];
window.modules["validators_max-instances.kilnplugin"] = [function(require,module,exports){'use strict';

var _reduce = require(124),
    helpers = require("validators_helpers.kilnplugin"),
    blocked = {
  // component name: maximum number allowed
  'single-related-story': 1,
  annotations: 1,
  'gtm-page': 1,
  // thou shalt not add more than 1 of these components to a search page
  'listings-search-controller': 1,
  'listings-search-filters': 1,
  'listings-search-results': 1,
  'vue-search-bar': 1
}; // add more components here


module.exports = {
  label: 'Max Instances',
  description: 'You cannot have more than one instance of these components',
  type: 'error',
  validate: function validate(state) {
    return _reduce(blocked, function (errors, max, name) {
      if (helpers.countComponents(state, name) > max) {
        errors.push({
          uri: helpers.getLastComponent(state, name),
          // no field, since we can't focus on component lists
          location: "".concat(helpers.labelUtil(name))
        });
      }

      return errors;
    }, []);
  }
};
}, {"124":124,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_nymag-lede-container-limits.kilnplugin"] = [function(require,module,exports){// Allow this to pass eslint complexity rule

/* eslint complexity: ["error", 9] */
'use strict';

var _find = require(71),
    _findKey = require(206),
    helpers = require("validators_helpers.kilnplugin");

module.exports = {
  label: 'NYMAG Lede Container',
  description: 'Container has article min and max requirements.',
  type: 'error',
  validate: function validate(state) {
    var ledeContainer = _find(state.components, function (cmpt, uri) {
      return helpers.getComponentName(uri) === 'nymag-lede-container';
    }),
        uri = _findKey(state.components, function (cmpt, uri) {
      return helpers.getComponentName(uri) === 'nymag-lede-container';
    });

    if (!ledeContainer) {
      return [];
    }

    if (ledeContainer.manualArticles.length !== 3 && ledeContainer.componentVariation === 'nymag-lede-container') {
      return [{
        uri: uri,
        field: 'manualArticles',
        preview: 'This style varation must have 3 articles'
      }];
    } else if (ledeContainer.componentVariation === 'nymag-lede-container_fancy-vertical') {
      if (ledeContainer.manualArticles.length > 5 || ledeContainer.manualArticles.length < 1) {
        return [{
          uri: uri,
          field: 'manualArticles',
          preview: 'This style varation must have between 1 and 5 articles.'
        }];
      }
    } else if (ledeContainer.componentVariation === 'nymag-lede-container_fancy-horizontal') {
      if (ledeContainer.manualArticles.length < 5 || ledeContainer.manualArticles.length > 7) {
        return [{
          uri: uri,
          field: 'manualArticles',
          preview: 'This style varation must have between 5 and 7 articles.'
        }];
      }
    }

    return [];
  }
};
}, {"71":71,"206":206,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_one-required.kilnplugin"] = [function(require,module,exports){'use strict';
/*
 * This validation rule is for components that require at least one field value for publication.
 * For example, an annotation requires `text` OR `imageUrl`
 */

/**
 * @param {string} componentName
 * @returns {string}
 */

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

var _reduce = require(124),
    _find = require(71),
    _get = require(32),
    _isString = require(164),
    helpers = require("validators_helpers.kilnplugin"),
    isFieldEmpty = require(43).isFieldEmpty,
    // note: all operators are here if you want to use them in rules, below
operators = {
  '===': function _(l, r) {
    return l === r;
  },
  '!==': function _(l, r) {
    return l !== r;
  },
  '<': function _(l, r) {
    return l < r;
  },
  '>': function _(l, r) {
    return l > r;
  },
  '<=': function _(l, r) {
    return l <= r;
  },
  '>=': function _(l, r) {
    return l >= r;
  },
  typeof: function _typeof(l, r) {
    return _typeof2(l) == r;
  }
},
    blocked = {
  // blocked if both text and imageUrl are empty
  annotation: ['text', 'imageUrl'],
  'interactive-homelessness-tab': ['title', 'imageUrl'],
  'agree-disagree-quiz-question': ['question', 'mediaQuestion'],
  'scale-quiz-question': ['question', 'mediaQuestion'],
  // 'multiple-choice-quiz-question': ['question', 'mediaQuestion'],
  'fill-in-the-blank-quiz-questions': ['question', 'mediaElements'],
  'podcast-subscribe': ['applePodcastLink', 'googleMusicPlayLink', 'spotifyLink', 'rssLink']
}; // add more components and their conditionally-required fields here

/**
 * determine if a field is invalid, by comparing it to some value
 * @param  {*}  value
 * @param  {string}  operator
 * @param  {*}  compare
 * @return {Boolean}
 */


function isFieldInvalid(value, _ref) {
  var operator = _ref.operator,
      compare = _ref.compare;
  return operators[operator](value, compare);
}
/**
 * get field name
 * @param  {string|object} field
 * @return {string}
 */


function getFieldName(field) {
  return _isString(field) ? field : field.field;
}
/**
 * determine if a field is empty or invalid
 * @param  {object}  component from state
 * @param  {string|object}  field     matching rule
 * @return {Boolean}
 */


function isEmptyOrInvalid(component, field) {
  var name = getFieldName(field),
      value = component[name];

  if (_isString(field)) {
    // see if the value is empty
    return isFieldEmpty(value);
  } else {
    return isFieldInvalid(value, field);
  }
}
/**
 * validate a component against field rules
 * @param  {array} errors
 * @param  {string} uri
 * @param  {object} component
 * @param  {array} fields
 * @param {object} schemas
 */


function validateComponent(errors, _ref2) {
  var uri = _ref2.uri,
      component = _ref2.component,
      fields = _ref2.fields,
      schemas = _ref2.schemas;
  var invalidFields = [];
  fields.forEach(function (field) {
    if (isEmptyOrInvalid(component, field)) {
      var fieldName = getFieldName(field);
      invalidFields.push(fieldName); // add this BEFORE checking

      if (invalidFields.length === fields.length) {
        // all fields are empty/invalid!
        var componentName = helpers.getComponentName(uri);
        errors.push({
          uri: uri,
          location: "".concat(helpers.labelUtil(componentName), " \xBB ").concat(invalidFields.map(function (name) {
            return helpers.labelUtil(name, _get(schemas, "".concat(componentName, ".").concat(name)));
          }).join(' or '))
        });
      }
    }
  });
}

module.exports = {
  label: 'One Required',
  description: 'At least one of these fields are required for publication',
  type: 'error',
  validate: function validate(state) {
    return _reduce(state.components, function (errors, component, uri) {
      var fields = _find(blocked, function (val, key) {
        return helpers.getComponentName(uri) === key;
      }); // if the component is one of the blocked ones, validate it
      // and add to the errors


      if (fields) {
        validateComponent(errors, {
          uri: uri,
          component: component,
          fields: fields,
          schemas: state.schemas
        });
      }

      return errors;
    }, []);
  }
};
}, {"32":32,"43":43,"71":71,"124":124,"164":164,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_only-one-required.kilnplugin"] = [function(require,module,exports){'use strict';

var helpers = require("validators_helpers.kilnplugin"),
    _filter = require(51),
    validations = [{
  componentName: 'subscription-plan',
  filter: function filter(component) {
    return component.data.isDefaultSelection;
  },
  hasErrors: function hasErrors(componentsOnPage, filteredComponents) {
    var legacyComponentsOnPage = _filter(componentsOnPage, function (item) {
      return item.data.componentVariation === 'subscription-plan_original';
    }); // limit validation to subscription-plan_original variation


    return legacyComponentsOnPage.length && filteredComponents.length !== 1;
  },
  targetField: 'isDefaultSelection',
  previewMessage: 'Only one default plan may be selected'
}];

module.exports = {
  label: 'One Required Selection',
  description: 'Must be only one selected',
  type: 'error',
  validate: function validate(state) {
    var result = [];
    validations.forEach(function (validation) {
      var componentsUri = Object.keys(state.components),
          componentsOnPage = _filter(componentsUri, function (uri) {
        return helpers.getComponentName(uri) === validation.componentName;
      }).map(function (uri) {
        return {
          data: state.components[uri],
          uri: uri
        };
      }),
          filteredComponents = componentsOnPage.filter(validation.filter);

      if (validation.hasErrors(componentsOnPage, filteredComponents)) {
        var firstComponent = filteredComponents.length ? filteredComponents[0] : componentsOnPage[0];
        result.push({
          uri: firstComponent.uri,
          field: validation.targetField,
          preview: validation.previewMessage,
          location: helpers.labelUtil(helpers.getComponentName(firstComponent.uri))
        });
      }
    });
    return result;
  },
  validations: validations
};
}, {"51":51,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_related.kilnplugin"] = [function(require,module,exports){'use strict';

var _filter = require(51),
    _keys = require(128),
    _reduce = require(124),
    helpers = require("validators_helpers.kilnplugin");

module.exports = {
  label: 'Related Stories',
  type: 'error',
  validate: function validate(state) {
    var relatedGalleries = _filter(_keys(state.components), function (k) {
      return helpers.getComponentName(k) === 'related' && state.components[k].componentVariation === 'related_gallery';
    });

    var related;
    return _reduce(relatedGalleries, function (errors, uri) {
      related = state.components[uri];

      if (related.items.length > 2) {
        errors.push({
          uri: uri,
          field: 'items',
          location: helpers.labelUtil('related'),
          preview: 'This component accepts a maximum of two articles.'
        });
      }

      return errors;
    }, []);
  }
};
}, {"51":51,"124":124,"128":128,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_renditions.kilnplugin"] = [function(require,module,exports){'use strict';

var _reduce = require(124),
    _some = require(118),
    _find = require(71),
    _includes = require(33),
    _startCase = require(111),
    _get = require(32),
    helpers = require("validators_helpers.kilnplugin"),
    restrictedFields = {
  'mediaplay-image': 'rendition'
},
    // list of image components to validate, and their `rendition` field
ledes = ['lede-feature', 'lede-feature-cathy-horyn', 'lede-full-bleed', 'lede-video'],
    // list of feature lede components. add to this list if you create a new lede!
restrictedRenditions = {
  'flex-small': ['feature', 'one-column'],
  'flex-large': ['one-column'],
  'full-bleed': ['one-column'],
  // note: remove this (and update test) if we ever add a feature rendition that is NOT available in one-column layouts
  'test-feature-only': ['feature']
}; // list of renditions and where they're available
// note: renditions are formatted like this in case we want to allow certain renditions
// only in features, rather than allowing anything in features to be used in one-column layouts


module.exports = {
  label: 'Renditions',
  description: 'This type of page prohibits some mediaplay image renditions',
  type: 'error',
  validate: function validate(state) {
    var hasOneColumnLayout = _get(state, 'layout.name') === 'one-column-layout',
        hasFeatureLede = _some(state.components, function (component, uri) {
      return _includes(ledes, helpers.getComponentName(uri));
    });

    return _reduce(state.components, function (errors, component, uri) {
      var field = _find(restrictedFields, function (val, key) {
        return key === helpers.getComponentName(uri);
      }),
          restricted = _find(restrictedRenditions, function (val, key) {
        return component && component[field] == key;
      });

      if (field && restricted) {
        // it's a type of component we care about, and a rendition that's restricted!
        var isAllowedInOneColumn = _includes(restricted, 'one-column'),
            isAllowedInFeature = _includes(restricted, 'feature'),
            isAllowedInBoth = isAllowedInOneColumn && isAllowedInFeature;

        if (isAllowedInBoth && !hasOneColumnLayout && !hasFeatureLede) {
          // rendition is allowed in both, but we're in neither
          errors.push({
            uri: uri,
            field: field,
            location: "".concat(helpers.labelUtil(helpers.getComponentName(uri))),
            preview: "".concat(_startCase(component[field]), " rendition only allowed in one-column layouts or feature pages")
          });
        } else if (!isAllowedInFeature && isAllowedInOneColumn && !hasOneColumnLayout) {
          // rendition is restricted to one-column layout, and we're not in one of those
          errors.push({
            uri: uri,
            field: field,
            location: "".concat(helpers.labelUtil(helpers.getComponentName(uri))),
            preview: "".concat(_startCase(component[field]), " rendition only allowed in one-column layouts")
          });
        } else if (!isAllowedInOneColumn && isAllowedInFeature && !hasFeatureLede) {
          // rendition is restricted to features, and we don't have a feature lede
          errors.push({
            uri: uri,
            field: field,
            location: "".concat(helpers.labelUtil(helpers.getComponentName(uri))),
            preview: "".concat(_startCase(component[field]), " rendition only allowed in feature pages")
          });
        }
      }

      return errors;
    }, []);
  }
};
}, {"32":32,"33":33,"71":71,"111":111,"118":118,"124":124,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_teaser-cap.kilnplugin"] = [function(require,module,exports){'use strict';

var _filter = require(51),
    _keys = require(128),
    _reduce = require(124),
    helpers = require("validators_helpers.kilnplugin"),
    MAX_TEASER_LENGTH = 90;

module.exports = {
  label: 'Manual Article',
  description: "Teaser is longer than ".concat(MAX_TEASER_LENGTH, " characters."),
  type: 'error',
  MAX_TEASER_LENGTH: MAX_TEASER_LENGTH,
  validate: function validate(state) {
    var document = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.document;

    var manualArticle = _filter(_keys(state.components), function (k) {
      return helpers.getComponentName(k) === 'manual-article';
    });

    if (!manualArticle.length) {
      return [];
    }

    return _reduce(manualArticle, function (errors, uri) {
      var article = state.components[uri],
          teaser = document.querySelector("[data-uri='".concat(uri, "'] .manual-article-teaser")),
          isTeaserVisible = teaser && teaser.offsetParent;

      if (article.plainTeaser && article.plainTeaser.length > MAX_TEASER_LENGTH && isTeaserVisible) {
        errors.push({
          uri: uri,
          field: 'teaser',
          location: "".concat(helpers.labelUtil(helpers.getComponentName(uri))),
          preview: "Teaser is longer than ".concat(MAX_TEASER_LENGTH, " characters.")
        });
      }

      return errors;
    }, []);
  }
};
}, {"51":51,"124":124,"128":128,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
window.modules["validators_unique-url.kilnplugin"] = [function(require,module,exports){'use strict';

var _findKey = require(206),
    _includes = require(33),
    _noop = require(864),
    rest = require(5),
    helpers = require("validators_helpers.kilnplugin");

function addPort(uri, location) {
  var hasPort = location.port === '80' || location.port === '443' || uri.indexOf(':' + location.port) !== -1;
  return hasPort ? uri : uri.replace(location.hostname, "".concat(location.hostname, ":").concat(location.port));
}

function addProtocol(uri, location) {
  var hasProtocol = uri.indexOf(location.protocol) === 0;
  return hasProtocol ? uri : "".concat(location.protocol, "//").concat(uri);
}
/**
 * add port and protocol to uri
 * @param  {string} uri
 * @param  {object} [location] passed in for testing
 * @return {string}
 */


function uriToUrl(uri, location) {
  location = location ||
  /* istanbul ignore next: can't stub window.location */
  window.location;
  return addProtocol(addPort(uri, location), location);
}

module.exports = {
  label: 'Evergreen URL',
  description: 'This URL already exists. Please change the slug',
  type: 'error',
  validate: function validate(state, location) {
    // location is passed in for testing only
    // note: this finds any component that has these two fields, meaning we don't have to
    // explicitly test for specific components (article, lede-video, etc)
    var mainUri = _findKey(state.components, function (component) {
      return component.evergreenSlug && component.slug;
    }),
        mainComponent = mainUri && state.components[mainUri];

    if (mainComponent) {
      var section = mainComponent.section || 'article',
          slug = mainComponent.slug,
          possibleURL = uriToUrl("".concat(state.site.prefix, "/").concat(section, "/").concat(slug, ".html"), location);
      return rest.getHTML(possibleURL).then(function (html) {
        if (html && !_includes(html, mainUri)) {
          return [{
            uri: mainUri,
            field: 'slug',
            location: "".concat(helpers.labelUtil(helpers.getComponentName(mainUri)), " \xBB Publish URL"),
            preview: "/".concat(section, "/").concat(slug, ".html") // full url is too long

          }];
        } // if no html returned, or html with the component uri (same page), return undefined

      }).catch(_noop); // if error fetching a page, return undefined
    } // if no main component found, return undefined

  }
};
}, {"5":5,"33":33,"206":206,"864":864,"validators_helpers.kilnplugin":"validators_helpers.kilnplugin"}];
