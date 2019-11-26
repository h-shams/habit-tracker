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


function addTaskToEndTaskList(date){
  let taskListsArray = getAllData()
  let i = 0
  taskListsArray.forEach( taskList => {
    let task = new Task('none', date)
    taskList.nodesArray.push(task)
    saveAllData(taskList, JSON.parse(localStorage.getItem('TaskList-id-list'))[i])
    i++
  })
}

function core(){
  let tasksArray = getAllData()[0].nodesArray
  let lastChangeDate = Date.parse(tasksArray[tasksArray.length-1].date)
  let msBetween = Date.now() - lastChangeDate
  let daysBetween = Math.floor(msBetween / (24*60*60*1000))

  while (daysBetween > 0) {
    let date = new Date(lastChangeDate).toISOString().split('T')[0]
    addTaskToEndTaskList(date)
    lastChangeDate += (24*60*60*1000)
    --daysBetween
    console.log('one day is added')
  }
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
