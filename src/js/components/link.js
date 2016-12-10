import history from '../history.js'

const React = require('react')

const isLeftClickEvent = event =>
  event.button === 0

const isModifiedEvent = event =>
  Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

export default class Link extends React.Component {
  onClick = event => {
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return
    if (event.defaultPrevented === true) return

    event.preventDefault()
    history.push(this.props.to)
  }

  render() {
    const {to, ...props} = this.props
    return <a href={to} onClick={this.onClick} {...props} />
  }
}
