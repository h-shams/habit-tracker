export default {
  getAllData () {
    const taskListsArray = []
    const taskListIDs = JSON.parse(localStorage.getItem('taskListIdList'))

    taskListIDs.forEach(taskListId => {
      const taskList = localStorage.getItem(taskListId)
      const newTaskList = JSON.parse(taskList)
      taskListsArray.push(newTaskList)
    })

    return taskListsArray
  },

  saveAllData (object, taskListKey) {
    const json = JSON.stringify(object)
    return localStorage.setItem(taskListKey, json)
  },

  getTaskListById (taskListID) {
    return JSON.parse(localStorage.getItem(taskListID))
  },

  addTaskList (taskListId, taskListObj) {
    localStorage.setItem(taskListId, taskListObj)
  },

  getTaskById (taskId) {
    const taskListIDs = this.config.taskListIdList.get()
    let equalTask

    taskListIDs.forEach(taskListId => {
      const taskListObject = this.getTaskListById(taskListId)

      taskListObject.nodesArray.forEach(task => {
        if (task.id === taskId) {
          equalTask = task
        }
      })
    })

    return equalTask
  },

  setTaskById (taskId, taskObj) {
    const taskListIDs = this.config.taskListIdList.get()
    let equalTaskListId
    let newTaskListObj

    taskListIDs.forEach(taskListId => {
      const taskListObject = this.getTaskListById(taskListId)

      taskListObject.nodesArray.forEach((task, key) => {
        if (task.id === taskId) {
          taskListObject.nodesArray[key] = taskObj
          equalTaskListId = taskListId
          newTaskListObj = JSON.stringify(taskListObject)
        }
      })
    })
    localStorage.setItem(equalTaskListId, newTaskListObj)
  },

  config: {
    lastTaskListId: {
      get () {
        return localStorage.getItem('lastTaskListId')
      },
      set (value) {
        localStorage.setItem('lastTaskListId', value)
      }
    },
    lastTaskId: {
      get () {
        return localStorage.getItem('lastTaskId')
      },
      set (value) {
        localStorage.setItem('lastTaskId', value)
      }
    },
    taskListIdList: {
      get () {
        return JSON.parse(localStorage.getItem('taskListIdList'))
      },
      set (value) {
        localStorage.setItem('taskListIdList', value)
      }
    }
  }

}
