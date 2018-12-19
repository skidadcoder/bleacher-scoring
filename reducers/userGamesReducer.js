import { USER_GAMES_FETCH_SUCCESS, USER_GAMES_FETCH_START, USER_GAMES_CLEAR } from "./types";

const INITIAL_STATE = {
  data: {},
  userGamesFetchStart: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_GAMES_FETCH_START:
      return { ...state, data: {}, userGamesFetchStart: true };
    case USER_GAMES_FETCH_SUCCESS:
      return { ...state, data: action.payload, userGamesFetchStart: false };
    default:
      return state;
  }
};
