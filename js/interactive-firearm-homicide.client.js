window.modules["interactive-firearm-homicide.client"] = [function(require,module,exports){/* global d3:false */
'use strict';

var data = require(133);

DS.controller('interactive-firearm-homicide', [function () {
  var states = data.states,
      firearmData = data.firearmData,
      margin = {
    top: 10,
    right: -55,
    bottom: 10,
    left: -55
  },
      preWidth = parseInt(d3.select('.firearm-map-container').style('width')),
      width = preWidth - margin.left - margin.right,
      mapRatio = 0.5,
      height = width * mapRatio,
      projection = d3.geoAlbersUsa().scale(width).translate([width / 2, height / 2]),
      path = d3.geoPath().projection(projection),
      color = d3.scaleLinear().domain([0, 2, 4, 6, 8, 16]).range(['#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c']),
      svg = d3.select('.firearm-map').append('svg').attr('width', width).attr('height', height),
      tooltip = d3.select('.firearm-tooltip-container').append('div').attr('class', 'tooltip');

  function changeState(thisState) {
    var previous = d3.selectAll('.interactive-firearm-homicide .selected');
    previous.classed('selected', false);
    thisState.parentNode.appendChild(thisState);
    thisState.classList.add('selected');
    updateTooltip(thisState);
  }

  function findDiff(diff) {
    if (diff < 0) {
      diff = Math.abs(diff) + ' deaths fewer</span> than';
    } else if (diff === 0) {
      diff = ' equal to</span>';
    } else if (diff === 1) {
      diff = diff + ' death more</span> than';
    } else {
      diff = diff + ' deaths more</span> than';
    }

    return diff;
  }

  function updateTooltip(thisState) {
    var stateID = thisState.id.split('-').join(' '),
        stateName,
        homicideRate,
        diff,
        country,
        countryRate,
        footnote,
        same,
        i;

    for (i = 0; i < firearmData.length; i++) {
      stateName = firearmData[i].state;

      if (stateID === stateName) {
        homicideRate = firearmData[i].firearmhomicidesper100k;
        diff = firearmData[i].diff;
        country = firearmData[i].country;
        countryRate = firearmData[i].countryper100k;
        footnote = firearmData[i].footnote;
        diff = findDiff(diff);

        if (homicideRate === countryRate) {
          same = 'the same';
        } else {
          same = 'similar to';
        }
      }
    }

    if (stateID === 'Hawaii') {
      tooltip.html('Rate of homicide by firearm per 100,000 for Hawaii is unavailable.');
    } else if (footnote === 'yes') {
      tooltip.html('<p>Rate of homicide by firearm in <span>' + stateID + '*</span> in 2015 was <span>' + homicideRate + '</span> per 100,000. This was <span>' + diff + ' the overall U.S. rate, and ' + same + ' as <span>' + country + ' (' + countryRate + ')</span>.</p>');
    } else {
      tooltip.html('<p>Rate of homicide by firearm in <span>' + stateID + '</span> in 2015 was <span>' + homicideRate + '</span> per 100,000. This was <span>' + diff + ' the overall U.S. rate, and ' + same + ' as <span>' + country + ' (' + countryRate + ')</span>.</p>');
    }
  }

  function initializeNewYork() {
    var newYork = d3.select('.interactive-firearm-homicide path#New-York')['_groups'][0][0];
    newYork.parentNode.appendChild(newYork);
    newYork.classList.add('selected');
    tooltip.html('<p>Rate of homicide by firearm in <span>New York</span> in 2015 was <span>2.06</span> per 100,000. This was <span>1.98 deaths fewer</span> then the overall U.S. rate, and similar to <span>Jordan (1.92)</span>.</p>');
  }

  function drawLegend() {
    var legend = d3.select('.firearm-legend').append('ul'),
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
    var homicideByState = {};
    firearmData.forEach(function (d) {
      homicideByState[d.state] = +d.firearmhomicidesper100k;
    });
    svg.append('g').selectAll('path').data(states.features).enter().append('path').attr('d', path).attr('class', 'state').attr('id', function (d) {
      return d.properties.name.split(' ').join('-');
    }).style('fill', function (d) {
      if (d.properties.name === 'Hawaii') {
        return '#cccccc';
      } else {
        return color(homicideByState[d.properties.name]);
      }
    }); // Initializing to New York

    initializeNewYork(); // Drawing color key for map

    drawLegend(); // Click handler

    svg.selectAll('.state').on('click', function () {
      changeState(this);
    });
  }

  function resize() {
    width = parseInt(d3.select('.firearm-map').style('width')) + 75;
    height = width * mapRatio;
    projection.translate([width / 2, height / 2]).scale(width);
    svg.style('width', width + 'px').style('height', height + 'px');
    svg.selectAll('.state').attr('d', path);
  }

  d3.select(window).on('resize.homicide', resize);
  return drawMap;
}]);
}, {"133":133}];
