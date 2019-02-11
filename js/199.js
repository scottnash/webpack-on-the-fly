window.modules["199"] = [function(require,module,exports){;(function(){
"use strict";

var store = require(197);

module.exports = {
  props: ['planType', 'planName', 'unselectedButtonText', 'defaultSelection'],
  computed: {
    isSelected: function isSelected() {
      return this.planType === store.state.selectedPlan;
    }
  },
  methods: {
    selectPlanType: function selectPlanType() {
      var elementToAdd = this.$el.closest(".subscription-plan"),
          elementToRemove = this.$el.closest(".subscription-plans");
      store.actions.selectPlanType(this.planType);

      if (elementToRemove.querySelector('.selected')) {
        elementToRemove.querySelector('.selected').classList.remove('selected');
      }

      elementToAdd.classList.add('selected');
    }
  },
  mounted: function mounted() {
    var _this = this;

    var propNames = Object.keys(this._props),
        data = propNames.reduce(function (acc, propName) {
      acc[propName] = _this[propName];
      return acc;
    }, {}),
        nearestPlan = this.$el.closest(".subscription-plan");
    nearestPlan.addEventListener('click', function () {
      _this.selectPlanType();
    });

    if (!!this.defaultSelection) {
      store.actions.setDefaultPlan(this.planName);
      this.selectPlanType();
    }

    store.actions.registerPlan(data);
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('button',{staticClass:"plan-button",class:{ selected: _vm.isSelected }},[_c('span',{staticClass:"unselected-button"},[_vm._v(_vm._s(_vm.unselectedButtonText))]),_vm._v(" "),_c('span',{staticClass:"selected-button"})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require(10)
  hotAPI.install(require(8), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7cf4bba2", __vue__options__)
  } else {
    hotAPI.reload("data-v-7cf4bba2", __vue__options__)
  }
})()}}, {"8":8,"10":10,"197":197}];
