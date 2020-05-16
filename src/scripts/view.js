const view = {
  create (taskListsArr) {
    // TODO: data validation needed
    const mainElemnet = document.querySelector('.th')

    // checks if there is no task list shows an error
    if (taskListsArr.length === 0) {
      openModale('modale--no-task-list')
      return false
    } else {

    }

    // if weekdays is exist, dont create it again!
    if (document.querySelector('.th__weekdays')) {
      const ul = document.querySelector('.th__weekdays')
      ul.replaceWith(createWeekdays(taskListsArr))
    } else {
      mainElemnet.appendChild(createWeekdays(taskListsArr))
    }

    getMoreSpaceToWeekdays(document.querySelector('.th__weekdays'))

    // if taskListContainer is exist, dont create it again!
    let taskListContainer
    if (document.querySelector('#taskListContainer')) {
      taskListContainer = document.querySelector('#taskListContainer')
    } else {
      taskListContainer = document.createElement('div')
      taskListContainer.id = 'taskListContainer'
      taskListContainer.className = 'task-list-container'
      mainElemnet.appendChild(taskListContainer)
    }

    let oldestDate = Date.now()
    let newestDate = 0
    taskListsArr.forEach(taskList => {
      const length = taskList.nodesArray.length
      const firstDay = Date.parse(taskList.nodesArray[0].date)
      const lastDay = Date.parse(taskList.nodesArray[length - 1].date)
      if (firstDay < oldestDate) {
        oldestDate = firstDay
      }
      if (lastDay > newestDate) {
        newestDate = lastDay
      }
    })

    taskListsArr.forEach(taskList => {
      const length = taskList.nodesArray.length
      const taskListElement = createTaskList(taskList)
      const firstDay = Date.parse(taskList.nodesArray[0].date)
      const lastDay = Date.parse(taskList.nodesArray[length - 1].date)

      if (firstDay > oldestDate) {
        const count = Math.floor((firstDay - oldestDate) / (24 * 60 * 60 * 1000))
        for (let i = 0; i < count; i++) {
          const taskListTaskListElement = taskListElement.children[1]
          const taskElement = createTask(null, true)
          taskListTaskListElement.appendChild(taskElement)
        }
      }

      taskList.nodesArray.forEach(task => {
        const taskListTaskListElement = taskListElement.children[1]
        const taskElement = createTask(task)
        taskListTaskListElement.appendChild(taskElement)
      })

      if (newestDate > lastDay) {
        const count = Math.floor((newestDate - lastDay) / (24 * 60 * 60 * 1000))
        for (let i = 0; i < count; i++) {
          const taskListTaskListElement = taskListElement.children[1]
          const taskElement = createTask(null, true)
          taskListTaskListElement.appendChild(taskElement)
        }
      }

      taskListContainer.appendChild(taskListElement)
    })
    console.log('view created')
  },

  reload (taskListsArr) {
    if (document.getElementById('taskListContainer')) {
      document.getElementById('taskListContainer').innerHTML = ''
    }
    this.create(taskListsArr)
    console.log('view reloaded')
  },

  reloadTask (object) {
    const taskListElements = document.getElementById('taskListContainer').children
    var task = null

    for (let i = 0; i < taskListElements.length; i++) {
      const taskElements = taskListElements[i].children[1].children
      for (let j = 0; j < taskElements.length; j++) {
        const id = Number.parseInt(taskElements[j].id.slice(1))
        if (id === object.id) {
          task = taskElements[j]
        }
      }
    }

    task.classList.remove('task--value-true')
    task.classList.remove('task--value-false')
    task.classList.remove('task--value-none')

    if (object.value === true) {
      task.classList.add('task--value-true')
    } else if (object.value === false) {
      task.classList.add('task--value-false')
    } else if (object.value === 'none') {
      task.classList.add('task--value-none')
    }
  },

  onclick: null,

  createTaskListBtn: {
    onclick: null
  }

}

function createTask (object, isFiller) {
  // TODO: data validation needed
  const task = document.createElement('div')
  task.classList.add('task')
  const circle = document.createElement('div')
  circle.classList.add('task__circle')
  task.appendChild(circle)

  if (isFiller) {
    task.classList.add('task--state-filler')
  } else {
    task.id = 't' + object.id

    if (object.value === true) {
      task.classList.add('task--value-true')
    } else if (object.value === false) {
      task.classList.add('task--value-false')
    } else if (object.value === 'none') {
      task.classList.add('task--value-none')
    }
  }

  return task
}

function createTaskList (object) {
  // TODO: data validation needed
  const taskList = document.createElement('div')
  taskList.classList.add('task-list')
  taskList.id = 'tl' + object.id

  const title = document.createElement('h3')
  title.classList.add('task-list__title')
  title.innerHTML = object.title

  const taskListTaskContainer = document.createElement('div')
  taskListTaskContainer.classList.add('task-list__task-list')

  taskList.appendChild(title)
  taskList.appendChild(taskListTaskContainer)

  return taskList
}

