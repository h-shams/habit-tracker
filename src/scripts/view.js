let view = {
  create(taskListsArr){
    // TODO: data validation needed
    let mainElemnet = document.querySelector('.th')

    //checks if there is no task list shows an error
    if(taskListsArr.length === 0){
      mainElemnet.classList.add('th--no-tl-error')
      return false
    }else{
      mainElemnet.classList.remove('th--no-tl-error')
    }

    //if weekdays is exist, dont create it again!
    if(document.querySelector('.th__weekdays')){
      let ul = document.querySelector('.th__weekdays')
      ul.replaceWith(createWeekdays(taskListsArr))
    }else{
      mainElemnet.appendChild(createWeekdays(taskListsArr))
    }

    //if taskListContainer is exist, dont create it again!
    let taskListContainer
    if(document.querySelector('#taskListContainer')){
      taskListContainer = document.querySelector('#taskListContainer')
    }else{
      taskListContainer = document.createElement('div')
      taskListContainer.id = 'taskListContainer'
      mainElemnet.appendChild(taskListContainer)
    }

    let oldestDate = Date.now()
    let newestDate = 0
    taskListsArr.forEach( taskList => {
      let length = taskList.nodesArray.length
      let firstDay = Date.parse(taskList.nodesArray[0].date)
      let lastDay = Date.parse(taskList.nodesArray[length - 1].date)
      if(firstDay < oldestDate){
        oldestDate = firstDay
      }
      if(lastDay > newestDate){
        newestDate = lastDay
      }
    })
    console.log('oldest:' + new Date(oldestDate))
    console.log('newest:' + new Date(newestDate))

    taskListsArr.forEach( taskList => {
      let length = taskList.nodesArray.length
      let taskListElement = createTaskList(taskList)
      let firstDay = Date.parse(taskList.nodesArray[0].date)
      let lastDay = Date.parse(taskList.nodesArray[length - 1].date)
      console.log('firstDay: ' + new Date(firstDay))
      console.log('lastDay: ' + new Date(lastDay))
      // console.log('IF: ')
      // console.log(firstDay > oldestDate)

      if(firstDay > oldestDate){
        let count = Math.floor((firstDay - oldestDate) / (24*60*60*1000))
        console.log('firstday is less than newest day :' + count);
        for (let i = 0; i < count; i++) {
          let taskListTaskListElement = taskListElement.children[1]
          let taskElement = createTask(null, true)
          taskListTaskListElement.appendChild(taskElement)
        }
      }

      taskList.nodesArray.forEach( task => {
        let taskListTaskListElement = taskListElement.children[1]
        let taskElement = createTask(task)
        taskListTaskListElement.appendChild(taskElement)
      })

      if(newestDate > lastDay){
        let count = Math.floor((newestDate - lastDay) / (24*60*60*1000))
        for (let i = 0; i < count; i++) {
          let taskListTaskListElement = taskListElement.children[1]
          let taskElement = createTask(null, true)
          taskListTaskListElement.appendChild(taskElement)
        }
      }

      taskListContainer.appendChild(taskListElement)
    })
    console.log('view created')
  },

  reload(taskListsArr) {
    if(document.getElementById('taskListContainer')){
      document.getElementById('taskListContainer').innerHTML = ''
    }
    this.create(taskListsArr)
    console.log('view reloaded')
  },

  reloadTask(object) {
    let taskListElements = document.getElementById('taskListContainer').children
    var task = null

    for (let i = 0; i < taskListElements.length; i++) {
      let taskElements = taskListElements[i].children[1].children
      for (let j = 0; j < taskElements.length; j++) {
        let id = Number.parseInt(taskElements[j].id.slice(1))
        // console.log(taskElements[j].id +" : "+ id)
        if(id === object.id){
          task = taskElements[j]
        }
      }
    }

  task.classList.remove('task--value-true')
  task.classList.remove('task--value-false')
  task.classList.remove('task--value-none')

  if(object.value === true){
    task.classList.add('task--value-true')
  }else if(object.value === false){
    task.classList.add('task--value-false')
  }else if(object.value === 'none'){
    task.classList.add('task--value-none')
  }
},

  onclick: null,

  createTaskListBtn: {
    onclick: null
  }

}

