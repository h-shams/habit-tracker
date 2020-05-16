
var db = require('./database/database.js');
var Task = require('./classes/Task.js');
var TaskList = require('./classes/TaskList.js');
var view = require('./view.js');
import '../styles/main.scss'

if(db.config.lastTaskId.get() === null){
  db.config.lastTaskId.set(10000000)
}
if(db.config.lastTaskListId.get() === null){
  db.config.lastTaskListId.set(10000000)
}
if(db.config.taskListIdList.get() === null){
  db.config.taskListIdList.set('[]')
}

view.onclick = event => {
  taskClicked(event)
}
view.createTaskListBtn.onclick = event => {
  addNewTaskList(event)
}

function core(){
    if(db.getAllData().length > 0){
    db.getAllData().forEach( taskList => {

      let tasksArray = taskList.nodesArray
      let lastDate
      let daysBetween

      if(tasksArray.length === 0){
        lastDate = Date.now() - (24*60*60*1000)
        daysBetween = 1
      }else{
        lastDate = Date.parse(tasksArray[tasksArray.length-1].date)
        let msBetween = Date.now() - lastDate
        daysBetween = Math.floor(msBetween / (24*60*60*1000))
      }

      while (daysBetween > 0) {
        lastDate += (24*60*60*1000)
        --daysBetween
        let date = new Date(lastDate).toISOString().split('T')[0]
        addTaskToEndTaskList(date, taskList.id)
      }
    })
  }
}

core()
view.create(db.getAllData())

function taskClicked(taskObject) {

  let taskId = taskObject.id
  let task = db.getTaskById(taskId)

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

  db.setTaskById(taskId, task)
  view.reloadTask(task)
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

function addNewTaskList(object){
  let taskList = new TaskList(object.title, object.des)
  let taskListsIdList = db.config.taskListIdList.get()
  taskListsIdList.push('TaskList-'+taskList.title)

  db.addTaskList('TaskList-'+taskList.title, JSON.stringify(taskList))
  db.config.taskListIdList.set(JSON.stringify(taskListsIdList))

  addTaskToEndTaskList( new Date().toISOString().split('T')[0], taskList.id)

  view.reload(db.getAllData())
}
