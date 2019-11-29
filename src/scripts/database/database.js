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
