function idGen (type){
  let lastId, lastIdKey
  // TODO: must have validator
  switch (type) {

    case 'Task':
      lastIdKey = 'lastTaskId'
      break;

    case 'TaskList':
      lastIdKey = 'lastTaskListId'
      break;

    default:
      return null
  }

  lastId = localStorage.getItem(lastIdKey)
  lastId = Number.parseInt(lastId) + 1
  localStorage.setItem(lastIdKey, lastId )

  return lastId
}
