window.modules["love-map.client"] = [function(require,module,exports){/* global google:false */
'use strict';

var dom = require(1),
    _debounce = require(107),
    _throttle = require(23),
    $gtm = require(41);

DS.controller('love-map', [function () {
  var entries = window.loveMapEntries,
      thisHTML = document.querySelector('html'),
      markers = [],
      selectedIndex = -1,
      offsetX = 0,
      offsetY = 0,
      // this is where the map is configured
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(40.74, -73.99),
    // roughly centered on NYC
    zoom: window.innerWidth <= 600 ? 14 : 13,
    // initial zoom level
    maxZoom: 17,
    minZoom: 11,
    gestureHandling: 'cooperative',
    // allows page to scroll, map scrolls with cmd
    scrollwheel: false,
    // disable scroll actually
    clickableIcons: false,
    // no map icons
    disableDefaultUI: true,
    // get rid of all map controls (street view, map type, etc)
    zoomControl: true,
    // bring back zoom control
    zoomControlOptions: {
      // position zoom control
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    // Google needs the quotes around the properties

    /* eslint-disable */
    styles: [// map styles - feature visibility and colors
    {
      'featureType': 'all',
      // remove all color
      'stylers': [{
        'saturation': -100
      }]
    }, {
      'featureType': 'landscape',
      // color the land light grey
      'elementType': 'geometry.fill',
      'stylers': [{
        'color': '#f9f9f8'
      }]
    }, {
      'featureType': 'water',
      // color the water blue-grey
      'elementType': 'geometry.fill',
      'stylers': [{
        'color': '#e9eded'
      }]
    }, {
      'featureType': 'administrative',
      // remove all administrative features (state lines, neighbourhood, etc)
      'elementType': 'all',
      'stylers': [{
        'visibility': 'off'
      }]
    }, {
      'featureType': 'administrative.neighborhood',
      // bring neighbourhood labels back
      'elementType': 'all',
      'stylers': [{
        'visibility': 'on'
      }]
    }, {
      'featureType': 'administrative.neighborhood',
      // bring neighbourhood labels back
      'elementType': 'labels.text.fill',
      'stylers': [{
        'color': '#a6a6a6'
      }]
    }, {
      'featureType': 'landscape',
      // remove all landscape labels
      'elementType': 'labels',
      'stylers': [{
        'visibility': 'off'
      }]
    }, {
      'featureType': 'poi',
      // remove all points of interest
      'elementType': 'all',
      'stylers': [{
        'visibility': 'off'
      }]
    }, {
      'featureType': 'road',
      // remove all road labels
      'elementType': 'labels',
      'stylers': [{
        'visibility': 'off'
      }]
    }, {
      'featureType': 'road.local',
      // bring back labels on local roads (eg manhattan streets)
      'elementType': 'labels.text.fill',
      'stylers': [{
        'visibility': 'on'
      }, {
        'color': '#a6a6a6'
      }]
    }, {
      'featureType': 'road.arterial',
      // bring back labels on arterial roads (eg manhattan avenues)
      'elementType': 'labels.text.fill',
      'stylers': [{
        'visibility': 'on'
      }, {
        'color': '#a6a6a6'
      }]
    }, {
      'featureType': 'road.highway',
      // attempt to reduce highway dominance of the map
      'elementType': 'geometry',
      'stylers': [{
        'color': '#FFFFFF'
      }, {
        'weight': 1
      }, {
        'visibility': 'simplified'
      }]
    }, {
      'featureType': 'transit',
      // remove all transit features (transit lines, stations, etc)
      'elementType': 'all',
      'stylers': [{
        'visibility': 'off'
      }]
    }, {
      'featureType': 'transit.station',
      // bring back transit stations
      'elementType': 'labels',
      'stylers': [{
        'visibility': 'on',
        'color': '#a6a6a6'
      }]
    }, {
      'featureType': 'water',
      // remove labels on bodies of water
      'elementType': 'labels',
      'stylers': [{
        'visibility': 'off'
      }]
    }]
    /* eslint-enable */

  }),
      // properties to be applied to the markers
  categoryProperty = {
    hookups: {
      color: '#15d418',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 40"><path fill="#15d418" d="M28.76,34.12a1.25,1.25,0,0,1-1.19-1.64A9.81,9.81,0,0,0,25,23.28a9.9,9.9,0,0,0-2.63,9,1.25,1.25,0,0,1,.14.57,1.23,1.23,0,0,1-1.26,1.25,1.17,1.17,0,0,1-.32,0A11.67,11.67,0,0,1,12,24.41c-.9-5.13.56-10.14,3.73-12.76a1.25,1.25,0,0,1,2,.94,6.59,6.59,0,0,0,.74,2.82C21,12.49,21.64,9.24,20.9,4.58A1.25,1.25,0,0,1,22.3,3.15c2.06.29,6.44,3.94,7.35,10a5.78,5.78,0,0,0,.93-2.9,1.25,1.25,0,0,1,2-1c4.81,3.58,6.37,10.62,5.39,15.43A11.52,11.52,0,0,1,29,34.09,1.25,1.25,0,0,1,28.76,34.12ZM25,20.46a1.24,1.24,0,0,1,.68.2c3.26,2.09,4.89,6.66,4.67,10.36a9.12,9.12,0,0,0,5.17-6.83,14.44,14.44,0,0,0-2.9-11.48A7.86,7.86,0,0,1,29.18,17a1.25,1.25,0,0,1-1.86-1.13,11.73,11.73,0,0,0-3.67-9.11,14.14,14.14,0,0,1-4.31,11.5,1.25,1.25,0,0,1-1.7.06,7,7,0,0,1-1.83-2.92A12.72,12.72,0,0,0,14.48,24a9.21,9.21,0,0,0,5.18,7c-.2-3.68,1.44-8.22,4.67-10.3A1.25,1.25,0,0,1,25,20.46Z"/></svg>'
    },
    breakups: {
      color: '#111111',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 40"><path fill="#111111" d="M37.83,9.53a8.43,8.43,0,0,0-11.92,0l-.91.91-.9-.9A8.44,8.44,0,0,0,12.16,21.46l12,11.95a1.25,1.25,0,0,0,1.77,0L37.83,21.46a8.43,8.43,0,0,0,0-11.93ZM13.93,11.3a5.94,5.94,0,0,1,8.39,0l1,1L20,16.53a1.25,1.25,0,0,0,.17,1.72l5.44,4.63L24.23,30,13.93,19.69A6,6,0,0,1,13.93,11.3Zm22.13,8.39-9,9,1.2-6.08a1.25,1.25,0,0,0-.42-1.19l-5.08-4.32L25.94,13l1.74-1.73a5.93,5.93,0,1,1,8.39,8.39Z"/></svg>'
    },
    publicsex: {
      color: '#d0011b',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 40"><path fill="#d0011b" d="M43.31,19.42c-3.62-6.89-10-11.17-16.65-11.17h-.4c-6.65,0-13,4.28-16.65,11.17a1.25,1.25,0,0,0,0,1.16c3.62,6.89,10,11.17,16.65,11.17h.41c6.65,0,13-4.28,16.65-11.17A1.25,1.25,0,0,0,43.31,19.42ZM26.66,29.25h-.41c-5.45,0-10.93-3.61-14.12-9.25,3.2-5.64,8.68-9.25,14.12-9.25h.4c5.45,0,10.93,3.61,14.12,9.25C37.59,25.64,32.11,29.25,26.66,29.25Z"/><path fill="#d0011b" d="M26.46,13.5A6.5,6.5,0,1,0,33,20,6.51,6.51,0,0,0,26.46,13.5Zm0,10.5a4,4,0,1,1,4-4A4,4,0,0,1,26.46,24Z"/></svg>'
    },
    missedopportunities: {
      color: '#f2ba26',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 40"><path fill="#f2ba26" d="M34.61,7.52a1.25,1.25,0,0,0,2.1,1.35L39.13,5.1h0a1.21,1.21,0,0,0-.55-1.81h0L34.47,1.49a1.25,1.25,0,0,0-1,2.29l1,.43L13.56,10.57l-6-1.08a1.25,1.25,0,0,0-.79,2.34l1,.5a1.24,1.24,0,0,0,.72,2.37l-.54,1a1.25,1.25,0,0,0,2,1.51L14.29,13,35.19,6.61Z"/><path fill="#f2ba26" d="M38.26,16.22a7.18,7.18,0,0,0-10.16,0l-.6.59-.59-.59A7.18,7.18,0,0,0,16.75,26.38l9.87,9.87a1.25,1.25,0,0,0,1.77,0l9.87-9.87a7.18,7.18,0,0,0,0-10.16Zm-1.77,8.39-9,9-9-9A4.68,4.68,0,0,1,25.14,18l1.48,1.48a1.25,1.25,0,0,0,1.77,0L29.87,18a4.68,4.68,0,1,1,6.62,6.62Z"/></svg>'
    },
    findinglove: {
      color: '#00bcf1',
      icon: '<svg id="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 40"><path fill="#00bcf1" d="M47.3,19.35a1.23,1.23,0,0,0-.46-.95h0l-4.61-3.92a1.25,1.25,0,1,0-1.62,1.9l2,1.71H37.52a7.18,7.18,0,0,0-11.93-7.25l-.6.59-.59-.59A7.18,7.18,0,0,0,12.48,18.1h-.58L4.52,14.32a1.25,1.25,0,0,0-1.44,2L4.92,18.1H4a1.25,1.25,0,1,0,0,2.5h1L3.08,22.37a1.25,1.25,0,0,0,1.44,2l7.39-3.78h2c.12.14.24.28.37.41l9.87,9.87a1.25,1.25,0,0,0,1.77,0L35.75,21c.13-.13.25-.27.37-.41h6.53l-2,1.72a1.25,1.25,0,1,0,1.62,1.9l4.61-3.92h0A1.23,1.23,0,0,0,47.3,19.35ZM25,28.23,17.37,20.6H25a1.25,1.25,0,0,0,0-2.5H15.2a4.67,4.67,0,0,1,7.44-5.48l1.48,1.48a1.25,1.25,0,0,0,1.77,0l1.48-1.48a4.68,4.68,0,0,1,7.24,5.85,1.32,1.32,0,0,0-.07.11,4.73,4.73,0,0,1-.54.66Z"/></svg>'
    },
    other: {
      color: '#ab41ff',
      icon: '<svg id="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 40"><path fill="#ab41ff" d="M25.75,4.58A14.38,14.38,0,0,0,13.46,26.41l-3.12,5.83A1.25,1.25,0,0,0,12,33.94l5.7-3a14.24,14.24,0,0,0,8,2.44,14.37,14.37,0,1,0,0-28.75Zm0,26.25a11.78,11.78,0,0,1-7.17-2.41,1.25,1.25,0,0,0-1.34-.11l-2.75,1.47L16,26.94a1.25,1.25,0,0,0-.07-1.29,11.87,11.87,0,1,1,9.81,5.18Z"/><path fill="#ab41ff" d="M29.43,11.77a4.36,4.36,0,0,0-1.54-.8A6.59,6.59,0,0,0,26,10.7a6.19,6.19,0,0,0-2.88.69,8.25,8.25,0,0,0-2.43,1.94l2.2,2.23c.18-.2.37-.41.58-.6a5.72,5.72,0,0,1,.67-.54,3.81,3.81,0,0,1,.71-.39,1.92,1.92,0,0,1,.68-.14,3.54,3.54,0,0,1,.54,0,1.55,1.55,0,0,1,.49.15,1,1,0,0,1,.35.3.78.78,0,0,1,.13.47.85.85,0,0,1-.25.56,5.43,5.43,0,0,1-.6.57c-.24.2-.5.4-.78.61a7.46,7.46,0,0,0-.78.67A4.18,4.18,0,0,0,24,18a1.7,1.7,0,0,0-.24.88l0,1.63h3.78V19.42a.86.86,0,0,1,.24-.58,4.37,4.37,0,0,1,.6-.55l.78-.59A5.25,5.25,0,0,0,30,17a4.31,4.31,0,0,0,.6-.91,2.61,2.61,0,0,0,.25-1.17,4.13,4.13,0,0,0-.38-1.82A3.82,3.82,0,0,0,29.43,11.77Z"/><path fill="#ab41ff" d="M27.41,23.59a2.48,2.48,0,0,0-.77-.47,2.71,2.71,0,0,0-1-.18,2.35,2.35,0,0,0-1,.2,2.4,2.4,0,0,0-.73.5,1.94,1.94,0,0,0-.46.69,2.08,2.08,0,0,0-.15.78,1.87,1.87,0,0,0,.17.79,2,2,0,0,0,.49.66,2.64,2.64,0,0,0,.74.47,2.29,2.29,0,0,0,.92.18,2.47,2.47,0,0,0,1.78-.62,2,2,0,0,0,.65-1.48,2,2,0,0,0-.67-1.52Z"/></svg>'
    }
  };

  function Constructor(el) {
    this.el = el;
    this.map = dom.find(this.el, '.map');
    this.event = dom.find(this.el, '.event');
    this.initMap();
    this.resizingEvents();
  }

  Constructor.prototype = {
    events: {
      '.complex-dropdown change': 'selectFilter',
      '.close click': 'closeDialog'
    },
    initMap: function initMap() {
      this.addMarkers(map);
      this.defaultEvent(); // GA tracking for pageviews

      $gtm.reportCustomEvent({
        category: 'interactive',
        label: 'love map',
        action: 'page view'
      }); // GA tracking for map dragging and panning

      map.addListener('dragend', function () {
        $gtm.reportCustomEvent({
          category: 'interactive',
          label: 'love map',
          action: 'map pan'
        });
      }); // GA tracking for map zoom in/out

      map.addListener('zoom_changed', function () {
        $gtm.reportCustomEvent({
          category: 'interactive',
          label: 'love map',
          action: 'map zoom'
        });
      });
    },
    addMarkers: function addMarkers(map) {
      var i;

      for (i = 0; i < entries.length; i++) {
        this.addMarker(map, entries[i], i);
      }
    },
    addMarker: function addMarker(map, marker, index) {
      var circle = {
        path: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
        fillColor: categoryProperty[marker.categoryNoSpace].color,
        fillOpacity: 1,
        scale: 0.6,
        strokeColor: '#ffffff',
        strokeWeight: 1
      },
          activeMarker = {
        path: 'M10.301726,0.10851213 C10.301726,0.10851213 33.7981577,-0.574029168 10.2709271,33.6387603 L10.206143,33.6387603 C-12.7040461,-0.54256065 10.301726,0.10851213 10.301726,0.10851213 Z M14.2238162,10.3639935 C14.2238161,8.80627207 13.3053755,7.40195431 11.8968075,6.80594154 C10.4882396,6.20992876 8.86697454,6.53961108 7.78908669,7.64124168 C6.71119884,8.74287228 6.38898794,10.3994751 6.97271652,11.838496 C7.55644509,13.277517 8.93114253,14.2155279 10.4557209,14.215089 C12.5369543,14.2150891 14.2242918,12.4915562 14.2248782,10.3650787 L14.2238162,10.3639935 Z',
        fillColor: categoryProperty[marker.categoryNoSpace].color,
        fillOpacity: 1,
        scale: 1.5,
        strokeColor: '#ffffff',
        strokeWeight: 1,
        size: new google.maps.Size(25, 25),
        anchor: new google.maps.Point(6, 25)
      },
          mapMarker = new google.maps.Marker({
        position: {
          lat: marker.lat,
          lng: marker.lng
        },
        map: map,
        animation: google.maps.Animation.DROP,
        title: marker.plainAddress,
        category: marker.category,
        categoryNoSpace: marker.categoryNoSpace,
        decade: marker.decade,
        address: marker.address,
        tag: marker.tag,
        story: marker.story,
        year: marker.year,
        icon: circle,
        visible: true,
        markerIndex: index
      }); // Here's where the marker displays its info

      mapMarker.addListener('click', function () {
        var eventInfo = document.getElementById('event'),
            story = document.querySelector('.story'),
            category = document.querySelector('.event-category'),
            divider = document.querySelector('.event-divider'),
            tag = document.querySelector('.tag'),
            address = document.querySelector('.address'),
            year = document.querySelector('.event-year'); // reset all the markers back to clear selected marker

        this.resetMarkerStyle(); // now, set the active marker

        mapMarker.setIcon(activeMarker); // update the currently selected index

        selectedIndex = mapMarker.markerIndex; // for mobile, have the overlay take over the screen

        this.setMobileOverlay();
        eventInfo.classList.remove('hidden');
        story.innerHTML = marker.story;
        tag.innerHTML = marker.tag;
        category.innerHTML = marker.category;
        address.innerHTML = marker.address;
        year.innerHTML = marker.year;
        divider.innerHTML = categoryProperty[marker.categoryNoSpace].icon; // GA tracking for marker clicks

        $gtm.reportCustomEvent({
          category: 'interactive',
          label: 'love map',
          action: 'map marker click'
        });
      }.bind(this)); // This will be needed for filter functionality

      markers.push(mapMarker);
    },
    // when necessary reset all of the markers back to their original state
    resetMarkerStyle: function resetMarkerStyle() {
      var circle;

      if (selectedIndex > -1) {
        circle = {
          path: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
          fillColor: categoryProperty[markers[selectedIndex].categoryNoSpace].color,
          fillOpacity: 1,
          scale: 0.6,
          strokeColor: '#ffffff',
          strokeWeight: 1
        };
        markers[selectedIndex].setIcon(circle);
      }
    },
    initialMarker: function initialMarker() {
      var activeMarker; // array location of the initial story in the overlay

      selectedIndex = 66;
      activeMarker = {
        path: 'M10.301726,0.10851213 C10.301726,0.10851213 33.7981577,-0.574029168 10.2709271,33.6387603 L10.206143,33.6387603 C-12.7040461,-0.54256065 10.301726,0.10851213 10.301726,0.10851213 Z M14.2238162,10.3639935 C14.2238161,8.80627207 13.3053755,7.40195431 11.8968075,6.80594154 C10.4882396,6.20992876 8.86697454,6.53961108 7.78908669,7.64124168 C6.71119884,8.74287228 6.38898794,10.3994751 6.97271652,11.838496 C7.55644509,13.277517 8.93114253,14.2155279 10.4557209,14.215089 C12.5369543,14.2150891 14.2242918,12.4915562 14.2248782,10.3650787 L14.2238162,10.3639935 Z',
        fillColor: categoryProperty[markers[selectedIndex].categoryNoSpace].color,
        fillOpacity: 1,
        scale: 1.5,
        strokeColor: '#ffffff',
        strokeWeight: 1,
        size: new google.maps.Size(25, 25),
        anchor: new google.maps.Point(6, 25)
      };
      markers[selectedIndex].setIcon(activeMarker);
    },
    selectFilter: function selectFilter() {
      this.filterBy();
      this.closeDialog();
    },
    // filter markers by either category or decade
    filterBy: function filterBy() {
      var i,
          marker,
          selectedCategoryVal = document.getElementById('categories').getAttribute('data-value'),
          selectedDecadeVal = document.getElementById('decades').getAttribute('data-value');

      for (i = 0; i < entries.length; i++) {
        marker = markers[i]; // accounts for the four filter combinations

        if (selectedCategoryVal === marker.category && selectedDecadeVal === marker.decade || selectedCategoryVal === 'all' && selectedDecadeVal === 'all' || selectedCategoryVal === 'all' && marker.decade === selectedDecadeVal || selectedCategoryVal === marker.category && selectedDecadeVal === 'all') {
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      } // GA tracking for when filters are selected


      $gtm.reportCustomEvent({
        category: 'interactive',
        label: 'love map',
        action: 'filter'
      });
    },
    closeDialog: function closeDialog() {
      this.event.classList.add('hidden');
      this.removeMobileOverlay();
      this.resetMarkerStyle();
      selectedIndex = -1;
    },
    mobileResize: function mobileResize() {
      if (!this.event.classList.contains('hidden')) {
        // give the scroll back to the window
        if (window.innerWidth > 601) {
          thisHTML.style.position = '';
          thisHTML.style.overflow = '';
          thisHTML.style.width = '';
        } else {
          thisHTML.style.position = 'fixed';
          thisHTML.style.overflow = 'hidden';
          thisHTML.style.width = '100%';
        }
      }
    },
    defaultEvent: function defaultEvent() {
      // add svg icon for default story
      dom.find(this.el, '.event-divider').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 40"><path fill="#15d418" d="M28.76,34.12a1.25,1.25,0,0,1-1.19-1.64A9.81,9.81,0,0,0,25,23.28a9.9,9.9,0,0,0-2.63,9,1.25,1.25,0,0,1,.14.57,1.23,1.23,0,0,1-1.26,1.25,1.17,1.17,0,0,1-.32,0A11.67,11.67,0,0,1,12,24.41c-.9-5.13.56-10.14,3.73-12.76a1.25,1.25,0,0,1,2,.94,6.59,6.59,0,0,0,.74,2.82C21,12.49,21.64,9.24,20.9,4.58A1.25,1.25,0,0,1,22.3,3.15c2.06.29,6.44,3.94,7.35,10a5.78,5.78,0,0,0,.93-2.9,1.25,1.25,0,0,1,2-1c4.81,3.58,6.37,10.62,5.39,15.43A11.52,11.52,0,0,1,29,34.09,1.25,1.25,0,0,1,28.76,34.12ZM25,20.46a1.24,1.24,0,0,1,.68.2c3.26,2.09,4.89,6.66,4.67,10.36a9.12,9.12,0,0,0,5.17-6.83,14.44,14.44,0,0,0-2.9-11.48A7.86,7.86,0,0,1,29.18,17a1.25,1.25,0,0,1-1.86-1.13,11.73,11.73,0,0,0-3.67-9.11,14.14,14.14,0,0,1-4.31,11.5,1.25,1.25,0,0,1-1.7.06,7,7,0,0,1-1.83-2.92A12.72,12.72,0,0,0,14.48,24a9.21,9.21,0,0,0,5.18,7c-.2-3.68,1.44-8.22,4.67-10.3A1.25,1.25,0,0,1,25,20.46Z"/></svg>';

      if (window.innerWidth < 601) {
        this.closeDialog();
      } else {
        this.event.classList.remove('hidden');
        this.initialMarker();
      }
    },
    setMobileOverlay: function setMobileOverlay() {
      if (window.innerWidth < 601) {
        thisHTML.style.position = 'fixed';
        thisHTML.style.overflow = 'hidden';
        thisHTML.style.width = '100%';
        thisHTML.style.top = -offsetY + 'px';
        thisHTML.style.left = -offsetX + 'px';
        window.scrollX = 0;
        window.scrollY = 0;
        localStorage.setItem('offsetY', offsetY);
        localStorage.setItem('offsetX', offsetX);
      }
    },
    removeMobileOverlay: function removeMobileOverlay() {
      var prevScrollLeft = localStorage.getItem('offsetX', offsetX),
          prevScrollTop = localStorage.getItem('offsetY', offsetY);

      if (window.innerWidth < 601) {
        thisHTML.style.position = '';
        thisHTML.style.overflow = '';
        thisHTML.style.width = '';
        thisHTML.style.top = '';
        thisHTML.style.left = '';
        window.scrollTo(prevScrollLeft, prevScrollTop);
      }
    },
    getScrollPos: function getScrollPos() {
      offsetY = window.pageYOffset;
      offsetX = window.pageXOffset;
    },
    resizingEvents: function resizingEvents() {
      var resizeMobileOverlay = _debounce(this.mobileResize, 200),
          throttleScrollPos = _throttle(this.getScrollPos, 200);

      window.addEventListener('resize', resizeMobileOverlay.bind(this));
      window.addEventListener('scroll', throttleScrollPos.bind(this));
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"41":41,"107":107}];
