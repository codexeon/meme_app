import * as actions from "../constants/action-types"

const initialState = {
    contacts: [],
    keywords: ""
  };
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CHANGE_KEYWORD:
            return { ...state, keywords: action.payload };
        case actions.GET_CONTACT_LIST:
            return { ...state, contacts: action.payload };
        default:
          return state;
      }
  };

  export default rootReducer;