function createWeekdays (object) {
  // TODO: data validation needed
  const weekdays = document.createElement('ul')
  weekdays.classList.add('th__weekdays')

  let firstDate = Date.now()
  let lastDate = 0
  object.forEach(taskList => {
    const length = taskList.nodesArray.length
    const firstDay = Date.parse(taskList.nodesArray[0].date)
    const lastDay = Date.parse(taskList.nodesArray[length - 1].date)
    if (firstDay < firstDate) {
      firstDate = firstDay
    }
    if (lastDay > lastDate) {
      lastDate = lastDay
    }
  })

  const count = Math.floor((lastDate - firstDate) / (24 * 60 * 60 * 1000))
  let date = firstDate
  for (let i = 0; i < count + 1; i++) {
    const weekday = document.createElement('li')
    weekday.classList.add('th__weekday')

    const text = document.createElement('span')
    text.classList.add('th__weekday-text')

    const day = new Date(date).getDate()
    const month = new Date(date).getMonth() + 1
    text.innerHTML = day + '/' + month

    date += 24 * 60 * 60 * 1000

    weekday.appendChild(text)
    weekdays.appendChild(weekday)
  }

  return weekdays
}

function clickHandler (event) {
  let taskElement
  if (event.target.classList.contains('task__circle')) {
    taskElement = event.target.parentElement
  } else {
    return null
  }

  const taskObject = {
    id: Number.parseInt(taskElement.id.slice(1))
  }

  if (taskElement.classList.contains('task--value-true')) {
    taskObject.value = true
  } else if (taskElement.classList.contains('task--value-false')) {
    taskObject.value = false
  } else if (taskElement.classList.contains('task--value-none')) {
    taskObject.value = 'none'
  }

  if (taskElement.classList.contains('task--state-enable')) {
    taskObject.state = 'enable'
  } else if (taskElement.classList.contains('task--state-disable')) {
    taskObject.state = 'disable'
  }

  return taskObject
}

window.addEventListener('click', (event) => {
  const taskObject = clickHandler(event)
  if (taskObject) {
    view.onclick(taskObject)
  }
})

window.addEventListener('resize', () => {
  getMoreSpaceToWeekdays(document.querySelector('.th__weekdays'))
});

document.querySelectorAll('.form__submit-btn').forEach( btn => {
  btn.addEventListener('click', (event) =>{

    if(btn.parentNode.classList.contains('form--create-tasklist')){
      var form = btn.parentNode
      var input = form.querySelector('.input__input')
      let title = input.value

      if(title === ""){
        showError(input.parentNode, "input must not be empty")
        return false
      }

      input.value = ""

      const object = {
        title: title,
        state: 'ok',
        des: null
      }

      view.createTaskListBtn.onclick(object)
      closeModale(form.parentNode)
    }
  })
})

document.querySelectorAll('.btn--create-task-list').forEach(btn => {
  btn.addEventListener('click', (event) => {
    openModale('modale--create-tasklist')
  })
})

document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    closeModale(btn.parentNode)
  })
})

function closeModale (modale) {
  modale.classList.remove('modale--state-active')
  modale.parentNode.classList.remove('modales--state-active')
}

function openModale (className) {
  const modaleContainer = document.querySelector('.modales')
  modaleContainer.classList.add('modales--state-active')
  const modale = document.querySelector('.' + className)
  modale.classList.add('modale--state-active')
}

function showError(input, errorMsg){
  if(!errorMsg || typeof errorMsg !== 'string'){
    throw new Error('errorMassage must be a valid string')
  }

  if(input.querySelector('.input__error-msg')){
    var errorElement = input.querySelector('.input__error-msg')
    errorElement.innerHTML = errorMsg
    input.classList.add('input--state-error')
  }else{
    throw new Error('::input is not a valid "input element"')
  }
}

function removeError(input){
  if(input.querySelector('.input__error-msg')){
    var errorElement = input.querySelector('.input__error-msg')
    errorElement.innerHTML = ""
    input.classList.remove('input--state-error')
  }else{
    throw new Error('input is not a valid "input element"')
  }
}

function getMoreSpaceToWeekdays(ul){
  let width = window.getComputedStyle(ul.parentNode)['width'].split('px')[0]
  if(width > 500){
    ul.style.width = `calc(100% + ${ul.parentNode.scrollLeftMax}px)`
    ul.style.height = ""
  }else{
    ul.style.height = `calc(100% + 3.5em + ${ul.parentNode.scrollTopMax}px)`
    ul.style.width = ""
  }
}

module.exports = view
