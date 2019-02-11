window.modules["interactive-disconnected-youth.client"] = [function(require,module,exports){/* global d3:false */
'use strict';

var data = require(131);

DS.controller('interactive-disconnected-youth', [function () {
  var states = data.states,
      youthData = data.youthData,
      margin = {
    top: 10,
    right: -55,
    bottom: 10,
    left: -55
  },
      preWidth = parseInt(d3.select('.youth-map-container').style('width')),
      width = preWidth - margin.left - margin.right,
      mapRatio = 0.5,
      height = width * mapRatio,
      projection = d3.geoAlbersUsa().scale(width).translate([width / 2, height / 2]),
      path = d3.geoPath().projection(projection),
      color = d3.scaleLinear().domain([6, 9, 12, 15, 18]).range(['#bdd7e7', '#6baed6', '#3182bd', '#08519c']),
      svg = d3.select('.youth-map').append('svg').attr('width', width).attr('height', height),
      tooltip = d3.select('.youth-tooltip-container').append('div').attr('class', 'tooltip');

  function changeState(thisState) {
    var previous, stateName, youthPercent, diff, country, countryPercent, same, i;
    previous = d3.selectAll('.interactive-disconnected-youth .selected');

    for (i = 0; i < youthData.length; i++) {
      stateName = youthData[i].state;

      if (thisState.id.split('-').join(' ') === stateName) {
        youthPercent = youthData[i].percentyouth;
        diff = youthData[i].diff;
        country = youthData[i].country;
        countryPercent = youthData[i].countrypercent;

        if (diff < 0) {
          diff = Math.abs(diff) + ' percentage points lower</span> than';
        } else if (diff === 0) {
          diff = ' equal to</span>';
        } else if (diff === 1) {
          diff = diff + ' percentage points higher</span> than';
        } else {
          diff = diff + ' percentage points higher</span> than';
        }

        if (youthPercent === countryPercent) {
          same = 'the same';
        } else {
          same = 'about the same';
        }
      }
    }

    previous.classed('selected', false);
    thisState.parentNode.appendChild(thisState);
    thisState.classList.add('selected');
    tooltip.html('<p>Rate of disconnected youth in <span>' + thisState.id.split('-').join(' ') + '</span> in 2015 was <span>' + youthPercent + ' percent</span>. This was <span>' + diff + ' the overall U.S. rate, and ' + same + ' as <span>' + country + ' (' + countryPercent + ')</span>.</p>');
  }

  function initializeNewYork() {
    var newYork = d3.select('.interactive-disconnected-youth path#New-York')['_groups'][0][0];
    newYork.parentNode.appendChild(newYork);
    newYork.classList.add('selected');
    tooltip.html('<p>Rate of disconnected youth in <span>New York</span> in 2015 was <span>11.9 percent</span>. This was <span>0.4 percentage points higher</span> than the overall U.S. rate, and about the same as <span>France (12)</span>.</p>');
  }

  function drawLegend() {
    var legend = d3.select('.youth-legend').append('ul'),
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
    var youthByState = {};
    youthData.forEach(function (d) {
      youthByState[d.state] = +d.percentyouth;
    });
    svg.append('g').selectAll('path').data(states.features).enter().append('path').attr('d', path).attr('class', 'state').attr('id', function (d) {
      return d.properties.name.split(' ').join('-');
    }).style('fill', function (d) {
      return color(youthByState[d.properties.name]);
    }); // Initializing to New York

    initializeNewYork(); // Drawing color key for map

    drawLegend(); // Click handler

    svg.selectAll('.state').on('click', function () {
      changeState(this);
    });
  }

  function resize() {
    width = parseInt(d3.select('.youth-map').style('width')) + 75;
    height = width * mapRatio;
    projection.translate([width / 2, height / 2]).scale(width);
    svg.style('width', width + 'px').style('height', height + 'px');
    svg.selectAll('.state').attr('d', path);
  }

  d3.select(window).on('resize.youth', resize);
  return drawMap;
}]);
}, {"131":131}];
