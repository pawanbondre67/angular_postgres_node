import { createReducer, on } from "@ngrx/store";
import { initialState } from "./user.store";
import { login, logout } from "./user.actions";


export const userReducer = createReducer(
    initialState,
    on(login, (state, { payload }) => ({
        ...state,
        user: payload.user,
        isLoggedIn: true,
        isLoading: false,
        error: null,
    })

    ),
    on(logout, (state) => ({
        ...state,
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: null,
    })),

    
)
    