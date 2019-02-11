window.modules["interactive-income-inequality.client"] = [function(require,module,exports){/* global d3:false */
'use strict';

var data = require(134);

DS.controller('interactive-income-inequality', [function () {
  var states = data.states,
      incomeData = data.incomeData,
      margin = {
    top: 10,
    right: -55,
    bottom: 10,
    left: -55
  },
      preWidth = parseInt(d3.select('.income-map-container').style('width')),
      width = preWidth - margin.left - margin.right,
      mapRatio = 0.5,
      height = width * mapRatio,
      projection = d3.geoAlbersUsa().scale(width).translate([width / 2, height / 2]),
      path = d3.geoPath().projection(projection),
      color = d3.scaleLinear().domain([0.42, 0.44, 0.46, 0.48, 0.5, 0.54]).range(['#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c']),
      svg = d3.select('.income-map').append('svg').attr('width', width).attr('height', height),
      tooltip = d3.select('.income-tooltip-container').append('div').attr('class', 'tooltip');

  function changeState(thisState) {
    var previous, stateName, gini, i;
    previous = d3.selectAll('.interactive-income-inequality .selected');

    for (i = 0; i < incomeData.length; i++) {
      stateName = incomeData[i].state;

      if (thisState.id.split('-').join(' ') === stateName) {
        gini = incomeData[i].gini;
      }
    }

    previous.classed('selected', false);
    thisState.parentNode.appendChild(thisState);
    thisState.classList.add('selected');
    tooltip.html('<p>The Gini coefficient for <span>' + thisState.id.split('-').join(' ') + '</span> in 2015 was <span>' + gini + '</span>.</p>');
  }

  function initializeNewYork() {
    var newYork = d3.select('.interactive-income-inequality path#New-York')['_groups'][0][0];
    newYork.parentNode.appendChild(newYork);
    newYork.classList.add('selected');
    tooltip.html('<p>The Gini coefficient for <span>New York</span> in 2015 was <span>0.514</span>.</p>');
  }

  function drawLegend() {
    var legend = d3.select('.income-legend').append('ul'),
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
    var incomeByState = {};
    incomeData.forEach(function (d) {
      incomeByState[d.state] = +d.gini;
    });
    svg.append('g').selectAll('path').data(states.features).enter().append('path').attr('d', path).attr('class', 'state').attr('id', function (d) {
      return d.properties.name.split(' ').join('-');
    }).style('fill', function (d) {
      return color(incomeByState[d.properties.name]);
    }); // Initializing to New York

    initializeNewYork(); // Drawing color key for map

    drawLegend(); // Click handler

    svg.selectAll('.state').on('click', function () {
      changeState(this);
    });
  }

  function resize() {
    width = parseInt(d3.select('.income-map').style('width')) + 75;
    height = width * mapRatio;
    projection.translate([width / 2, height / 2]).scale(width);
    svg.style('width', width + 'px').style('height', height + 'px');
    svg.selectAll('.state').attr('d', path);
  }

  d3.select(window).on('resize.income', resize);
  return drawMap;
}]);
}, {"134":134}];
