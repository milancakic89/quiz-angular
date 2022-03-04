// all urls will be added to cache
function cacheAssets( assets ) {
  return new Promise( function (resolve, reject) {
    // open cache
    caches.open('assets')
      .then(cache => {
        // the API does all the magic for us
        cache.addAll(assets)
          .then(() => {
            resolve()
          })
          .catch(err => {
            reject()
          })
      }).catch(err => {
        reject()
      })
  });
}

var assets = [
  '/assets/images/pirate-theme/headings/footer-wood.png',
  '/assets/images/pirate-theme/headings/heading.png',
  '/assets/images/pirate-theme/headings/main-menu.png',
  '/assets/images/pirate-theme/headings/Shops_Cap.png',
  '/assets/images/pirate-theme/headings/tournament.png',
  '/assets/images/pirate-theme/buttons/Button_Green_Hover.png',
  '/assets/images/pirate-theme/buttons/Button_Green_Normal.png',
  '/assets/images/pirate-theme/buttons/Button_Red_Hover.png',
  '/assets/images/pirate-theme/buttons/Button_Red_Normal.png',
  '/assets/images/pirate-theme/popups/board-with-bomb.png',
  '/assets/images/pirate-theme/popups/daily-rulet.png',
  '/assets/images/pirate-theme/popups/enter-name-2.png',
  '/assets/images/pirate-theme/popups/enter-name.png',
  '/assets/images/pirate-theme/popups/friend-request.png',
  '/assets/images/pirate-theme/popups/Pop_Up_Leaderboard.png',
  '/assets/images/pirate-theme/popups/shop-bg.png',
  '/assets/images/pirate-theme/items/inventory-item.png',
  '/assets/images/new-theme/question-board.png',
]; // list of urls to be cached

// cache responses of provided urls
cacheAssets(assets)
  .then(() => {
      console.log('All assets cached')
  });


// this is the service worker which intercepts all http requests
self.addEventListener('fetch', function fetcher(event) {
    var request = event.request;
    // check if request 
  if (request.url.includes('assets')) {
        // contentful asset detected
        event.respondWith(
            caches.match(event.request).then(function (response) {
                // return from cache, otherwise fetch from network
                return response || fetch(request);
            })
        );
    }
    // otherwise: ignore event
});