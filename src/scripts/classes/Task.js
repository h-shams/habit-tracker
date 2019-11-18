class Task {
  constructor(value, date, state='enable', des=null) {
    // TODO: validating inputs
    // TODO: create "change" methode

    this.value = value
    this.id = idGen('Task')
    this.date = date ? date : new Date().toISOString().split('T')[0]
    this.lastChangeDate = new Date().toISOString()
    this.isChanged = true
    this.state = state
    this.des = des
  }

  changeValue(newValue){
    // TODO: create setter instead of this methode
    this.value = newValue
    this.isChanged = true
    this.lastChangeDate = new Date().toISOString()
  }

  changeState(newState){
    // TODO: create setter instead of this methode
    this.state = newState
    this.isChanged = true
    this.lastChangeDate = new Date().toISOString()
  }

  changeDes(newDes){
    // TODO: create setter instead of this methode
    this.des = newDes
    this.isChanged = true
    this.lastChangeDate = new Date().toISOString()
  }
}
