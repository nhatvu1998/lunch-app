import { createContext } from "react";
export const SWITCH_AUTH_STATUS = "SWITCH_AUTH_STATUS";

export const initialState = {
  isAuthenticated: false
};

export const AppContext = createContext({
  state: initialState,
  dispatch: () => { }
});

export const appReducer = (state, action) => {
  switch (action.type) {
    case SWITCH_AUTH_STATUS:
      return { ...state, isAuthenticated: action.payload.status || false };
    default:
      return state;
  }
};
