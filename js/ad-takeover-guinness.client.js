window.modules["ad-takeover-guinness.client"] = [function(require,module,exports){'use strict';

var _forEach = require(27),
    cookie = require(28),
    $visibility = require(26);

DS.controller('ad-takeover-guinness', ['$document', function ($document) {
  function Constructor() {
    var topStories = document.querySelector('.top-stories'),
        newsfeed = document.querySelector('.newsfeed'),
        takeoverAssets = [{
      articleUrl: 'https://ad.doubleclick.net/ddm/clk/314581655;140955358;n',
      articleHeadline: 'Watch Veggies Shatter Like Shards of Glass',
      imgUrl: 'https://pixel.nymag.com/imgs/daily/other/2016/11/22/fruit_1025x578.w215.h143.2x.jpg'
    }, {
      articleUrl: 'https://ad.doubleclick.net/ddm/clk/314581543;140955080;b',
      articleHeadline: 'Alert: You Can Turn Your Own Breath Into a Liquid and Drink It',
      imgUrl: 'https://pixel.nymag.com/imgs/daily/other/2016/11/22/Breath_1025x578.w215.h143.2x.jpg'
    }, {
      articleUrl: 'https://ad.doubleclick.net/ddm/clk/314581272;140955625;f',
      articleHeadline: 'If You Know Just One Party Trick, Make It This One',
      imgUrl: 'https://pixel.nymag.com/imgs/daily/other/2016/11/22/beercan_1025x578.w215.h143.2x.jpg'
    }, {
      articleUrl: 'https://ad.doubleclick.net/ddm/clk/315476712;140956705;i',
      articleHeadline: 'How to Make Homemade Guinness Stout Ice Cream in a Matter of Seconds',
      imgUrl: 'https://pixel.nymag.com/imgs/daily/other/2016/11/22/icecream1025x578.w610.h410.2x.jpg'
    }, {
      articleUrl: 'https://ad.doubleclick.net/ddm/clk/313102073;140955079;v',
      articleHeadline: 'If You Do Anything at All Today, Watch Ken Jennings Play With Balloon Animals and Liquid Nitrogen',
      imgUrl: 'https://pixel.nymag.com/imgs/daily/other/2016/11/22/Balloon_animal_1025x578.w190.h190.2x.jpg'
    }, {
      articleUrl: 'https://ad.doubleclick.net/ddm/clk/313102073;140955626;t',
      articleHeadline: 'Ken Jennings Playing With Liquid Nitrogen Could Be Our New Obsession',
      imgUrl: 'https://pixel.nymag.com/imgs/daily/other/2016/11/22/pingpong_1025x578.w190.h190.2x.jpg'
    }],
        cookieName = 'guinness-takeover-12-20-2016',
        visited = cookie.get(cookieName) === 'visited',
        isDesktop = window.innerWidth > 1024; // apply light grey background to the modified content on takeover

    function addBackgroundToLayout() {
      var takeoverBackground = document.createElement('div');
      takeoverBackground.classList.add('guinness-takeover-background');
      $document.body.appendChild(takeoverBackground);
    } // apply styling specific to takeover


    function addStyling() {
      $document.body.classList.add('first-visit');
    } // update top story component


    function replaceTopStory(el, data) {
      var h2 = el.querySelector('h2'),
          topStoryLink = el.querySelector('.top-story-link');
      h2.innerHTML = data.articleHeadline;
      topStoryLink.style.backgroundImage = 'url(' + data.imgUrl + ')';
      topStoryLink.href = data.articleUrl;
      topStoryLink.setAttribute('target', '_blank');
    } // update first newsfeed article according to takeover
    // TODO: headlineLink has been refactored out newsfeed/template.handlebars
    // Any future deployment/re-use of this component will need to update dependeny on .headline-link


    function replaceNewsfeedArticle(el, data) {
      var imageLink = el.querySelector('.image-link'),
          headline = el.querySelector('.headline'),
          headlineLink = el.querySelector('.headline-link'),
          readMore = el.querySelector('.read-more'),
          byAuthors = el.querySelector('.by-authors'),
          time = el.querySelector('time'),
          rubric = el.querySelector('.rubric'),
          playImage = document.createElement('img'),
          teaser = el.querySelector('.teaser');
      el.classList.remove('img-small');
      el.classList.add('img-large');
      imageLink.style.backgroundImage = 'url(' + data.imgUrl + ')';
      imageLink.href = data.articleUrl;
      imageLink.setAttribute('target', '_blank');
      headline.innerHTML = data.articleHeadline;
      headlineLink.href = data.articleUrl;
      headlineLink.setAttribute('target', '_blank');
      readMore.href = data.articleUrl;
      readMore.setAttribute('target', '_blank');
      readMore.innerHTML = 'Watch Video';
      playImage.src = 'https://pixel.nymag.com/imgs/daily/other/2016/11/guinness/play.png';
      imageLink.appendChild(playImage);
      teaser.innerHTML = "We teamed up with game show contestant extraordinaire Ken Jennings and Guinness to experiment with liquid nitrogen. Why? Well, because science is awesome, and GUINNESS STOUT just so happens to be brewed with nitrogen gas.<br/><br/>In this episode, watch Ken make ice cream with GUINNESS STOUT and liquid nitrogen, because if anything's better than ice cream, it’s ice cream in the name of science.";
      byAuthors.style.display = 'none';
      time.style.display = 'none';

      if (rubric) {
        rubric.style.display = 'none';
      }
    } // modify top stories according to takeover


    function modifyTopStories() {
      var topStoryAll = topStories.querySelectorAll('.top-story');

      _forEach(topStoryAll, function (topStory, i) {
        replaceTopStory(topStory, takeoverAssets[i]);
      });
    } // update newfeed content according to takeover


    function modifyNewsfeed() {
      var newsfeedArticle = newsfeed.querySelector('.newsfeed-article');
      replaceNewsfeedArticle(newsfeedArticle, takeoverAssets[3]);
    } // remove add from top leaderboard and apply custom CTA


    function modifyTopLeaderboard(options) {
      var imgUrl = options.imgUrl,
          showTakeover = options.showTakeover,
          adSplash = document.querySelector('.ad-splash'),
          topLeaderboard = document.createElement('button'),
          topLeaderboardImage = document.createElement('img');
      topLeaderboardImage.src = imgUrl;
      topLeaderboardImage.alt = 'Guinness Top Leaderboard Ad';
      topLeaderboard.appendChild(topLeaderboardImage);
      topLeaderboard.classList.add('guinness-takeover-leaderboard');
      topLeaderboard.addEventListener('click', function () {
        if (showTakeover && cookie.get(cookieName)) {
          cookie.remove(cookieName);
        }

        window.location.href = window.location.href;
      });
      adSplash.appendChild(topLeaderboard);
    } // update the page header according to takeover


    function modifyPageHeader() {
      var disclaimerCTA = document.createElement('a'),
          disclaimerCTAImage = document.createElement('img'),
          simpleHeader = document.querySelector('.simple-header');
      disclaimerCTA.href = '//guinness.com';
      disclaimerCTAImage.src = 'https://pixel.nymag.com/imgs/daily/other/2016/11/guinness/takeover.png';
      disclaimerCTA.setAttribute('target', '_blank');
      disclaimerCTA.classList.add('guinness-takeover-cta');
      disclaimerCTA.appendChild(disclaimerCTAImage);
      simpleHeader.appendChild(disclaimerCTA);
    } // modify takeover background height to fit the takeover content


    function updateBackgroundHeight() {
      var background = document.querySelector('.guinness-takeover-background'),
          newsfeedFirstArticle = document.querySelector('.newsfeed-first-article'),
          backgroundHeight = $visibility.getPageOffset(newsfeedFirstArticle).top + 847;
      background.style.height = backgroundHeight + 'px';
    } // automatically refresh homepage after n seconds
    // user should not see the takeover on refreshed page


    function setAutoRefresh(seconds) {
      window.setTimeout(function () {
        window.location.href = window.location.href;
      }, seconds * 1000);
    } // execute functions necessary for takeover


    function initializeTakeover() {
      addBackgroundToLayout();
      modifyTopStories();
      modifyNewsfeed();
      modifyPageHeader();
      addStyling();
      modifyTopLeaderboard({
        imgUrl: 'https://pixel.nymag.com/imgs/daily/other/2016/11/guinness/guinness_970x90.jpg',
        showTakeover: false
      });
      updateBackgroundHeight();
      cookie.set(cookieName, 'visited');
      setAutoRefresh(10);
    } // don't execute takeover initialization if desktop viewport not detected


    if (!isDesktop) {
      return;
    } // guinness-takeover class handles styling specific to this takeover


    $document.body.classList.add('guinness-takeover'); // if user has previously visited, modify the top leaderboard
    // but don't show the full takeover

    if (visited) {
      modifyTopLeaderboard({
        imgUrl: 'https://pixel.nymag.com/imgs/daily/other/2016/11/guinness/970x90_return.jpg',
        showTakeover: true
      });
    } else if (!visited) {
      // render the full takeover with fade-to-white transition
      $document.body.style.opacity = 0;
      window.setTimeout(function () {
        initializeTakeover();
        $document.body.style.opacity = 1;
      }, 1000);
    }
  }

  return Constructor;
}]);
}, {"26":26,"27":27,"28":28}];
