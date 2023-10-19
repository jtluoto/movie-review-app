import { FETCH_MOVIES } from '../actions'

export default function (state = null, action) {
  switch (action.type) {
    case FETCH_MOVIES:
      return action.payload.data.Items
    default:
      return state
  }
}
