window.modules["magazine-issue-header.model"] = [function(require,module,exports){'use strict';

var formatTime = require(154),
    sanitize = require(39),
    socialDescription = {
  toc: 'The complete table of contents for the {date} issues of New York Magazine.',
  issueArchive: 'All {date} issues of New York Magazine.'
},
    pageTitle = {
  toc: 'New York Magazine: {date} Issue',
  issueArchive: 'New York Magazine: {date} Issues'
};
/**
 * Is ToC section page
 *
 * @param {Object} data - component data
 * @returns {boolean} true if ToC section | false if not
 */


function isToC() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return data.section === 'toc';
}
/**
 * Is Issue Archive
 *
 * @param {Object} data - component data
 * @returns {boolean} true if Issue Archive section | false if not
 */


function isIssueArchive() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return data.section === 'issueArchive';
}
/**
 * Format date from numerical representation of 'MM-DD-YYYY'
 * to alphanumerical representation
 *
 * @param {Object} data - component data
 */


function setFormatDate() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (data.magazineIssueDateFrom) {
    data.formattedDate = formatTime.formatDateRange(data.magazineIssueDateFrom, data.magazineIssueDateTo) || '';
  }
}
/**
 * Set Page title
 *
 * @param {Object} data - component data
 */


function setPageTitle() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _pageTitle = pageTitle[data.section] ? pageTitle[data.section] : '',
      issueArchiveTitle = _pageTitle.replace('{date}', formatTime.formatDateRange(data.magazineIssueDateFrom, '', 'YYYY'));

  if (isToC(data)) {
    if (data.overrideTitle) {
      data.pageTitle = _pageTitle.replace('{date}', data.overrideTitle);
    } else if (data.formattedDate) {
      data.pageTitle = _pageTitle.replace('{date}', data.formattedDate);
    }
  }

  if (isIssueArchive(data) && issueArchiveTitle) {
    data.pageTitle = issueArchiveTitle;
  }
}
/**
 * Set Page social description
 *
 * @param {Object} data - component data
 */


function setSocialDescription() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _pageSocialDescription = socialDescription[data.section] ? socialDescription[data.section] : '',
      sectionDate = data.section === 'toc' ? data.formattedDate : formatTime.formatDateRange(data.magazineIssueDateFrom, '', 'YYYY');

  if (_pageSocialDescription && sectionDate) {
    data.socialDescription = _pageSocialDescription.replace('{date}', sectionDate);
  }
}
/**
 * Set Page Keywords
 *
 * @param {Object} data - component data
 */


function setPageKeywords() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var keywords = {
    toc: ['table of contents', 'toc', 'new york magazine'],
    issueArchive: ['issue archive', 'new york magazine']
  },
      _keywords = keywords[data.section] || [],
      sectionTag = isToC(data) ? data.formattedDate : formatTime.formatDateRange(data.magazineIssueDateFrom, '', 'YYYY');

  if (_keywords.length && sectionTag && !_keywords.includes(sectionTag)) {
    _keywords.push(sectionTag);

    data.keywords = _keywords;
  }
}
/**
 * Set Issue Archive Page image
 *
 * @param {Object} data - component data
 */


function setPageImage() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (isIssueArchive(data)) {
    data.feedImgUrl = 'http://pixel.nymag.com/imgs/daily/nymag/2017/09/Careers-Mobile-BG.jpg';
  }
}
/**
 * Generates the slug from the fromDate or OverrideTitle
 * @param {object} data
 */


function generateSlug() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var slugProperty = data.overrideTitle ? 'overrideTitle' : 'magazineIssueDateFrom';
  data.slug = sanitize.cleanSlug(data[slugProperty]);
}
/**
 * Generates the primary headline from the overrideTitle
 * if the primary headline is empty and the overrideHeadline is less than 80 characters
 * @param {object} data
 */


function generatePrimaryHeadline() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  data.primaryHeadline = data.overrideTitle || data.formattedDate;
}
/**
 * This function handles the special ToC property based on the overrideTitle.
 * It is used for elastic filtering purposes.
 * @param {object} data
 */


function setSpecialToc() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  data.specialToc = !!data.overrideTitle;
}
/**
 * Set Publication date for ToC and Issue archive pages
 * @param {Object} data - component data
 */


function setPublishingDate(data) {
  if (data.magazineIssueDateFrom) {
    data.date = new Date(data.magazineIssueDateFrom).toISOString();
  }
}
/**
 * Save component data
 *
 * @param {string} uri - component uri
 * @param {Object} data - component data
 * @param {Object} locals - request page data
 * @returns {Object} Mutated component data
 */


module.exports.save = function (uri, data) {
  setFormatDate(data);
  generatePrimaryHeadline(data);
  setSpecialToc(data);
  setPageTitle(data);
  generateSlug(data);
  setSocialDescription(data);
  setPageKeywords(data);
  setPageImage(data);
  setPublishingDate(data);
  return data;
};
}, {"39":39,"154":154}];
