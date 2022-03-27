//Define the intial state of user state
export const initialState = null;

export const userReducer = (state = initialState, action) => {
    if (action.type == "USER") {
        return action.payload;
    } if (action.type == "LOGOUT") {
        return initialState;
    } else {
        return state;
    }
}