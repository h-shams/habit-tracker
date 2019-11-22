function getAllData() {
  let taskListsArray = []
  let taskListIDs = JSON.parse(localStorage.getItem('TaskList-id-list'))

  taskListIDs.forEach( item => {

    let taskList = localStorage.getItem(item)
    taskList = JSON.parse(taskList)
    taskListsArray.push(taskList)

  })

  return taskListsArray
}

function saveAllData(object, taskListKey){
  let json = JSON.stringify(object)
  return localStorage.setItem(taskListKey, json)
}



createView(getAllData())

function taskClicked(taskObject) {
  let id = taskObject.id
  // id = Number.parseInt(id)

  let taskListsArray = []
  let taskListIDs = JSON.parse(localStorage.getItem('TaskList-id-list'))

  taskListIDs.forEach( taskList => {

    taskListJson = localStorage.getItem(taskList)
    taskListObject = JSON.parse(taskListJson)
    taskListObject.nodesArray.forEach( task => {
      if(task.id === id){
        if(task.value === true){
          task.value = false
          task.isChanged = true
          task.lastChangeDate = new Date().toISOString()
        }else if(task.value === false){
          task.value = true
          task.isChanged = true
          task.lastChangeDate = new Date().toISOString()
        }else if(task.value === 'none'){
          task.value = true
          task.isChanged = true
          task.lastChangeDate = new Date().toISOString()
        }
        saveAllData(taskListObject, taskList)
        reloadTask(task)
      }
    })

  })
}
