const ENV = __ENV__
const CACHE_NAME = 'habit-tracker-cache'

self.addEventListener('install', event => {
  console.log('SW: installed')
  console.log(`SW: base url is "${ENV.baseUrl}"`)
  event.waitUntil(cacheNewFiles(true))
})

self.addEventListener('activate', event => {
  console.log('SW: actived')
})

self.addEventListener('fetch', event => {
  console.log('SW: fetch for: ' + event.request.url)

  let url
  // checks if root ("/") is requested
  if (urlSlicer(event.request.url) === '') {
    console.log(' ')
    url = ENV.baseUrl + 'index.html'
  } else {
    url = event.request.url
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(url).then(response => {
        console.log(
          'SW: GET ' + urlSlicer(url), response ? '--- cache' : '--- fetched'
        )
        return response || fetch(url)
      })
    })
  )

})

function deleteOldCaches () {
  // NOTE: this function uses "assets.json" that cached instead of fetching new
  // "assets.json" because fetching the new "assets.json" may cause some caches
  // delete when they are in use
  return new Promise((resolve, reject) => {
    let a = []
    caches.open(CACHE_NAME).then(cache => {
      cache.keys().then(keys => {
        cache.match('assets.json').then(res => {
          res.json().then(assets => {
            // to prevent deleting "assets.json"
            assets.push({ url: 'assets.json' })
            inCacheButAssets(assets, keys).then(comparison => {
              comparison.forEach(oldCache => {
                cache.delete(oldCache)
              })
              a = comparison
              console.log('SW: folowing item Deleted ')
              console.log(comparison)
            })
          })
        }).catch(err => {
          console.log(err)
          console.log('SW: there is no "assets.json" in cache;')
        })
      })
    })
    resolve(a)
  })
}

function cacheNewFiles (cacheAssets = false) {
  return caches.open(CACHE_NAME).then(cache => {
    return fetch(ENV.baseUrl + 'assets.json').then(response => {
      return response.json().then(assets => {
        return cache.match('assets.json').then(res => {
          return res.json().then(oldAssets => {
            return inAssetsButCache(assets, oldAssets).then(comparison => {
              console.log('SW: assets')
              console.log(assets)
              console.log('SW: oldAssets')
              console.log(oldAssets)
              console.log('SW: comp')
              console.log(comparison)
              return cache.addAll(comparison).then(() => {
                if (cacheAssets) {
                  cache.add('assets.json').then(() => {
                    console.log('SW: cached assets.json')
                  })
                }
                console.log('SW: folowing items are cached')
                console.log(comparison)
              })
            })
          })
        }).catch(err => {
          console.log(err)
          cache.add('assets.json').then(() => {
            console.log('SW: cached assets.json')
          })
          assets.forEach(assetsEntry => {
            cache.add(assetsEntry.url).then(() => {
              console.log('SW: cached ' + assetsEntry.url)
            })
          })
        })
      })
    })
  })
}

function inCacheButAssets (assetsList, cacheList) {
  return new Promise((resolve, reject) => {
    if (!(assetsList && cacheList)) {
      reject(new Error('two argunment must passed'))
    }

    const arr = []
    cacheList.forEach(cacheEntry => {
      let isFound = null
      assetsList.forEach(assetsEntry => {
        if (cacheEntry.url === assetsEntry.url) {
        if (urlSlicer(cacheEntry.url) === assetsEntry.url) {
          isFound = true
        }
      })
      if (isFound === null) {
        arr.push(cacheEntry.url)
        arr.push(urlSlicer(cacheEntry.url))
      }
    })
    resolve(arr)
  })
}

function inAssetsButCache (assetsList, cacheList) {
  return new Promise((resolve, reject) => {
    if (!(assetsList && cacheList)) {
      reject(new Error('two argunment must passed'))
    }

    const arr = []
    assetsList.forEach(assetsEntry => {
      let isFound = null
      cacheList.forEach(cacheEntry => {
        if (cacheEntry.url === assetsEntry.url) {
          if (cacheEntry.revision === assetsEntry.revision) {
            isFound = true
          } else {
            isFound = 'changed'
          }
        }
      })
      if (isFound === null) {
        arr.push(assetsEntry.url)
      } else if (isFound === 'changed') {
        arr.push(assetsEntry.url)
      } else {
      }
    })
    resolve(arr)
  })
}

function urlSlicer (url) {
  const baseUrlLength = ENV.baseUrl.length
  return url.slice(baseUrlLength)
}
