import { FETCH_MOVIES_FOR_EDITING } from '../actions'

export default function (state = null, action) {
  switch (action.type) {
    case FETCH_MOVIES_FOR_EDITING:
      const { data } = action.payload
      const movies = data && data.Items ? data.Items : []
      return movies
    default:
      return state
  }
}
