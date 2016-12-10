import {SITE_TITLE as baseTitle} from './constants.js'

const path = require('path')

export default class Router {
  static resolve(routes, context) {
    const route = routes.find(route => route.path === context.pathname)
    if (!route) throw new Error('Not found route')

    route.title = route.title ? `${route.title} - ${baseTitle}`: baseTitle
    return route
  }
}