function createTask(object, isFiller) {
  // TODO: data validation needed
  let task = document.createElement('div')
  task.classList.add('task')
  let circle = document.createElement('div')
  circle.classList.add('task__circle')
  task.appendChild(circle)

  if(isFiller){
    task.classList.add('task--state-filler')
  }else{
    task.id = 't' + object.id

    if(object.value === true){
      task.classList.add('task--value-true')
    }else if(object.value === false){
      task.classList.add('task--value-false')
    }else if(object.value === 'none'){
      task.classList.add('task--value-none')
    }
  }

  return task
}

function createTaskList(object) {
  // TODO: data validation needed
  let taskList = document.createElement('div')
  taskList.classList.add('task-list')
  taskList.id = 'tl' + object.id

  let title = document.createElement('h3')
  title.classList.add('task-list__title')
  title.innerHTML = object.title

  let taskListTaskContainer = document.createElement('div')
  taskListTaskContainer.classList.add('task-list__task-list')

  taskList.appendChild(title)
  taskList.appendChild(taskListTaskContainer)

  return taskList
}

function createWeekdays(object) {
  // TODO: data validation needed
  let mainElemnet = document.querySelector('.th')
  let weekdays

  if(document.querySelector('.th__weekdays')){
    weekdays = document.querySelector('.th__weekdays')
  }else{
    weekdays = document.createElement('ul')
    weekdays.classList.add('th__weekdays')
  }

  for (var i = 0; i < weekdays.children.length; i++) {
    weekdays.removeChild(weekdays.children[i])
  }

  let firstDate = Date.now()
  let lastDate = 0
  object.forEach( taskList => {
    let length = taskList.nodesArray.length
    let firstDay = Date.parse(taskList.nodesArray[0].date)
    let lastDay = Date.parse(taskList.nodesArray[length - 1].date)
    if(firstDay < firstDate){
      firstDate = firstDay
    }
    if(lastDay > lastDate){
      lastDate = lastDay
    }
  })

  let count = Math.floor((lastDate - firstDate) / (24*60*60*1000))
  let date = firstDate
  for (let i = 0; i < count + 1; i++) {
    let weekday = document.createElement('li')
    weekday.classList.add('th__weekday')

    let text = document.createElement('span')
    text.classList.add('th__weekday-text')
    let day = new Date(date).getDate()
    let month = new Date(date).getMonth() + 1
    text.innerHTML = day + '/' + month

    date += 24*60*60*1000

    weekday.appendChild(text)
    weekdays.appendChild(weekday)
  }

  return weekdays
}

function clickHandler(event) {
  let taskElement
  if(event.target.classList.contains('task__circle')){
    taskElement = event.target.parentElement
  }else{
    return null
  }

  let taskObject = {
    id: Number.parseInt(taskElement.id.slice(1)),
  }

  if(taskElement.classList.contains('task--value-true')){
    taskObject.value = true
  }else if(taskElement.classList.contains('task--value-false')){
    taskObject.value = false
  }else if(taskElement.classList.contains('task--value-none')){
    taskObject.value = 'none'
  }

  if(taskElement.classList.contains('task--state-enable')){
    taskObject.state = 'enable'
  }else if(taskElement.classList.contains('task--state-disable')){
    taskObject.state = 'disable'
  }

  return taskObject
}

window.addEventListener('click', (event) =>{
  let taskObject = clickHandler(event)
  if(taskObject){
    view.onclick(taskObject)
  }
})

document.querySelectorAll('.form__submit-btn').forEach( btn => {
  btn.addEventListener('click', (event) =>{
    let input
    if(btn.parentNode.classList.contains('form--create-tasklist')){
      var form = btn.parentNode
      input = form.querySelector('.input__input')
      let title = input.value
      input.value = ""

      let object = {
        title: title,
        state: 'ok',
        des: null
      }

      view.createTaskListBtn.onclick(object)

      closeModale(form.parentNode)
    }
  })
})

document.querySelectorAll('.btn--create-task-list').forEach( btn => {
  btn.addEventListener('click', (event) => {
    openModale('modale--create-tasklist')
  })
})

document.querySelectorAll('.close-btn').forEach( btn => {
  btn.addEventListener('click', () => {
    closeModale(btn.parentNode)
  })
})

function closeModale(modale){
  modale.classList.remove('modale--state-active')
  modale.parentNode.classList.remove('modales--state-active')
}

function openModale(className){
  let modaleContainer = document.querySelector('.modales')
  modaleContainer.classList.add('modales--state-active')
  let modale = document.querySelector("." + className)
  modale.classList.add('modale--state-active')
}

export default view
