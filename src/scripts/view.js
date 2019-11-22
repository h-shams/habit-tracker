function createView(taskListsArr){

  // TODO: data validation needed
  let taskListContainer = document.getElementById('taskListContainer')
  taskListsArr = JSON.parse(taskListsArr)

  taskListsArr.forEach( taskList => {
    let taskListElement = createTaskList(taskList)

    taskList.nodesArray.forEach( task => {
      let taskListTaskListElement = taskListElement.children[1]
      let taskElement = createTask(task)
      taskListTaskListElement.appendChild(taskElement)
    })

  taskListContainer.appendChild(taskListElement)
  })
}

function createTask(object) {
  // TODO: data validation needed
  let task = document.createElement('div')
  task.classList.add('task')
  task.id = 't' + object.id
  let circle = document.createElement('div')
  circle.classList.add('task__circle')
  task.appendChild(circle)

  if(object.value === true){
    task.classList.add('task--value-true')
  }else if(object.value === false){
    task.classList.add('task--value-false')
  }else if(object.value === 'none'){
    task.classList.add('task--value-none')
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

window.addEventListener('click', (event) =>{
  let taskObject = clickHandler(event)
  if(taskObject){
    // send taskObject to core.js
  }
})

function clickHandler(event) {
  let taskElement
  if(event.target.classList.contains('task__circle')){
    taskElement = event.target.parentElement
  }else{
    return undefined
  }

  let taskObject = {
    id: taskElement.id,
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


}
