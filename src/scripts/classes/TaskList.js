class TaskList {
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

  addTask(task){
    // TODO: validating inputs
    this.nodesArray.push(task)
    this.isChanged = true
    this.lastChangeDate = new Date().toISOString()
  }

  changeDes(newDes){
    // TODO: create setter instead of this methode
    this.des = newDes
    this.isChanged = true
    this.lastChangeDate = new Date().toISOString()
  }

  changeTitle(newTitle){
    // TODO: create setter instead of this methode
    this.title = newTitle
    this.isChanged = true
    this.lastChangeDate = new Date().toISOString()
  }
}
