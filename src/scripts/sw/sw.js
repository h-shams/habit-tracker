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
