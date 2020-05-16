import '../styles/main.scss'
import db from './database/database.js'
import Task from './classes/Task.js'
import TaskList from './classes/TaskList.js'
import view from './view.js'

if (db.config.lastTaskId.get() === null) {
  db.config.lastTaskId.set(10000000)
}
if (db.config.lastTaskListId.get() === null) {
  db.config.lastTaskListId.set(10000000)
}
if (db.config.taskListIdList.get() === null) {
  db.config.taskListIdList.set('[]')
}

view.onclick = event => {
  taskClicked(event)
}
view.createTaskListBtn.onclick = event => {
  addNewTaskList(event)
}

function core () {
  if (db.getAllData().length > 0) {
    db.getAllData().forEach(taskList => {
      const tasksArray = taskList.nodesArray
      let lastDate
      let daysBetween

      if (tasksArray.length === 0) {
        lastDate = Date.now() - (24 * 60 * 60 * 1000)
        daysBetween = 1
      } else {
        lastDate = Date.parse(tasksArray[tasksArray.length - 1].date)
        const msBetween = Date.now() - lastDate
        daysBetween = Math.floor(msBetween / (24 * 60 * 60 * 1000))
      }

      while (daysBetween > 0) {
        lastDate += (24 * 60 * 60 * 1000)
        --daysBetween
        const date = new Date(lastDate).toISOString().split('T')[0]
        addTaskToEndTaskList(date, taskList.id)
      }
    })
  }
}

core()
view.create(db.getAllData())

function taskClicked (taskObject) {
  const taskId = taskObject.id
  const task = db.getTaskById(taskId)

  if (task.value === true) {
    task.value = false
    task.isChanged = true
    task.lastChangeDate = new Date().toISOString()
  } else if (task.value === false) {
    task.value = true
    task.isChanged = true
    task.lastChangeDate = new Date().toISOString()
  } else if (task.value === 'none') {
    task.value = true
    task.isChanged = true
    task.lastChangeDate = new Date().toISOString()
  }

  db.setTaskById(taskId, task)
  view.reloadTask(task)
}

function addTaskToEndTaskList (date, taskListId) {
  let taskListsArray
  if (taskListId) {
    db.getAllData().forEach(item => {
      if (item.id === taskListId) {
        taskListsArray = []
        taskListsArray.push(item)
      }
    })
  } else {
    taskListsArray = db.getAllData()
  }

  taskListsArray.forEach(taskList => {
    const task = new Task('none', date)
    taskList.nodesArray.push(task)
    db.saveAllData(taskList, 'TaskList-' + taskList.title)
  })
}

function addNewTaskList (object) {
  const taskList = new TaskList(object.title, object.des)
  const taskListsIdList = db.config.taskListIdList.get()
  taskListsIdList.push('TaskList-' + taskList.title)

  db.addTaskList('TaskList-' + taskList.title, JSON.stringify(taskList))
  db.config.taskListIdList.set(JSON.stringify(taskListsIdList))

  addTaskToEndTaskList(new Date().toISOString().split('T')[0], taskList.id)

  view.reload(db.getAllData())
}
