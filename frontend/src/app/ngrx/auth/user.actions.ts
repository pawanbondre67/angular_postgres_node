import { createAction } from "@ngrx/store";


export const login = createAction(
   'login',
   (payload: any) => ({ payload })
)

export const logout = createAction(
   'logout',
   (payload: any) => ({ payload })
)

export const register = createAction(
   'register',
   (payload: any) => ({ payload })
)

