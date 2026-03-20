(function () {
\t'use strict';

\tfunction rating_imdb(card) {
\t\tvar network = new Lampa.Reguest();
\t\tvar clean_title = kpCleanTitle(card.title);
\t\tvar search_date = card.release_date || card.first_air_date || card.last_air_date || '0000';
\t\tvar search_year = parseInt((search_date + '').slice(0, 4));
\t\tvar orig = card.original_title || card.original_name;
\t\tvar kp_prox = '';
\t\tvar params = {
\t\t\tid: card.id,
\t\t\turl: kp_prox + 'https://kinopoiskapiunofficial.tech/',
\t\t\trating_url: kp_prox + 'https://rating.kinopoisk.ru/',
\t\t\theaders: {
\t\t\t\t'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616'
\t\t\t},
\t\t\tcache_time: 60 * 60 * 24 * 1000 //86400000 сек = 1день Время кэша в секундах
\t\t};
\t\tgetRating();

\t\tfunction getRating() {
\t\t\tvar movieRating = _getCache(params.id);
\t\t\tif (movieRating) {
\t\t\t\treturn _showRating(movieRating[params.id]);
\t\t\t} else {
\t\t\t\tsearchFilm();
\t\t\t}
\t\t}

\t\tfunction searchFilm() {
\t\t\tvar url = params.url;
\t\t\tvar url_by_title = Lampa.Utils.addUrlComponent(url + 'api/v2.1/films/search-by-keyword', 'keyword=' + encodeURIComponent(clean_title));
\t\t\tif (card.imdb_id) url = Lampa.Utils.addUrlComponent(url + 'api/v2.2/films', 'imdbId=' + encodeURIComponent(card.imdb_id));
\t\t\telse url = url_by_title;
\t\t\tnetwork.clear();
\t\t\tnetwork.timeout(15000);
\t\t\tnetwork.silent(url, function (json) {
\t\t\t\tif (json.items && json.items.length) chooseFilm(json.items);
\t\t\t\telse if (json.films && json.films.length) chooseFilm(json.films);
\t\t\t\telse if (url !== url_by_title) {
\t\t\t\t\tnetwork.clear();
\t\t\t\t\tnetwork.timeout(15000);
\t\t\t\t\tnetwork.silent(url_by_title, function (json) {
\t\t\t\t\t\tif (json.items && json.items.length) chooseFilm(json.items);
\t\t\t\t\t\telse if (json.films && json.films.length) chooseFilm(json.films);
\t\t\t\t\t\telse chooseFilm([]);
\t\t\t\t\t}, function (a, c) {
\t\t\t\t\t\tshowError(network.errorDecode(a, c));
\t\t\t\t\t}, false, {
\t\t\t\t\t\theaders: params.headers
\t\t\t\t\t});
\t\t\t\t} else chooseFilm([]);
\t\t\t}, function (a, c) {
\t\t\t\tshowError(network.errorDecode(a, c));
\t\t\t}, false, {
\t\t\t\theaders: params.headers
\t\t\t});
\t\t}

\t\tfunction chooseFilm(items) {
\t\t\tif (items && items.length) {
\t\t\t\tvar is_sure = false;
\t\t\t\tvar is_imdb = false;
\t\t\t\titems.forEach(function (c) {
\t\t\t\t\tvar year = c.start_date || c.year || '0000';
\t\t\t\t\tc.tmp_year = parseInt((year + '').slice(0, 4));
\t\t\t\t});
\t\t\t\tif (card.imdb_id) {
\t\t\t\t\tvar tmp = items.filter(function (elem) {
\t\t\t\t\t\treturn (elem.imdb_id || elem.imdbId) == card.imdb_id;
\t\t\t\t\t});
\t\t\t\t\tif (tmp.length) {
\t\t\t\t\t\titems = tmp;
\t\t\t\t\t\tis_sure = true;
\t\t\t\t\t\tis_imdb = true;
\t\t\t\t\t}
\t\t\t\t}
\t\t\t\tvar cards = items;
\t\t\t\tif (cards.length) {
\t\t\t\t\tif (orig) {
\t\t\t\t\t\tvar _tmp = cards.filter(function (elem) {
\t\t\t\t\t\t\treturn containsTitle(elem.orig_title || elem.nameOriginal, orig) || containsTitle(elem.en_title || elem.nameEn, orig) || containsTitle(elem.title || elem.ru_title || elem.nameRu, orig);
\t\t\t\t\t\t});
\t\t\t\t\t\tif (_tmp.length) {
\t\t\t\t\t\t\tcards = _tmp;
\t\t\t\t\t\t\tis_sure = true;
\t\t\t\t\t\t}
\t\t\t\t\t}
\t\t\t\t\tif (card.title) {
\t\t\t\t\t\tvar _tmp2 = cards.filter(function (elem) {
\t\t\t\t\t\t\treturn containsTitle(elem.title || elem.ru_title || elem.nameRu, card.title) || containsTitle(elem.en_title || elem.nameEn, card.title) || containsTitle(elem.orig_title || elem.nameOriginal, card.title);
\t\t\t\t\t\t});
\t\t\t\t\t\tif (_tmp2.length) {
\t\t\t\t\t\t\tcards = _tmp2;
\t\t\t\t\t\t\tis_sure = true;
\t\t\t\t\t\t}
\t\t\t\t\t}
\t\t\t\t\tif (cards.length > 1 && search_year) {
\t\t\t\t\t\tvar _tmp3 = cards.filter(function (c) {
\t\t\t\t\t\t\treturn c.tmp_year == search_year;
\t\t\t\t\t\t});
\t\t\t\t\t\tif (!_tmp3.length) _tmp3 = cards.filter(function (c) {
\t\t\t\t\t\t\treturn c.tmp_year && c.tmp_year > search_year - 2 && c.tmp_year < search_year + 2;
\t\t\t\t\t\t});
\t\t\t\t\t\tif (_tmp3.length) cards = _tmp3;
\t\t\t\t\t}
\t\t\t\t}
\t\t\t\tif (cards.length == 1 && is_sure && !is_imdb) {
\t\t\t\t\tif (search_year && cards[0].tmp_year) {
\t\t\t\t\t\tis_sure = cards[0].tmp_year > search_year - 2 && cards[0].tmp_year < search_year + 2;
\t\t\t\t\t}
\t\t\t\t\tif (is_sure) {
\t\t\t\t\t\tis_sure = false;
\t\t\t\t\t\tif (orig) {
\t\t\t\t\t\t\tis_sure |= equalTitle(cards[0].orig_title || cards[0].nameOriginal, orig) || equalTitle(cards[0].en_title || cards[0].nameEn, orig) || equalTitle(cards[0].title || cards[0].ru_title || cards[0].nameRu, orig);
\t\t\t\t\t\t}
\t\t\t\t\t\tif (card.title) {
\t\t\t\t\t\t\tis_sure |= equalTitle(cards[0].title || cards[0].ru_title || cards[0].nameRu, card.title) || equalTitle(cards[0].en_title || cards[0].nameEn, card.title) || equalTitle(cards[0].orig_title || cards[0].nameOriginal, card.title);
\t\t\t\t\t\t}
\t\t\t\t\t}
\t\t\t\t}
\t\t\t\tif (cards.length == 1 && is_sure) {
\t\t\t\t\tvar id = cards[0].kp_id || cards[0].kinopoisk_id || cards[0].kinopoiskId || cards[0].filmId;
\t\t\t\t\tvar base_search = function base_search() {
\t\t\t\t\t\tnetwork.clear();
\t\t\t\t\t\tnetwork.timeout(15000);
\t\t\t\t\t\tnetwork.silent(params.url + 'api/v2.2/films/' + id, function (data) {
\t\t\t\t\t\t\tvar movieRating = _setCache(params.id, {
\t\t\t\t\t\t\t\timdb: data.ratingImdb,
\t\t\t\t\t\t\t\ttimestamp: new Date().getTime()
\t\t\t\t\t\t\t}); // Кешируем данные
\t\t\t\t\t\t\treturn _showRating(movieRating);
\t\t\t\t\t\t}, function (a, c) {
\t\t\t\t\t\t\tshowError(network.errorDecode(a, c));
\t\t\t\t\t\t}, false, {
\t\t\t\t\t\t\theaders: params.headers
\t\t\t\t\t\t});
\t\t\t\t\t};
\t\t\t\t\tnetwork.clear();
\t\t\t\t\tnetwork.timeout(5000);
\t\t\t\t\tnetwork["native"](params.rating_url + id + '.xml', function (str) {
\t\t\t\t\t\tif (str.indexOf('<rating>') >= 0) {
\t\t\t\t\t\t\ttry {
\t\t\t\t\t\t\t\tvar ratingImdb = 0;
\t\t\t\t\t\t\t\tvar xml = $($.parseXML(str));
\t\t\t\t\t\t\t\tvar imdb_rating = xml.find('imdb_rating');
\t\t\t\t\t\t\t\tif (imdb_rating.length) {
\t\t\t\t\t\t\t\t\tratingImdb = parseFloat(imdb_rating.text());
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t\tvar movieRating = _setCache(params.id, {
\t\t\t\t\t\t\t\t\timdb: ratingImdb,
\t\t\t\t\t\t\t\t\ttimestamp: new Date().getTime()
\t\t\t\t\t\t\t\t}); // Кешируем данные
\t\t\t\t\t\t\t\treturn _showRating(movieRating);
\t\t\t\t\t\t\t} catch (ex) {
\t\t\t\t\t\t\t}
\t\t\t\t\t\t}
\t\t\t\t\t\tbase_search();
\t\t\t\t\t}, function (a, c) {
\t\t\t\t\t\tbase_search();
\t\t\t\t\t}, false, {
\t\t\t\t\t\tdataType: 'text'
\t\t\t\t\t});
\t\t\t\t} else {
\t\t\t\t\tvar movieRating = _setCache(params.id, {
\t\t\t\t\t\timdb: 0,
\t\t\t\t\t\ttimestamp: new Date().getTime()
\t\t\t\t\t}); // Кешируем данные
\t\t\t\t\treturn _showRating(movieRating);
\t\t\t\t}
\t\t\t} else {
\t\t\t\tvar _movieRating = _setCache(params.id, {
\t\t\t\t\timdb: 0,
\t\t\t\t\ttimestamp: new Date().getTime()
\t\t\t\t}); // Кешируем данные
\t\t\t\treturn _showRating(_movieRating);
\t\t\t}
\t\t}

\t\tfunction cleanTitle(str){
\t\t\treturn str.replace(/[s.,:;''`!?]+/g, ' ').trim();
\t\t}

\t\tfunction kpCleanTitle(str){
\t\t\treturn cleanTitle(str).replace(/^[ /\\]+/, '').replace(/[ /\\]+$/, '').replace(/+( *[+/\\])+/g, '+').replace(/([+/\\] *)++/g, '+').replace(/( *[/\\]+ *)+/g, '+');
\t\t}

\t\tfunction normalizeTitle(str){
\t\t\treturn cleanTitle(str.toLowerCase().replace(/[-‐-―⸺⸻﹘﹣－]+/g, '-').replace(/ё/g, 'е'));
\t\t}

\t\tfunction equalTitle(t1, t2){
\t\t\treturn typeof t1 === 'string' && typeof t2 === 'string' && normalizeTitle(t1) === normalizeTitle(t2);
\t\t}

\t\tfunction containsTitle(str, title){
\t\t\treturn typeof str === 'string' && typeof title === 'string' && normalizeTitle(str).indexOf(normalizeTitle(title)) !== -1;
\t\t}

\t\tfunction showError(error) {
\t\t\tLampa.Noty.show('Рейтинг IMDB: ' + error);
\t\t}

\t\tfunction _getCache(movie) {
\t\t\tvar timestamp = new Date().getTime();
\t\t\tvar cache = Lampa.Storage.cache('imdb_rating', 500, {}); //500 это лимит ключей
\t\t\tif (cache[movie]) {
\t\t\t\tif ((timestamp - cache[movie].timestamp) > params.cache_time) {
\t\t\t\t\t// Если кеш истёк, чистим его
\t\t\t\t\tdelete cache[movie];
\t\t\t\t\tLampa.Storage.set('imdb_rating', cache);
\t\t\t\t\treturn false;
\t\t\t\t}
\t\t\t} else return false;
\t\t\treturn cache;
\t\t}

\t\tfunction _setCache(movie, data) {
\t\t\tvar timestamp = new Date().getTime();
\t\t\tvar cache = Lampa.Storage.cache('imdb_rating', 500, {}); //500 это лимит ключей
\t\t\tif (!cache[movie]) {
\t\t\t\tcache[movie] = data;
\t\t\t\tLampa.Storage.set('imdb_rating', cache);
\t\t\t} else {
\t\t\t\tif ((timestamp - cache[movie].timestamp) > params.cache_time) {
\t\t\t\t\tdata.timestamp = timestamp;
\t\t\t\t\tcache[movie] = data;
\t\t\t\t\tLampa.Storage.set('imdb_rating', cache);
\t\t\t\t} else data = cache[movie];
\t\t\t}
\t\t\treturn data;
\t\t}

\t\tfunction _showRating(data) {
\t\t\tif (data) {
\t\t\t\tvar imdb_rating = !isNaN(data.imdb) && data.imdb !== null ? parseFloat(data.imdb).toFixed(1) : '0.0';
\t\t\t\tvar render = Lampa.Activity.active().activity.render();
\t\t\t\t$('.wait_rating', render).remove();
\t\t\t\t$('.rate--imdb', render).removeClass('hide').find('> div').eq(0).text(imdb_rating);
\t\t\t\t// $('.rate--kp', render).removeClass('hide').find('> div').eq(0).text(kp_rating); // Удален KP
\t\t\t}
\t\t}
\t}

\tfunction startPlugin() {
\t\twindow.rating_plugin = true;
\t\tLampa.Listener.follow('full', function (e) {
\t\t\tif (e.type == 'complite') {
\t\t\t\tvar render = e.object.activity.render();
\t\t\t\tif ($('.rate--imdb', render).hasClass('hide') && !$('.wait_rating', render).length) {
\t\t\t\t\t$('.info__rate', render).after('<div style="width:2em;margin-top:1em;margin-right:1em" class="wait_rating"><div class="broadcast__scan"><div></div></div><div>');
\t\t\t\t\trating_imdb(e.data.movie);
\t\t\t\t}
\t\t\t}
\t\t});
\t}
\tif (!window.rating_plugin) startPlugin();
})();