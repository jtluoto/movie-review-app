import { SCHEDULE_LOADING, SCHEDULE_FETCHED } from '../actions'

export default function (state = null, action) {
  switch (action.type) {
    case SCHEDULE_LOADING:
      return null
    case SCHEDULE_FETCHED:
      return action.payload
    default:
      return state
  }
}
