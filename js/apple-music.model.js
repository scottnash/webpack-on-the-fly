window.modules["apple-music.model"] = [function(require,module,exports){'use strict';

function getEmbedData(url) {
  var songId = url.match(/\?i=(\d*)/),
      // only song urls will have this query param
  isSongUrl = url.includes('?i='),
      embedCode = url.match(/src=['"](.*?)['"]/i);
  var albumId = url.match(/[^\/]+$/); // if the albumId contains 'id', the user has entered an old url, correctly
  // grab the id from this old url

  if (albumId[0].includes('id')) {
    albumId = albumId[0].match(/id(.*)/)[1];
  } else {
    albumId = albumId[0];
  } // checks if the user pasted in embed code


  if (embedCode) {
    return {
      type: 'embed',
      url: embedCode[1]
    };
  } // grabs the unique album ID in the link, which is the string after the last
  // slash in the url


  if (albumId && !isSongUrl) {
    return {
      type: 'album',
      url: "//tools.applemusic.com/embed/v1/album/".concat(albumId, "?country=us")
    };
  } // grabs the unique song ID in the link, which is denoted by the start of '?i='


  if (songId && isSongUrl) {
    return {
      type: 'song',
      url: "//tools.applemusic.com/embed/v1/song/".concat(songId[1], "?country=us")
    };
  }
}

function generateEmbedLink(data) {
  var embedUrl = data.linkToEmbed,
      embed = getEmbedData(embedUrl);

  if (embed.type === 'embed') {
    // parse out the height from the embed code
    data.embedHeight = embedUrl.match(/height=['"](.*?)['"]/i)[1]; // parse out the width from the embed code

    data.embedWidth = embedUrl.match(/width=['"](.*?)['"]/i)[1]; // replaces the embed code pasted in with just the src url

    data.linkToEmbed = embed.url;
  } else {
    // checks if the linkToEmbed has '/id' in its path and checks if the link does not have '?i=' in its path ('?i=' denotes a song)
    if (embed.type === 'album') {
      // height and width values were taken from Apple Music's standard album embed values
      data.embedHeight = '500px';
    } else if (embed.type === 'song') {
      data.embedHeight = '110px';
    } // if a url was entered, the embedWidth will always be 100%


    data.embedWidth = '100%';
  }

  data.embedUrl = embed.url;
}

module.exports.save = function (ref, data) {
  if (data.linkToEmbed) {
    generateEmbedLink(data);
  }

  return data;
}; // for testing


module.exports.getEmbedData = getEmbedData;
}, {}];
