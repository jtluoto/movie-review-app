import { FETCH_MOVIE_FOR_EDITING } from '../actions'

export default function (state = null, action) {
  switch (action.type) {
    case FETCH_MOVIE_FOR_EDITING:
      return action.payload.data.Item
    default:
      return state
  }
}
