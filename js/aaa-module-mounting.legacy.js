window.modules["aaa-module-mounting.legacy"] = [function(require,module,exports){'use strict'; // Note: this mounts before all client.js files, so legacy client controllers may call DS.controller()
// it also mounts before other legacy services (because of the filename) so they can call DS.service()

var eventify = require(143),
    _pickBy = require(59),
    _each = require(213),
    fingerprintjs2 = require(215),
    DS = require(214);

function registerGlobals() {
  window.DS = DS;
  window.Eventify = eventify;
  window.Fingerprint2 = fingerprintjs2; // allow these libs to be imported into Dollar Slice components

  DS.value('Eventify', eventify);
  DS.value('Fingerprint2', fingerprintjs2);
  DS.value('$document', window.document);
  DS.value('$window', window);
}
/**
 * Mount all Dollar Slice components.
 */


function mountDollarSliceComponents() {
  // search page for components, and instantiate their controllers
  DS.service('components', ['$document', '$module', function ($document, $module) {
    var controllers = _pickBy($module.definitions, function (definition) {
      return definition.providerStrategy === $module.providers.controller;
    }),
        list = Object.keys(controllers); // for each component on the page, loop through the instances and kickoff the controller


    _each(list, function (name) {
      var components = $document.querySelectorAll('[data-uri*="/_components/' + name + '/"]'),
          // matches data-uri="<site prefix>/_components/<name>/instances/<id>"
      defaultComponents = $document.querySelectorAll('[data-uri$="/_components/' + name + '"]'); // matches data-uri="<site prefix>/_components/<name>"

      _each(components, initController(name));

      _each(defaultComponents, initController(name));
    }); // expose list of components on the page


    this.components = list;

    function initController(name) {
      return function (component) {
        try {
          $module.get(name, component);
        } catch (error) {
          logMountError(component, error);
        }
      };
    }
  }]); // other components might want to interact with our service, but we'll start it here.

  DS.get('components');
}
/**
 * Log an error mounting the client script for the specified element.
 * @param  {HtmlElement} el
 * @param  {Error} error
 */


function logMountError(el, error) {
  // element tag will be the full contents of the component's tag such as:
  // <div data-uri="nymag.com/selectall/_components/ad-recirc/instances/article@published" class="ad-recirc" data-placeholder="title" data-delay="3.5" data-disable-recirc="">
  var elementTag = el.outerHTML.slice(0, el.outerHTML.indexOf(el.innerHTML));
  console.error('Error attaching controller to ' + elementTag, error);
} // globals (like DS) must be registered before other files call DS.service() or DS.component()


registerGlobals(); // wait until everything else has been mounted before instantiating legacy DS controllers

document.addEventListener('DOMContentLoaded', function () {
  mountDollarSliceComponents();
});
}, {"59":59,"143":143,"213":213,"214":214,"215":215}];
