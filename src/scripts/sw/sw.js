const ENV = __ENV__

self.addEventListener('install', event => {
  console.log('SW: installed')
  console.log(`SW: base url is "${ENV.baseUrl}"`)
})

self.addEventListener('activate', event => {
  console.log('SW: actived')
})

self.addEventListener('fetch', event => {
  console.log('SW: fetch for: ' + event.request.url)
})

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
