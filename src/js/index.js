import history from './history.js'
import Router from './router.js'
import routes from '../routes.json'
import Root from './components/root.js'

const React = require('react')
const ReactDOM = require('react-dom')

// for browserify
if (process.title === 'browser') {
  require('./components/home').default
  require('./components/about').default
}

const after = (n, func) => (...args) => {
  if (--n < 1) func(...args)
}

const scrollPositionsHistory = new Map()
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const onRenderComplete = after(2, (route, location) => {
  document.title = route.title

  let scrollX = 0
  let scrollY = 0
  const position = scrollPositionsHistory.get(location.key)

  if (position) {
    scrollX = position.scrollX
    scrollY = position.scrollY
  } else {
    const targetHash = location.hash.substring(1)
    if (targetHash) {
      const target = document.getElementById(targetHash)
      if (target) {
        scrollY = window.pageYOffset + target.getBoundingClientRect().top
      }
    }
  }

  window.scrollTo(scrollX, scrollY)
})

const mountNode = document.querySelector('#root')
let currentLocation = history.location

const onLocationChange = (location, action) => {
  scrollPositionsHistory.set(currentLocation.key, {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  })
  currentLocation = location

  const route = Router.resolve(routes, location)
  const Page = require(route.page).default
  const component = <Page />

  ReactDOM.render(
    <Root location={location}>{component}</Root>,
    mountNode,
    () => onRenderComplete(route, location)
  )
}

history.listen(onLocationChange)
onLocationChange(currentLocation, history.action)
