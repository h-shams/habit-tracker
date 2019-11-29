import db from './database/database.js'
import Task from './classes/Task.js'
import TaskList from './classes/TaskList.js'
import view from './view.js'

if(localStorage.getItem('lastTaskId') === null){
  localStorage.setItem('lastTaskId', 10000000)
}
if(localStorage.getItem('lastTaskListId') === null){
  localStorage.setItem('lastTaskListId', 10000000)
}
if(localStorage.getItem('TaskList-id-list') === null){
  localStorage.setItem('TaskList-id-list', '[]')
}

view.onclick = event => {
  console.log(event)
  taskClicked(event)
}

function core(){
  if(db.getAllData().length > 0){
    let tasksArray = db.getAllData()[0].nodesArray
    let lastChangeDate
    if(tasksArray.length === 0){
      lastChangeDate = Date.now()
    }else{
      lastChangeDate = Date.parse(tasksArray[tasksArray.length-1].date)
    }
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
view.create(db.getAllData())

function taskClicked(taskObject) {
  let id = taskObject.id
  // id = Number.parseInt(id)

  let taskListsArray = []
  let taskListIDs = JSON.parse(localStorage.getItem('TaskList-id-list'))

  taskListIDs.forEach( taskList => {

    let taskListJson = localStorage.getItem(taskList)
    let taskListObject = JSON.parse(taskListJson)
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
        db.saveAllData(taskListObject, taskList)
        view.reloadTask(task)
      }
    })

  })
}

function addTaskToEndTaskList(date, taskListId){
  let taskListsArray
  if(taskListId){
    db.getAllData().forEach( item => {
      if(item.id === taskListId){
        taskListsArray = []
        taskListsArray.push(item)
      }
    })
  }else{
    taskListsArray = db.getAllData()
  }

  taskListsArray.forEach( taskList => {
    let task = new Task('none', date)
    taskList.nodesArray.push(task)
    db.saveAllData(taskList, 'TaskList-' + taskList.title)
  })
}

function addNewTaskList(title, des=null){
  let taskList = new TaskList(title, des)
  let taskListsIdList = localStorage.getItem('TaskList-id-list')
  taskListsIdList = JSON.parse(taskListsIdList)
  taskListsIdList.push('TaskList-'+taskList.title)

  localStorage.setItem('TaskList-id-list', JSON.stringify(taskListsIdList))
  localStorage.setItem('TaskList-'+taskList.title, JSON.stringify(taskList))

  addTaskToEndTaskList( new Date().toISOString().split('T')[0], taskList.id)

  view.reload(db.getAllData())
}

function removeTaskList(id){
  let taskListTitle

  db.getAllData().forEach( item => {
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

  view.reload(db.getAllData())
  return true
}
