import idGen from '../modules/idGenerator.js'

export default class Task {
  constructor (value, date, state = 'enable', des = null) {
    // TODO: validating inputs
    // TODO: create "change" methode

    this.value = value
    this.id = idGen('Task')
    this.date = date || new Date().toISOString().split('T')[0]
    this.lastChangeDate = new Date().toISOString()
    this.isChanged = true
    this.state = state
    this.des = des
  }
}
