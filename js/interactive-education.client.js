window.modules["interactive-education.client"] = [function(require,module,exports){/* global d3:false */
'use strict';

var data = require(132);

DS.controller('interactive-education', [function () {
  var states = data.states,
      eduData = data.eduData,
      margin = {
    top: 10,
    right: -55,
    bottom: 10,
    left: -55
  },
      preWidth = parseInt(d3.select('.edu-map-container').style('width')),
      width = preWidth - margin.left - margin.right,
      mapRatio = 0.5,
      height = width * mapRatio,
      projection = d3.geoAlbersUsa().scale(width).translate([width / 2, height / 2]),
      path = d3.geoPath().projection(projection),
      color = d3.scaleLinear().domain([0, 20, 30, 40, 60]).range(['#eff3ff', '#9ecae1', '#3182bd', '#08519c']),
      svg = d3.select('.edu-map').append('svg').attr('width', width).attr('height', height),
      tooltip = d3.select('.edu-tooltip-container').append('div').attr('class', 'tooltip');

  function changeState(thisState) {
    var previous, stateName, eduPercent, diff, country, countryPercent, same, i;
    previous = d3.selectAll('.interactive-education .selected');

    for (i = 0; i < eduData.length; i++) {
      stateName = eduData[i].state;

      if (thisState.id.split('-').join(' ') === stateName) {
        eduPercent = eduData[i].percent;
        diff = eduData[i].diff;
        country = eduData[i].country;
        countryPercent = eduData[i].countryPercent;

        if (diff === -1) {
          diff = Math.abs(diff) + ' percentage point lower</span> than';
        } else if (diff < 0 && diff != -1) {
          diff = Math.abs(diff) + ' percentage points lower</span> than';
        } else if (diff === 0) {
          diff = ' equal to</span>';
        } else if (diff === 1) {
          diff = Math.abs(diff) + ' percentage point higher</span> than';
        } else {
          diff = Math.abs(diff) + ' percentage points higher</span> than';
        }

        if (eduPercent === countryPercent) {
          same = 'the same';
        } else {
          same = 'about the same';
        }
      }
    }

    previous.classed('selected', false);
    thisState.parentNode.appendChild(thisState);
    thisState.classList.add('selected');
    tooltip.html('<p>Rate of adults over 25 who earned at least a Bachelor\'s degree in <span>' + thisState.id.split('-').join(' ') + '</span> in 2014 was <span>' + eduPercent + ' percent</span>. This is <span>' + diff + ' the overall U.S. rate, and ' + same + ' as <span>' + country + ' (' + countryPercent + ')</span> in 2014.</p>');
  }

  function initializeLowest() {
    var westVir = d3.select('.interactive-education path#West-Virginia')['_groups'][0][0];
    westVir.parentNode.appendChild(westVir);
    westVir.classList.add('selected');
    tooltip.html('Rate of adults over 25 who earned at least a Bachelor\'s degree in <span>West Virginia</span> in 2014 was <span>19.2</span>. This is <span>10.9 percentage points lower</span> than the overall U.S. rate, and about the same as <span>Hungary (19.1)</span> in 2014.</p>');
  }

  function drawLegend() {
    var legend = d3.select('.edu-legend').append('ul'),
        keys = legend.selectAll('li.key').data(color.range()),
        colorRange = color.range();
    keys.enter().append('li').attr('class', 'key').style('background-color', function (d) {
      return d;
    }).text(function (d) {
      var r = color.domain()[colorRange.indexOf(d)];
      return r;
    });
  }

  function drawMap() {
    var percentByState = {};
    eduData.forEach(function (d) {
      percentByState[d.state] = +Math.trunc(d.percent);
    });
    svg.append('g').selectAll('path').data(states.features).enter().append('path').attr('d', path).attr('class', 'state').attr('id', function (d) {
      return d.properties.name.split(' ').join('-');
    }).style('fill', function (d) {
      return color(percentByState[d.properties.name]);
    }); // Initializing to the lowest state

    initializeLowest(); // Drawing color key for map

    drawLegend(); // Click handler

    svg.selectAll('.state').on('click', function () {
      changeState(this);
    });
  }

  function resize() {
    width = parseInt(d3.select('.edu-map').style('width')) + 75;
    height = width * mapRatio;
    projection.translate([width / 2, height / 2]).scale(width);
    svg.style('width', width + 'px').style('height', height + 'px');
    svg.selectAll('.state').attr('d', path);
  } // Resizing map on window resize


  d3.select(window).on('resize.education', resize);
  return drawMap;
}]);
}, {"132":132}];
