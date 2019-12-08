
var db = require('./database/database.js');
var Task = require('./classes/Task.js');
var TaskList = require('./classes/TaskList.js');
var view = require('./view.js');

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
  taskClicked(event)
}
view.createTaskListBtn.onclick = event => {
  addNewTaskList(event)
}

function core(){
  console.log(':: CORE ::')
  if(db.getAllData().length > 0){
    db.getAllData().forEach( taskList => {

      let tasksArray = taskList.nodesArray
      let lastDate
      let daysBetween

      if(tasksArray.length === 0){
        lastDate = Date.now() - (24*60*60*1000)
        daysBetween = 1
      }else{
        console.log(taskList.title)
        lastDate = Date.parse(tasksArray[tasksArray.length-1].date)
        console.log('lastDate: '+tasksArray[tasksArray.length-1].date)
        let msBetween = Date.now() - lastDate
        daysBetween = Math.floor(msBetween / (24*60*60*1000))
        console.log('daysBetween: '+daysBetween)
      }

      while (daysBetween > 0) {
        console.log('WHILE: '+daysBetween)
        lastDate += (24*60*60*1000)
        --daysBetween
        let date = new Date(lastDate).toISOString().split('T')[0]
        console.log('WHILE-date: '+ date)
        addTaskToEndTaskList(date, taskList.id)
        console.log('one day is added')
      }
    })
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

function addNewTaskList(object){
  let taskList = new TaskList(object.title, object.des)
  let taskListsIdList = localStorage.getItem('TaskList-id-list')
  taskListsIdList = JSON.parse(taskListsIdList)
  taskListsIdList.push('TaskList-'+taskList.title)

  localStorage.setItem('TaskList-id-list', JSON.stringify(taskListsIdList))
  localStorage.setItem('TaskList-'+taskList.title, JSON.stringify(taskList))

  addTaskToEndTaskList( new Date().toISOString().split('T')[0], taskList.id)

  view.reload(db.getAllData())
}
