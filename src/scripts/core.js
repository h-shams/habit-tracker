if(localStorage.getItem('lastTaskId') === null){
  localStorage.setItem('lastTaskId', 10000000)
}
if(localStorage.getItem('lastTaskListId') === null){
  localStorage.setItem('lastTaskListId', 10000000)
}
if(localStorage.getItem('TaskList-id-list') === null){
  localStorage.setItem('TaskList-id-list', '[]')
}

function core(){
  if(getAllData().length > 0){
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
}

core()
createView(getAllData())


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
  taskListsArray.forEach( taskList => {
    let task = new Task('none', date)
    taskList.nodesArray.push(task)
    saveAllData(taskList, 'TaskList-' + taskList.title)
  })
}


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

function addNewTaskList(title, des=null){
  let taskList = new TaskList(title, des)
  let taskListsIdList = localStorage.getItem('TaskList-id-list')
  taskListsIdList = JSON.parse(taskListsIdList)
  taskListsIdList.push('TaskList-'+taskList.title)

  localStorage.setItem('TaskList-id-list', JSON.stringify(taskListsIdList))
  localStorage.setItem('TaskList-'+taskList.title, JSON.stringify(taskList))

  reloadView(getAllData())
}

function removeTaskList(id){
  let taskListTitle

  getAllData().forEach( item => {
    if(item.id === id){
      taskListTitle = 'TaskList-' + item.title
    }
  })

  if(typeof taskListTitle !== 'string'){
    console.error('no such a task list to remove!')
    return false
  }

  let taskListsIdList = JSON.parse(localStorage.getItem('TaskList-id-list'))
  let newTaskListsIdList = []

  taskListsIdList.forEach( item => {
    if(item !== taskListTitle){
      newTaskListsIdList.push(item)
    }
  })

  localStorage.removeItem(taskListTitle)
  localStorage.setItem('TaskList-id-list', JSON.stringify(newTaskListsIdList))

  reloadView(getAllData())
  return true
}
