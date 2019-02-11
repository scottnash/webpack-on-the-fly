window.modules["interactive-life-expectancy.client"] = [function(require,module,exports){/* global d3:false */
'use strict';

var data = require(135);

DS.controller('interactive-life-expectancy', [function () {
  var states = data.states,
      lifeExpData = data.lifeExpData,
      margin = {
    top: 10,
    right: -55,
    bottom: 10,
    left: -55
  },
      preWidth = parseInt(d3.select('.map-container').style('width')),
      width = preWidth - margin.left - margin.right,
      mapRatio = 0.5,
      height = width * mapRatio,
      projection = d3.geoAlbersUsa().scale(width).translate([width / 2, height / 2]),
      path = d3.geoPath().projection(projection),
      color = d3.scaleLinear().domain([75, 77, 79, 81, 83]).range(['#bdd7e7', '#6baed6', '#3182bd', '#08519c']),
      svg = d3.select('.map').append('svg').attr('width', width).attr('height', height),
      tooltip = d3.select('.tooltip-container').append('div').attr('class', 'tooltip');

  function changeState(thisState) {
    var previous, stateName, lifeExp, diff, country, countryLE, same, i;
    previous = d3.selectAll('.interactive-life-expectancy .selected');

    for (i = 0; i < lifeExpData.length; i++) {
      stateName = lifeExpData[i].state;

      if (thisState.id.split('-').join(' ') === stateName) {
        lifeExp = lifeExpData[i].lifeexp;
        diff = lifeExpData[i].diff;
        country = lifeExpData[i].country;
        countryLE = lifeExpData[i].countrylifeexp;

        if (diff === -1) {
          diff = Math.abs(diff) + ' year lower</span> than';
        } else if (diff < 0 && diff != -1) {
          diff = Math.abs(diff) + ' years lower</span> than';
        } else if (diff === 0) {
          diff = ' equal to</span>';
        } else if (diff === 1) {
          diff = Math.abs(diff) + ' year higher</span> than';
        } else {
          diff = Math.abs(diff) + ' years higher</span> than';
        }

        if (lifeExp === countryLE) {
          same = 'the same';
        } else {
          same = 'about the same';
        }
      }
    }

    previous.classed('selected', false);
    thisState.parentNode.appendChild(thisState);
    thisState.classList.add('selected');
    tooltip.html('<p>Life expectancy in <span>' + thisState.id.split('-').join(' ') + '</span> in 2014 was <span>' + lifeExp + ' years</span>. This is <span>' + diff + ' the overall U.S. life expectancy, and ' + same + ' as <span>' + country + ' (' + countryLE + ')</span> in 2015.</p>');
  }

  function initializeLowest() {
    var mississippi = d3.select('.interactive-life-expectancy path#Mississippi')['_groups'][0][0];
    mississippi.parentNode.appendChild(mississippi);
    mississippi.classList.add('selected');
    tooltip.html('<p>Life expectancy in <span>Mississippi</span> in 2014 was <span>75.1 years</span>. This is <span>4.2 years lower</span> than the overall U.S. life expectancy, and about the same as <span>Brazil (75)</span> in 2015.</p>');
  }

  function drawLegend() {
    var legend = d3.select('.legend').append('ul'),
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
    var expByState = {};
    lifeExpData.forEach(function (d) {
      expByState[d.state] = +Math.trunc(d.lifeexp);
    });
    svg.append('g').selectAll('path').data(states.features).enter().append('path').attr('d', path).attr('class', 'state').attr('id', function (d) {
      return d.properties.name.split(' ').join('-');
    }).style('fill', function (d) {
      return color(expByState[d.properties.name]);
    }); // Initializing to the lowest state

    initializeLowest(); // Drawing color key for map

    drawLegend(); // Click handler

    svg.selectAll('.state').on('click', function () {
      changeState(this);
    });
  }

  function resize() {
    width = parseInt(d3.select('.map').style('width')) + 75;
    height = width * mapRatio;
    projection.translate([width / 2, height / 2]).scale(width);
    svg.style('width', width + 'px').style('height', height + 'px');
    svg.selectAll('.state').attr('d', path);
  } // Resizing map on window resize


  d3.select(window).on('resize.lifeexp', resize);
  return drawMap;
}]);
}, {"135":135}];
