window.modules["bar-line-chart.client"] = [function(require,module,exports){/* global d3:false */
'use strict';

var dom = require(1),
    _map = require(37),
    _values = require(60),
    _minBy = require(62),
    _maxBy = require(61);

DS.controller('bar-line-chart', [function () {
  var bottomLeftPadding = 50,
      // makes room for x/y axis labels
  topRightPadding = 10,
      // gives a smaller padding to sides without labels
  barPadding = 8,
      Events = window.Eventify;

  function Constructor(el) {
    this.el = el;
    this.data = this.getDataComponents();
    this.entriesData = d3.entries(this.data);
    this.dataValues = this.extractData();
    this.svg = d3.select(dom.find(el, '.chart'));
    this.chart = el.querySelector('.chart');
    this.width = this.chart.getBoundingClientRect().width;
    this.height = this.chart.getBoundingClientRect().height;
    this.path; // hack to make chart responsive for abortion interactive on The Cut
    // also, there a quick fix change to line 152

    this.height = Math.ceil(0.522 * this.width); // intended aspect ratio is 670 x 350 (?)

    this.chart.style.height = this.height;
    bottomLeftPadding = 25 + bottomLeftPadding * this.width / 670;
    topRightPadding = 10 + topRightPadding * this.width / 670;
    barPadding *= this.width / 670;

    if (this.entriesData) {
      this.getEditableData();
    }

    Events.on('update-chart', this.eventUpdateChart.bind(this));
  }

  Constructor.prototype = {
    eventUpdateChart: function eventUpdateChart(data, windowProp) {
      // Set stuff to null
      this.svg = null;
      this.path = null; // Get rid of everything in the chart

      dom.clearChildren(dom.find(this.el, '.chart')); // Re-assign the chart for D3

      this.svg = d3.select(dom.find(this.el, '.chart'));

      if (data) {
        if (!data.data) {
          throw new Error('Your data for the update-chart event must contain a property called `data`');
        }

        this.data = data.data;
      } else if (windowProp) {
        // TODO: CHANGE THIS
        this.data = window[windowProp].data;

        if (!this.data) {
          throw new Error('That windowProp did not contain data');
        }
      } else {
        throw new Error('Your update-chart event contained no data or windowProp');
      }

      this.entriesData = d3.entries(this.data);
      this.dataValues = this.extractData();
      this.appendScales(this.xScale, this.yScale);
    },

    /*
     * Grab data from the window in whatever form
     * the server.js file is creating
     */
    getDataComponents: function getDataComponents() {
      /**
       * TODO: this will have to change once multiple datasets are being used,
       * this only handles one piece of data right now
       */
      var chartDataComponents = dom.findAll(this.el, '.chart-data');
      return _map(chartDataComponents, function (dataComponent) {
        var dataUri = dataComponent.getAttribute('data-uri'),
            windowDataUri = window[dataUri];
        return windowDataUri.data;
      })[0];
    },

    /*
     * Loop over complete dataset and find only data values
     */
    extractData: function extractData() {
      var valuesArray = _values(this.data);

      return _map(valuesArray, function (d) {
        return parseInt(d, 10);
      });
    },

    /*
     * Gets user editable data
     */
    getEditableData: function getEditableData() {
      var xScale = this.xScale,
          yScale = this.yScale;
      this.xAxisTitle = this.el.getAttribute('data-xtitle');
      this.yAxisTitle = this.el.getAttribute('data-ytitle');
      this.type = this.el.getAttribute('data-type');
      this.valuesDisplayed = this.el.getAttribute('data-display');
      this.xScaleType = this.el.getAttribute('data-xscaletype');
      this.showXTicks = this.el.getAttribute('data-showxticks') === 'true';
      this.appendScales(xScale, yScale);
    },

    /*
      TODO: line chart will have a different function to append its scales since
      it'll have a different xScale.
     */
    appendScales: function appendScales(xScale, yScale) {
      /**
       * maxVal is multiplied by 1.2 to add space between the highest value and the
       * top of the chart. 1.2 is just a temporary value for now.
       */
      var maxVal = d3.max(this.dataValues),
          maxY = Math.round(1.2 * maxVal),
          startYear,
          endYear,
          timeSpan,
          timePadding;

      if (this.xScaleType === 'time') {
        startYear = parseInt(_minBy(this.entriesData, function (o) {
          return parseInt(o.key, 10);
        }).key, 10);
        endYear = parseInt(_maxBy(this.entriesData, function (o) {
          return parseInt(o.key, 10);
        }).key, 10);
        timeSpan = endYear - startYear;
        timePadding = Math.ceil(timeSpan * 0.01);
        xScale = d3.scaleTime().domain([this.getYear(startYear - timePadding), this.getYear(endYear + timePadding)]);
      } else {
        xScale = d3.scaleBand().domain(this.entriesData.map(function (d) {
          return d.key;
        }));
      }

      xScale.range([bottomLeftPadding, this.width - topRightPadding]);
      yScale = d3.scaleLinear().domain([0, maxY]).range([this.height - bottomLeftPadding, topRightPadding]); // set properties before drawing chart

      this.setBarWidth(xScale);
      this.setXOffset(); // append x axis

      this.svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + (this.height - bottomLeftPadding) + ')').call(d3.axisBottom(xScale).tickSizeInner(this.showXTicks ? 10 : 0).tickSizeOuter(0).tickPadding(6)); // append y axis

      this.svg.append('g').attr('transform', 'translate(' + (parseInt(bottomLeftPadding, 10) + -5) + ', 0)') // interactive-abortion quickfix
      .attr('class', 'y axis').call(d3.axisLeft(yScale).tickSizeInner(-this.width + (bottomLeftPadding - topRightPadding)).tickSizeOuter(0).tickPadding(6)); // add x axis label

      this.svg.append('text').attr('transform', 'translate(' + this.width / 2 + ' ,' + (this.height - 5) + ')').style('text-anchor', 'middle').text(this.xAxisTitle); // add y axis label

      this.svg.append('text').attr('transform', 'rotate(-90)').attr('y', bottomLeftPadding / 20).attr('x', this.height / 2 + 25).attr('dy', '1em').style('text-anchor', 'middle').text(this.yAxisTitle);

      if (this.type === 'bar') {
        this.plotBar(xScale, yScale);
      } else {
        this.plotLine(xScale, yScale);
      }
    },
    plotBar: function plotBar(xScale, yScale) {
      var height = this.height;
      this.svg.selectAll('rect').data(this.entriesData).enter().append('rect').attr('class', 'rect').attr('x', function (d) {
        return this.calcXPosition(d.key, xScale);
      }.bind(this)).attr('y', function (d) {
        return yScale(d.value);
      }).attr('width', this.barWidth).attr('height', function (d) {
        return height - bottomLeftPadding - yScale(d.value);
      }).attr('fill', this.color).text(function (d) {
        return d.value;
      }); // displays values above each bar if user checks off 'Display values' in settings

      if (this.valuesDisplayed) {
        this.displayBarValues(xScale, yScale);
      }
    },
    plotLine: function plotLine(xScale, yScale) {
      var line = d3.line().x(function (d) {
        return this.calcXPosition(d.key, xScale);
      }.bind(this)).y(function (d) {
        return yScale(d.value);
      });
      this.path = this.svg.append('path').datum(this.entriesData).attr('class', 'line').attr('stroke', this.color).attr('d', line);

      if (this.valuesDisplayed) {
        this.displayLineValues(xScale, yScale);
      } // add markers to line chart


      this.svg.selectAll('circle').data(this.entriesData).enter().append('circle').attr('cx', function (d) {
        return this.calcXPosition(d.key, xScale);
      }.bind(this)).attr('cy', function (d) {
        return yScale(d.value);
      }).attr('r', 5).attr('class', 'marker');
    },
    displayBarValues: function displayBarValues(xScale, yScale) {
      this.svg.selectAll('text rect').data(this.entriesData).enter().append('text').attr('text-anchor', 'middle').attr('x', function (d) {
        return this.calcXPosition(d.key, xScale) + this.barWidth / 2;
      }.bind(this)).attr('y', function (d) {
        return yScale(d.value) - 5;
      }.bind(this)).text(function (d) {
        return d.value;
      });
    },

    /*
      TODO: right now, the displayLineValues function is the exactly the same as displayBarValues
      except for the x attribute, but displayLineValues will change after refactoring the way line
      charts are being rendered on the scales
     */
    displayLineValues: function displayLineValues(xScale, yScale) {
      this.svg.selectAll('text rect').data(this.entriesData).enter().append('text').attr('text-anchor', 'middle').attr('x', function (d) {
        return this.calcXPosition(d.key, xScale);
      }.bind(this)).attr('y', function (d) {
        return yScale(d.value) - 7;
      }.bind(this)).text(function (d) {
        return d.value;
      });
    },

    /*
     * calculate data position along x-axis
     * @param {integer} val
     * @param {Object} xScale
     * @returns {integer}
     */
    calcXPosition: function calcXPosition(val, xScale) {
      var xPosition;

      if (this.xScaleType === 'time') {
        xPosition = xScale(this.getYear(val));
      } else {
        // treat xScale as band by default
        xPosition = xScale(val);
      }

      return xPosition + this.xOffset;
    },

    /*
     * calculate offset along x-axis based on chart type
     * @param {Object} xScale
     */
    setXOffset: function setXOffset() {
      var offset;

      if (this.type === 'line') {
        if (this.xScaleType === 'time') {
          offset = 0;
        } else {
          // 'band' xScale type
          offset = 0.5 * this.barWidth + barPadding;
        }
      } else {
        // bar chart
        if (this.xScaleType === 'time') {
          offset = -0.5 * this.barWidth;
        } else {
          // 'band' xScale type
          offset = barPadding;
        }
      }

      this.xOffset = offset;
    },

    /*
     * calculate width of bar based on chart type
     * @param {Object} xScale
     */
    setBarWidth: function setBarWidth(xScale) {
      var chartWidth = this.width - bottomLeftPadding - topRightPadding,
          domain = xScale.domain(),
          length;

      if (this.xScaleType === 'time') {
        length = domain[1].getFullYear() - domain[0].getFullYear();
      } else {
        // 'band' xScale type by default
        length = this.dataValues.length;
      }

      this.barWidth = chartWidth / length - 2 * barPadding;
    },

    /*
     * get date object with year set to input
     * @param {integer} num
     * @returns {Date}
     */
    getYear: function getYear(num) {
      var date = new Date();
      date.setFullYear(num);
      return date;
    }
  };
  return Constructor;
}]);
}, {"1":1,"37":37,"60":60,"61":61,"62":62}];
