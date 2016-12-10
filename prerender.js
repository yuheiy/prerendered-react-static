import Router from './src/js/router.js'
import routes from './src/routes.json'
import Root from './src/js/components/root.js'

const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const pug = require('pug')
const React = require('react')
const ReactDOM = require('react-dom/server')

const compiler = pug.compileFile('src/template.pug')
mkdirp.sync('dist')

routes.forEach(({path: pathname}) => {
  const location = {pathname}
  const route = Router.resolve(routes, location)
  const Page = require(`./${path.join('src/js', route.page)}`).default
  const component = <Page />
  const markup = ReactDOM.renderToString(<Root location={location}>{component}</Root>)
  const locals = {
    title: route.title,
    markup,
  }
  const result = compiler(locals)
  const filename = route.path.replace(/\/$/, '/index.html')

  fs.writeFileSync(path.join('dist', filename), result, 'utf8')
})
