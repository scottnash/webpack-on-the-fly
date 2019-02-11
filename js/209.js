window.modules["209"] = [function(require,module,exports){'use strict'; // this is a big regex that matches everything embedly knows about that ISN'T a video provider
// generated from http://embed.ly/tools/generator
// note: embedly doesn't know about twitter, so we added it manually

module.exports.match = function (url) {
  return url.match(/((http:\/\/(www\.flickr\.com\/photos\/.*|flic\.kr\/.*|polaroidswing\.com\/p\/.*|momento360\.com\/e\/u\/.*|https\?:\/\/kuula\.co\/post\/.*|.*imgur\.com\/.*|i.*\.photobucket\.com\/albums\/.*|s.*\.photobucket\.com\/albums\/.*|media\.photobucket\.com\/image\/.*|www\.mobypicture\.com\/user\/.*\/view\/.*|moby\.to\/.*|xkcd\.com\/.*|www\.xkcd\.com\/.*|imgs\.xkcd\.com\/.*|www\.asofterworld\.com\/index\.php\?id=.*|www\.asofterworld\.com\/.*\.jpg|asofterworld\.com\/.*\.jpg|www\.qwantz\.com\/index\.php\?comic=.*|23hq\.com\/.*\/photo\/.*|www\.23hq\.com\/.*\/photo\/.*|.*dribbble\.com\/shots\/.*|drbl\.in\/.*|.*\.smugmug\.com\/.*|.*\.smugmug\.com\/.*#.*|img\.ly\/.*|www\.tinypic\.com\/view\.php.*|tinypic\.com\/view\.php.*|www\.tinypic\.com\/player\.php.*|tinypic\.com\/player\.php.*|www\.tinypic\.com\/r\/.*\/.*|tinypic\.com\/r\/.*\/.*|.*\.tinypic\.com\/.*\.jpg|.*\.tinypic\.com\/.*\.png|meadd\.com\/.*\/.*|meadd\.com\/.*|.*\.deviantart\.com\/art\/.*|.*\.deviantart\.com\/gallery\/.*|.*\.deviantart\.com\/#\/.*|fav\.me\/.*|.*\.deviantart\.com|.*\.deviantart\.com\/gallery|.*\.deviantart\.com\/.*\/.*\.jpg|.*\.deviantart\.com\/.*\/.*\.gif|.*\.deviantart\.net\/.*\/.*\.jpg|.*\.deviantart\.net\/.*\/.*\.gif|www\.fotopedia\.com\/.*\/.*|fotopedia\.com\/.*\/.*|photozou\.jp\/photo\/show\/.*\/.*|photozou\.jp\/photo\/photo_only\/.*\/.*|instagr\.am\/p\/.*|instagram\.com\/p\/.*|www\.instagram\.com\/p\/.*|skitch\.com\/.*\/.*\/.*|img\.skitch\.com\/.*|www\.questionablecontent\.net\/|questionablecontent\.net\/|www\.questionablecontent\.net\/view\.php.*|questionablecontent\.net\/view\.php.*|questionablecontent\.net\/comics\/.*\.png|www\.questionablecontent\.net\/comics\/.*\.png|twitrpix\.com\/.*|.*\.twitrpix\.com\/.*|www\.someecards\.com\/.*\/.*|someecards\.com\/.*\/.*|some\.ly\/.*|www\.some\.ly\/.*|pikchur\.com\/.*|achewood\.com\/.*|www\.achewood\.com\/.*|achewood\.com\/index\.php.*|www\.achewood\.com\/index\.php.*|www\.whosay\.com\/.*\/content\/.*|www\.whosay\.com\/.*\/photos\/.*|www\.whosay\.com\/.*\/videos\/.*|say\.ly\/.*|ow\.ly\/i\/.*|mlkshk\.com\/p\/.*|d\.pr\/i\/.*|www\.eyeem\.com\/p\/.*|www\.eyeem\.com\/a\/.*|www\.eyeem\.com\/u\/.*|giphy\.com\/gifs\/.*|gph\.is\/.*|frontback\.me\/p\/.*|www\.frontback\.me\/p\/.*|www\.fotokritik\.com\/.*\/.*|fotokritik\.com\/.*\/.*|vid\.me\/.*|galeri\.uludagsozluk\.com\/.*|gfycat\.com\/.*|tochka\.net\/.*|.*\.tochka\.net\/.*|4cook\.net\/recipe\/.*|www\.alphahat\.com\/view\/.*|alphahat\.com\/view\/.*|futurism\.com\/images\/.*|superstack\.io\/v\/.*|gist\.github\.com\/.*|producthunt\.com\/.*|www\.slideshare\.net\/.*\/.*|www\.slideshare\.net\/mobile\/.*\/.*|.*\.slideshare\.net\/.*\/.*|slidesha\.re\/.*|scribd\.com\/doc\/.*|www\.scribd\.com\/doc\/.*|scribd\.com\/mobile\/documents\/.*|www\.scribd\.com\/mobile\/documents\/.*|upscri\.be\/.*|contentupgrade\.me\/.*|screenr\.com\/.*|pollshare\.com\/poll\/.*|polldaddy\.com\/community\/poll\/.*|polldaddy\.com\/poll\/.*|answers\.polldaddy\.com\/poll\/.*|www\.howcast\.com\/videos\/.*|www\.screencast\.com\/.*\/media\/.*|screencast\.com\/.*\/media\/.*|www\.screencast\.com\/t\/.*|screencast\.com\/t\/.*|issuu\.com\/.*\/docs\/.*|www\.kickstarter\.com\/projects\/.*\/.*|www\.scrapblog\.com\/viewer\/viewer\.aspx.*|foursquare\.com\/.*|www\.foursquare\.com\/.*|4sq\.com\/.*|linkedin\.com\/in\/.*|linkedin\.com\/pub\/.*|.*\.linkedin\.com\/in\/.*|.*\.linkedin\.com\/pub\/.*|linkedin\.com\/in\/.*|linkedin\.com\/company\/.*|.*\.linkedin\.com\/company\/.*|www\.sliderocket\.com\/.*|sliderocket\.com\/.*|app\.sliderocket\.com\/.*|portal\.sliderocket\.com\/.*|beta-sliderocket\.com\/.*|www\.yelp\.com\/.*&hrid=\.+|www\.sociale\.co\/question\/.*|www\.genial\.ly\/.*|maps\.google\.com\/maps\?.*|maps\.google\.com\/\?.*|maps\.google\.com\/maps\/ms\?.*|www\.google\..*\/maps\/.*|google\..*\/maps\/.*|.*\.alpacamaps\.com\/.*|graphcommons\.com\/graphs\/.*|graphcommons\.com\/nodes\/.*|https\?:\/\/infogr\.am\/.*|datawrapper\.dwcdn\.net\/.*|embed\.kumu\.io|embed\.kumu\.io|my\.opera\.com\/.*\/albums\/show\.dml\?id=.*|my\.opera\.com\/.*\/albums\/showpic\.dml\?album=.*&picture=.*|tumblr\.com\/.*|.*\.tumblr\.com\/post\/.*|www\.polleverywhere\.com\/polls\/.*|www\.polleverywhere\.com\/multiple_choice_polls\/.*|www\.polleverywhere\.com\/free_text_polls\/.*|www\.quantcast\.com\/wd:.*|www\.quantcast\.com\/.*|siteanalytics\.compete\.com\/.*|.*\.status\.net\/notice\/.*|identi\.ca\/notice\/.*|myloc\.me\/.*|pastebin\.com\/.*|pastie\.org\/.*|www\.pastie\.org\/.*|redux\.com\/stream\/item\/.*\/.*|redux\.com\/f\/.*\/.*|www\.redux\.com\/stream\/item\/.*\/.*|www\.redux\.com\/f\/.*\/.*|cl\.ly\/.*|cl\.ly\/.*\/content|speakerdeck\.com\/.*\/.*|www\.kiva\.org\/lend\/.*|www\.timetoast\.com\/timelines\/.*|storify\.com\/.*\/.*|.*meetup\.com\/.*|meetu\.ps\/.*|www\.dailymile\.com\/people\/.*\/entries\/.*|.*\.kinomap\.com\/.*|www\.metacdn\.com\/r\/c\/.*\/.*|www\.metacdn\.com\/r\/m\/.*\/.*|prezi\.com\/.*\/.*|.*\.uservoice\.com\/.*\/suggestions\/.*|www\.wikipedia\.org\/wiki\/.*|.*\.wikipedia\.org\/wiki\/.*|www\.wikimedia\.org\/wiki\/File.*|360\.io\/.*|www\.behance\.net\/gallery\/.*|behance\.net\/gallery\/.*|www\.jdsupra\.com\/legalnews\/.*|jdsupra\.com\/legalnews\/.*|minilogs\.com\/.*|www\.minilogs\.com\/.*|jsfiddle\.net\/.*|ponga\.com\/.*|list\.ly\/list\/.*|crowdmap\.com\/post\/.*|.*\.crowdmap\.com\/post\/.*|crowdmap\.com\/map\/.*|.*\.crowdmap\.com\/map\/.*|ifttt\.com\/recipes\/.*|weavly\.com\/watch\/.*|www\.weavly\.com\/watch\/.*|tagmotion\.com\/tree\/.*|www\.tagmotion\.com\/tree\/.*|public\.talely\.com\/.*\/.*|polarb\.com\/.*|.*\.polarb\.com\/.*|on\.bubb\.li\/.*|bubb\.li\/.*|.*\.bubb\.li\/.*|embed\.imajize\.com\/.*|giflike\.com\/a\/.*|www\.giflike\.com\/a\/.*|i\.giflike\.com\/.*|rapidengage\.com\/s\/.*|infomous\.com\/node\/.*|stepic\.org\/.*|chirb\.it\/.*|beta\.polstir\.com\/.*\/.*|polstir\.com\/.*\/.*|www\.gettyimages\.com\/detail\/photo\/.*|gty\.im\/.*|www\.gettyimages\.com\/license\/.*|isnare\.com\/.*|www\.isnare\.com\/.*|www\.branchtrack\.com\/projects\/.*|jsbin\.com\/.*\/.*|jsbin\.com\/.*|wedgi\.es\/.*|public\.chartblocks\.com\/c\/.*|radd\.it\/r\/.*|radd\.it\/comments\/.*|radd\.it\/user\/.*|radd\.it\/playlists\/.*|radd\.it\/magic\/.*|vibi\.com\/videocard\/.*|kastio\.com\/webcasts\/.*|.*\.kastio\.com\/webcasts\/.*|megavisor\.com\/view\/.*|megavisor\.com\/en\/view\/.*|bunkrapp\.com\/.*\/.*|.*\.cartodb\.com\/.*\/.*|flowvella\.com\/s\/.*|fr\.peoplbrain\.com\/tutoriaux\/.*|codepicnic\.com\/bites\/.*|codepicnic\.com\/consoles\/.*|tr\.instela\.com\/.*|codepen\.io\/.*\/pen\/.*|codepen\.io\/.*\/pen\/.*|runelm\.io\/.*\/.*|www\.vtility\.net\/virtualtour\/.*|quora\.com\/.*\/answer\/.*|www\.quora\.com\/.*\/answer\/.*|tunein\.com\/.*|tun\.in\/.*|scribblemaps\.com\/maps\/view\/.*\/.*|www\.scribblemaps\.com\/maps\/view\/.*\/.*|www\.codeply\.com\/view\/.*|codeply\.com\/view\/.*|www\.candybank\.com\/.*|flat\.io\/score\/.*|www\.qzzr\.com\/quiz\/.*|shorti\.com\/.*|www\.shorti\.com\/.*|blab\.im\/.*|pollplug\.com\/poll\/.*|alpha\.vrchive\.com\/.*|vrchive\.com\/.*|www\.globalgiving\.org\/projects\/.*|www\.globalgiving\.org\/funds\/.*|www\.globalgiving\.org\/microprojects\/.*|www\.newhive\.com\/.*\/.*|slidr\.io\/.*\/.*|publons\.com\/author\/.*|www\.publons\.com\/author\/.*|calameo\.com\/.*|www\.calameo\.com\/.*|relayto\.com\/.*|www\.relayto\.com\/.*|www\.graphiq\.com\/w\/.*|graphiq\.com\/w\/.*|w\.graphiq\.com\/w\/.*|view\.stacker\.cc\/.*|content\.newsbound\.com\/.*\/.*|.*\.silk\.co\/explore\/.*|docs\.com\/.*|rocketium\.com\/.*|cdn\.knightlab\.com\/libs\/timeline3\/.*|cdn\.knightlab\.com\/libs\/juxtapose\/.*|uploads\.knightlab\.com\/storymapjs\/.*\/index\.html|www\.thelastgraph\.com\/lg\.php\?a=.*|thelastgraph\.com\/lg\.php\?a=.*|rogertalk\.com\/.*|www\.rogertalk\.com\/.*|stackshare\.io\/.*|www\.stackshare\.io\/.*|maphubs\.com\/user\/.*\/map\/.*|www\.maphubs\.com\/user\/.*\/map\/.*|braid\.io\/embed-tile\/.*|www\.braid\.io\/embed-tile\/.*|talkshow\.im\/show\/.*|www\.talkshow\.im\/show\/.*|medibang\.com\/sv\/.*|www\.medibang\.com\/sv\/.*|redivis\.com\/r\/.*|www\.redivis\.com\/r\/.*|my\.webboards\.fr\/.*|cooler\.tv\/.*|mathembed\.com\/latex.*|minko\.io\/s\/|campaign\.theheartstringsproject\.com\/.*|www\.altizure\.com\/project\/.*|exploratory\.io\/viz\/.*|esplor\.io\/.*|www\.pastery\.net\/.*|hardbound\.co\/.*\/.*\/.*|mybeweeg\.com\/w\/.*|storribook\.com\/articles\/view\/.*\/.*|sidewire\.com\/.*\/.*\/.*|codiva\.io\/p\/.*|www\.codiva\.io\/p\/.*|www\.fwdeveryone\.com\/t\/.*|fwdeveryone\.com\/t\/.*|app\.wizer\.me\/learn\/.*|app\.wizer\.me\/preview\/.*|kidoju\.com\/.*|.*\.razoo\.com\/.*|eyrie\.io\/.*|verse\.com\/stories\/.*|www\.moviemogul\.io\/.*|walkinto\.in\/.*\/.*|.*\.walkinto\.in\/.*\/.*|spaces\.archilogic\.com\/model\/.*|spaces\.archilogic\.com\/3d\/.*|ellie-app\.com\/.*\/.*|www\.maprosoft\.com\/app\/map.*|www\.gradba\.se\/v\/.*|cincopa\.com\/~.*|.*\.cincopa\.com\/watch\/.*|vr3d\.vn\/.*|lcontacts\.herokuapp\.com\/embed\/button\/.*|vrbfoto\.com\/f\/.*|orbitvu\.com\/001\/.*|www\.amazon\.com\/gp\/product\/.*|www\.amazon\.com\/.*\/dp\/.*|www\.amazon\.com\/o\/ASIN\/.*|www\.amazon\.com\/gp\/offer-listing\/.*|www\.amazon\.com\/.*\/ASIN\/.*|www\.amazon\.com\/gp\/aw\/d\/.*|amazon\.com\/gp\/product\/.*|amazon\.com\/.*\/dp\/.*|amazon\.com\/o\/ASIN\/.*|amazon\.com\/gp\/offer-listing\/.*|amazon\.com\/.*\/ASIN\/.*|amazon\.com\/gp\/aw\/d\/.*|www\.amazon\.cn\/gp\/product\/.*|www\.amazon\.cn\/.*\/dp\/.*|www\.amazon\.cn\/o\/ASIN\/.*|www\.amazon\.cn\/gp\/offer-listing\/.*|www\.amazon\.cn\/.*\/ASIN\/.*|www\.amazon\.cn\/gp\/aw\/d\/.*|amazon\.cn\/gp\/product\/.*|amazon\.cn\/.*\/dp\/.*|amazon\.cn\/o\/ASIN\/.*|amazon\.cn\/gp\/offer-listing\/.*|amazon\.cn\/.*\/ASIN\/.*|amazon\.cn\/gp\/aw\/d\/.*|www\.amazon\.in\/gp\/product\/.*|www\.amazon\.in\/.*\/dp\/.*|www\.amazon\.in\/o\/ASIN\/.*|www\.amazon\.in\/gp\/offer-listing\/.*|www\.amazon\.in\/.*\/ASIN\/.*|www\.amazon\.in\/gp\/aw\/d\/.*|amazon\.in\/gp\/product\/.*|amazon\.in\/.*\/dp\/.*|amazon\.in\/o\/ASIN\/.*|amazon\.in\/gp\/offer-listing\/.*|amazon\.in\/.*\/ASIN\/.*|amazon\.in\/gp\/aw\/d\/.*|www\.amazon\.co\.jp\/gp\/product\/.*|www\.amazon\.co\.jp\/.*\/dp\/.*|www\.amazon\.co\.jp\/o\/ASIN\/.*|www\.amazon\.co\.jp\/gp\/offer-listing\/.*|www\.amazon\.co\.jp\/.*\/ASIN\/.*|www\.amazon\.co\.jp\/gp\/aw\/d\/.*|amazon\.co\.jp\/gp\/product\/.*|amazon\.co\.jp\/.*\/dp\/.*|amazon\.co\.jp\/o\/ASIN\/.*|amazon\.co\.jp\/gp\/offer-listing\/.*|amazon\.co\.jp\/.*\/ASIN\/.*|amazon\.co\.jp\/gp\/aw\/d\/.*|www\.amazon\.fr\/gp\/product\/.*|www\.amazon\.fr\/.*\/dp\/.*|www\.amazon\.fr\/o\/ASIN\/.*|www\.amazon\.fr\/gp\/offer-listing\/.*|www\.amazon\.fr\/.*\/ASIN\/.*|www\.amazon\.fr\/gp\/aw\/d\/.*|amazon\.fr\/gp\/product\/.*|amazon\.fr\/.*\/dp\/.*|amazon\.fr\/o\/ASIN\/.*|amazon\.fr\/gp\/offer-listing\/.*|amazon\.fr\/.*\/ASIN\/.*|amazon\.fr\/gp\/aw\/d\/.*|www\.amazon\.de\/gp\/product\/.*|www\.amazon\.de\/.*\/dp\/.*|www\.amazon\.de\/o\/ASIN\/.*|www\.amazon\.de\/gp\/offer-listing\/.*|www\.amazon\.de\/.*\/ASIN\/.*|www\.amazon\.de\/gp\/aw\/d\/.*|amazon\.de\/gp\/product\/.*|amazon\.de\/.*\/dp\/.*|amazon\.de\/o\/ASIN\/.*|amazon\.de\/gp\/offer-listing\/.*|amazon\.de\/.*\/ASIN\/.*|amazon\.de\/gp\/aw\/d\/.*|www\.amazon\.es\/gp\/product\/.*|www\.amazon\.es\/.*\/dp\/.*|www\.amazon\.es\/o\/ASIN\/.*|www\.amazon\.es\/gp\/offer-listing\/.*|www\.amazon\.es\/.*\/ASIN\/.*|www\.amazon\.es\/gp\/aw\/d\/.*|amazon\.es\/gp\/product\/.*|amazon\.es\/.*\/dp\/.*|amazon\.es\/o\/ASIN\/.*|amazon\.es\/gp\/offer-listing\/.*|amazon\.es\/.*\/ASIN\/.*|amazon\.es\/gp\/aw\/d\/.*|www\.amazon\.it\/gp\/product\/.*|www\.amazon\.it\/.*\/dp\/.*|www\.amazon\.it\/o\/ASIN\/.*|www\.amazon\.it\/gp\/offer-listing\/.*|www\.amazon\.it\/.*\/ASIN\/.*|www\.amazon\.it\/gp\/aw\/d\/.*|amazon\.it\/gp\/product\/.*|amazon\.it\/.*\/dp\/.*|amazon\.it\/o\/ASIN\/.*|amazon\.it\/gp\/offer-listing\/.*|amazon\.it\/.*\/ASIN\/.*|amazon\.it\/gp\/aw\/d\/.*|www\.amazon\.co\.uk\/gp\/product\/.*|www\.amazon\.co\.uk\/.*\/dp\/.*|www\.amazon\.co\.uk\/o\/ASIN\/.*|www\.amazon\.co\.uk\/gp\/offer-listing\/.*|www\.amazon\.co\.uk\/.*\/ASIN\/.*|www\.amazon\.co\.uk\/gp\/aw\/d\/.*|amazon\.co\.uk\/gp\/product\/.*|amazon\.co\.uk\/.*\/dp\/.*|amazon\.co\.uk\/o\/ASIN\/.*|amazon\.co\.uk\/gp\/offer-listing\/.*|amazon\.co\.uk\/.*\/ASIN\/.*|amazon\.co\.uk\/gp\/aw\/d\/.*|www\.amazon\.ca\/gp\/product\/.*|www\.amazon\.ca\/.*\/dp\/.*|www\.amazon\.ca\/o\/ASIN\/.*|www\.amazon\.ca\/gp\/offer-listing\/.*|www\.amazon\.ca\/.*\/ASIN\/.*|www\.amazon\.ca\/gp\/aw\/d\/.*|amazon\.ca\/gp\/product\/.*|amazon\.ca\/.*\/dp\/.*|amazon\.ca\/o\/ASIN\/.*|amazon\.ca\/gp\/offer-listing\/.*|amazon\.ca\/.*\/ASIN\/.*|amazon\.ca\/gp\/aw\/d\/.*|www\.amazon\.com\.mx\/gp\/product\/.*|www\.amazon\.com\.mx\/.*\/dp\/.*|www\.amazon\.com\.mx\/o\/ASIN\/.*|www\.amazon\.com\.mx\/gp\/offer-listing\/.*|www\.amazon\.com\.mx\/.*\/ASIN\/.*|www\.amazon\.com\.mx\/gp\/aw\/d\/.*|amazon\.com\.mx\/gp\/product\/.*|amazon\.com\.mx\/.*\/dp\/.*|amazon\.com\.mx\/o\/ASIN\/.*|amazon\.com\.mx\/gp\/offer-listing\/.*|amazon\.com\.mx\/.*\/ASIN\/.*|amazon\.com\.mx\/gp\/aw\/d\/.*|www\.amazon\.com\.au\/gp\/product\/.*|www\.amazon\.com\.au\/.*\/dp\/.*|www\.amazon\.com\.au\/o\/ASIN\/.*|www\.amazon\.com\.au\/gp\/offer-listing\/.*|www\.amazon\.com\.au\/.*\/ASIN\/.*|www\.amazon\.com\.au\/gp\/aw\/d\/.*|amazon\.com\.au\/gp\/product\/.*|amazon\.com\.au\/.*\/dp\/.*|amazon\.com\.au\/o\/ASIN\/.*|amazon\.com\.au\/gp\/offer-listing\/.*|amazon\.com\.au\/.*\/ASIN\/.*|amazon\.com\.au\/gp\/aw\/d\/.*|www\.amazon\.com\.br\/gp\/product\/.*|www\.amazon\.com\.br\/.*\/dp\/.*|www\.amazon\.com\.br\/o\/ASIN\/.*|www\.amazon\.com\.br\/gp\/offer-listing\/.*|www\.amazon\.com\.br\/.*\/ASIN\/.*|www\.amazon\.com\.br\/gp\/aw\/d\/.*|amazon\.com\.br\/gp\/product\/.*|amazon\.com\.br\/.*\/dp\/.*|amazon\.com\.br\/o\/ASIN\/.*|amazon\.com\.br\/gp\/offer-listing\/.*|amazon\.com\.br\/.*\/ASIN\/.*|amazon\.com\.br\/gp\/aw\/d\/.*|www\.amzn\.com\/.*|amzn\.com\/.*|shoplocket\.com\/products\/.*|etsy\.com\/.*|www\.etsy\.com\/.*|fiverr\.com\/.*\/.*|www\.fiverr\.com\/.*\/.*|kit\.com\/.*|soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*|open\.spotify\.com\/.*|spoti\.fi\/.*|play\.spotify\.com\/.*|www\.last\.fm\/music\/.*|www\.last\.fm\/music\/+videos\/.*|www\.last\.fm\/music\/+images\/.*|www\.last\.fm\/music\/.*\/_\/.*|www\.last\.fm\/music\/.*\/.*|www\.simplecast\.com\/s\/.*|www\.changelog\.com\/.*|www\.megafono\.io\/.*|www\.mixcloud\.com\/.*\/.*\/|play\.radiopublic\.com\/.*|www\.hark\.com\/clips\/.*|www\.rdio\.com\/#\/artist\/.*\/album\/.*|www\.rdio\.com\/artist\/.*\/album\/.*|www\.zero-inch\.com\/.*|.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*|freemusicarchive\.org\/music\/.*|www\.freemusicarchive\.org\/music\/.*|freemusicarchive\.org\/curator\/.*|www\.freemusicarchive\.org\/curator\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/templates\/story\/story\.php.*|huffduffer\.com\/.*\/.*|audioboom\.com\/posts\/.*|www\.audioboom\.com\/boos\/.*|audioboom\.com\/boos\/.*|boo\.fm\/b.*|www\.xiami\.com\/song\/.*|xiami\.com\/song\/.*|www\.saynow\.com\/playMsg\.html.*|www\.saynow\.com\/playMsg\.html.*|grooveshark\.com\/.*|radioreddit\.com\/songs.*|www\.radioreddit\.com\/songs.*|radioreddit\.com\/\?q=songs.*|www\.radioreddit\.com\/\?q=songs.*|www\.gogoyoko\.com\/song\/.*|hypem\.com\/premiere\/.*|bop\.fm\/s\/.*\/.*|clyp\.it\/.*|www\.dnbradio\.com\/.*|dnbradio\.com\/.*|anchor\.fm\/.*|bumpers\.fm\/e\/.*|buzzsprout\.com\/.*|.*\.buzzsprout\.com\/.*|60db\.co\/story\/.*|allihoopa\.com\/s\/.*|vizamp\.com\/player\/.*|www\.vizamp\.com\/player\/.*|tapewrite\.com\/.*|player\.megaphone\.fm\/.*|cms\.megaphone\.fm\/.*|play\.soundsgood\.co\/.*|.*\.sparemin\.com\/myrecording|.*\.sparemin\.com\/recording-.*))|(https:\/\/(www\.flickr\.com\/photos\/.*|flic\.kr\/.*|polaroidswing\.com\/p\/.*|momento360\.com\/e\/u\/.*|.*imgur\.com\/.*|www\.instagram\.com\/p\/.*|skitch\.com\/.*\/.*\/.*|img\.skitch\.com\/.*|frontback\.me\/p\/.*|www\.frontback\.me\/p\/.*|vidd\.me\/.*|vid\.me\/.*|gfycat\.com\/.*|.*\.accredible\.com\/.*|accredible\.com\/.*|futurism\.com\/images\/.*|superstack\.io\/v\/.*|www\.pexels\.com\/photo\/.*|gist\.github\.com\/.*|producthunt\.com\/.*|www\.slideshare\.net\/.*\/.*|www\.slideshare\.net\/mobile\/.*\/.*|.*\.slideshare\.net\/.*\/.*|slidesha\.re\/.*|scribd\.com\/doc\/.*|www\.scribd\.com\/doc\/.*|scribd\.com\/mobile\/documents\/.*|www\.scribd\.com\/mobile\/documents\/.*|scribd\.com\/documents\/.*|www\.scribd\.com\/documents\/.*|upscri\.be\/.*|contentupgrade\.me\/.*|pollshare\.com\/poll\/.*|www\.getwhichit\.com\/page\/.*|issuu\.com\/.*\/docs\/.*|www\.kickstarter\.com\/projects\/.*\/.*|foursquare\.com\/.*|www\.foursquare\.com\/.*|linkedin\.com\/in\/.*|linkedin\.com\/pub\/.*|.*\.linkedin\.com\/in\/.*|.*\.linkedin\.com\/pub\/.*|linkedin\.com\/in\/.*|linkedin\.com\/company\/.*|.*\.linkedin\.com\/company\/.*|www\.yelp\.com\/.*&hrid=\.+|www\.sociale\.co\/question\/.*|www\.genial\.ly\/.*|maps\.google\.com\/maps\?.*|maps\.google\.com\/\?.*|maps\.google\.com\/maps\/ms\?.*|www\.google\..*\/maps\/.*|google\..*\/maps\/.*|.*\.alpacamaps\.com\/.*|graphcommons\.com\/graphs\/.*|graphcommons\.com\/nodes\/.*|datawrapper\.dwcdn\.net\/.*|tumblr\.com\/.*|.*\.tumblr\.com\/post\/.*|pastebin\.com\/.*|speakerdeck\.com\/.*\/.*|storify\.com\/.*\/.*|.*meetup\.com\/.*|meetu\.ps\/.*|www\.wikipedia\.org\/wiki\/.*|.*\.wikipedia\.org\/wiki\/.*|www\.wikimedia\.org\/wiki\/File.*|urtak\.com\/u\/.*|urtak\.com\/clr\/.*|ganxy\.com\/.*|www\.ganxy\.com\/.*|sketchfab\.com\/models\/.*|sketchfab\.com\/show\/.*|ifttt\.com\/recipes\/.*|cloudup\.com\/.*|rapidengage\.com\/s\/.*|stepic\.org\/.*|readtapestry\.com\/s\/.*\/|chirb\.it\/.*|www\.gettyimages\.com\/detail\/photo\/.*|gty\.im\/.*|www\.gettyimages\.com\/license\/.*|www\.branchtrack\.com\/projects\/.*|www\.wedgies\.com\/question\/.*|public\.chartblocks\.com\/c\/.*|megavisor\.com\/view\/.*|megavisor\.com\/en\/view\/.*|bunkrapp\.com\/.*\/.*|.*\.cartodb\.com\/.*\/.*|flowvella\.com\/s\/.*|fr\.peoplbrain\.com\/tutoriaux\/.*|codepicnic\.com\/bites\/.*|codepicnic\.com\/consoles\/.*|tr\.instela\.com\/.*|runelm\.io\/.*\/.*|quora\.com\/.*\/answer\/.*|www\.quora\.com\/.*\/answer\/.*|tunein\.com\/.*|tun\.in\/.*|scribblemaps\.com\/maps\/view\/.*\/.*|www\.scribblemaps\.com\/maps\/view\/.*\/.*|marvelapp\.com\/.*|www\.flat\.io\/score\/.*|www\.qzzr\.com\/quiz\/.*|blab\.im\/.*|glitter\.club\/.*|pollplug\.com\/poll\/.*|alpha\.vrchive\.com\/.*|vrchive\.com\/.*|www\.globalgiving\.org\/projects\/.*|www\.globalgiving\.org\/funds\/.*|www\.globalgiving\.org\/microprojects\/.*|www\.newhive\.com\/.*\/.*|newhive\.com\/.*\/.*|newhive\.com\/.*\/.*|slidr\.io\/.*\/.*|publons\.com\/author\/.*|www\.publons\.com\/author\/.*|calameo\.com\/.*|www\.calameo\.com\/.*|relayto\.com\/.*|www\.relayto\.com\/.*|www\.graphiq\.com\/w\/.*|graphiq\.com\/w\/.*|w\.graphiq\.com\/w\/.*|view\.stacker\.cc\/.*|content\.newsbound\.com\/.*\/.*|projects\.invisionapp\.com\/share\/.*|invis\.io\/.*|.*\.silk\.co\/explore\/.*|docs\.com\/.*|sway\.com\/.*|publicgood\.com\/campaign\/.*|publicgood\.com\/org\/.*|publicgood\.com\/org\/.*\/campaign\/.*|airtable\.com\/shr.*|rocketium\.com\/.*|cdn\.knightlab\.com\/libs\/timeline3\/.*|cdn\.knightlab\.com\/libs\/juxtapose\/.*|rogertalk\.com\/.*|www\.rogertalk\.com\/.*|maphubs\.com\/user\/.*\/map\/.*|www\.maphubs\.com\/user\/.*\/map\/.*|braid\.io\/embed-tile\/.*|www\.braid\.io\/embed-tile\/.*|talkshow\.im\/show\/.*|www\.talkshow\.im\/show\/.*|medibang\.com\/sv\/.*|www\.medibang\.com\/sv\/.*|redivis\.com\/r\/.*|www\.redivis\.com\/r\/.*|my\.webboards\.fr\/.*|my\.matterport\.com\/show\/.*|cooler\.tv\/.*|mathembed\.com\/latex.*|minko\.io\/s\/|campaign\.theheartstringsproject\.com\/.*|www\.altizure\.com\/project\/.*|exploratory\.io\/viz\/.*|maps\.mysidewalk\.com\/.*|esplor\.io\/.*|www\.pastery\.net\/.*|hardbound\.co\/.*\/.*\/.*|mybeweeg\.com\/w\/.*|storribook\.com\/articles\/view\/.*\/.*|sidewire\.com\/.*\/.*\/.*|codiva\.io\/p\/.*|www\.codiva\.io\/p\/.*|www\.fwdeveryone\.com\/t\/.*|fwdeveryone\.com\/t\/.*|app\.wizer\.me\/learn\/.*|app\.wizer\.me\/preview\/.*|kidoju\.com\/.*|.*\.razoo\.com\/.*|eyrie\.io\/.*|verse\.com\/stories\/.*|www\.canva\.com\/design\/.*|www\.moviemogul\.io\/.*|powered\.by\.rabbut\.com\/p\/.*|walkinto\.in\/.*\/.*|.*\.walkinto\.in\/.*\/.*|spaces\.archilogic\.com\/model\/.*|spaces\.archilogic\.com\/3d\/.*|api\.peptone\.io\/v1\/visualize\/.*|www\.highly\.co\/hl\/.*|.*\.uplabs\.com\/posts\/.*|ellie-app\.com\/.*\/.*|www\.maprosoft\.com\/app\/map.*|www\.gradba\.se\/v\/.*|cincopa\.com\/~.*|.*\.cincopa\.com\/watch\/.*|lcontacts\.herokuapp\.com\/embed\/button\/.*|vrbfoto\.com\/f\/.*|orbitvu\.com\/001\/.*|www\.ipushpull\.com\/pages\/domains\/.*\/pages\/.*|ipushpull\.com\/pages\/domains\/.*\/pages\/.*|app\.very\.gd\/p\/.*|www\.icloud\.com\/keynote\/.*|icloud\.com\/keynote\/.*|www\.iorad\.com\/player\/.*|iorad\.com\/player\/.*|etsy\.com\/.*|www\.etsy\.com\/.*|kit\.com|soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|open\.spotify\.com\/.*|play\.spotify\.com\/.*|www\.last\.fm\/music\/.*|www\.last\.fm\/music\/+videos\/.*|www\.last\.fm\/music\/+images\/.*|www\.last\.fm\/music\/.*\/_\/.*|www\.last\.fm\/music\/.*\/.*|www\.simplecast\.com\/s\/.*|www\.changelog\.com\/.*|www\.megafono\.io\/.*|play\.radiopublic\.com\/.*|www\.rdio\.com\/#\/artist\/.*\/album\/.*|www\.rdio\.com\/artist\/.*\/album\/.*|.*\.bandcamp\.com\/|.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/.*\/.*\/.*\/.*\/.*\/.*\/.*|www\.npr\.org\/templates\/story\/story\.php.*|audioboom\.com\/posts\/.*|bop\.fm\/s\/.*\/.*|bop\.fm\/p\/.*|bop\.fm\/a\/.*|clyp\.it\/.*|sfx\.io\/.*|anchor\.fm\/.*|bumpers\.fm\/e\/.*|buzzsprout\.com\/.*|.*\.buzzsprout\.com\/.*|60db\.co\/story\/.*|allihoopa\.com\/s\/.*|vizamp\.com\/player\/.*|www\.vizamp\.com\/player\/.*|art19\.com\/shows\/.*\/episodes\/.*|tapewrite\.com\/.*|player\.megaphone\.fm\/.*|cms\.megaphone\.fm\/.*|play\.soundsgood\.co\/.*|.*\.sparemin\.com\/myrecording|.*\.sparemin\.com\/recording-.*)))/i) || url.match(/twitter\.com/i);
};
}, {}];
