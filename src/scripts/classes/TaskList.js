var idGen = require('../modules/idGenerator.js');

module.exports = class TaskList {
  constructor(title, des) {
    // TODO: validating inputs
    // TODO: create "change" methode

    this.nodesArray = []
    this.title = title
    this.id = idGen('TaskList')
    this.isChanged = true
    this.lastChangeDate = new Date().toISOString()
    this.creationDate = new Date().toISOString().split('T')[0]
    this.des = des
  }
}
