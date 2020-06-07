self.addEventListener('install', event => {
  console.log('SW: installed')
})

self.addEventListener('activate', event => {
  console.log('SW: actived')
})

self.addEventListener('fetch', event => {
  console.log('SW: fetch for: ' + event.request.url)
})
