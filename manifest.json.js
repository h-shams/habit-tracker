// this file will used in "webpack-pwa-manifest" plugin as options to create
// a manifest.json file for app

module.exports = {
  name: 'Habit Tracker',
  short_name: 'Habit Tracker',
  display: 'fullscreen',
  description: 'An opne-source habit and goal tracker',
  theme_color: '#00abff',
  background_color: '#34bcff',
  start_url: '.',
  icons: [
    {
      src: './src/icons/icon_maskable512.png',
      size: [72, 96, 120, 128, 144, 152, 180, 192, 384, 512],
      purpose: 'any maskable',
      destination: 'icons'
    }
  ],

  // options for 'webpack-pwa-manifest' plugin and not included in output
  // manifest.json
  inject: true,
  fingerprints: false,
}
