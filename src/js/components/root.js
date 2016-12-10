import Link from './link.js'
import {SITE_TITLE as title} from '../constants.js'

const React = require('react')

export default class Root extends React.Component {
  render() {
    const {
      location,
      children,
    } = this.props

    return <div>
      <header>
        <h1>{title}</h1>
        <p>currentPath: {location.pathname}</p>
        <nav>
          <ul>
            {[
              ['/', 'Home'],
              ['/about.html', 'About'],
            ].map(([to, name]) =>
              <li key={to}>
                {to === location.pathname ? name : (
                  <Link to={to}>{name}</Link>
                )}
              </li>
            )}
          </ul>
        </nav>
      </header>

      {children}
    </div>
  }
}
