/**
 * @param  {initState}
 * @param  {Object} handlers
 * @return {Reducer}
 */
export default function createReducer(initState, handlers) {
  return function reducer(state = initState, action) {
    const handler = handlers[action.type]//handlers对象中的每一个都是一个reducer
    return handler ? handler(state, action) : state
  }
}
