import * as actions from "../constants/action-types";

export const changeKeyword = keyword => ({ type: actions.CHANGE_KEYWORD, payload: keyword });
export const getContactList = contacts => ({ type: actions.GET_CONTACT_LIST, payload: contacts });