import casPlugin from "../modules/auth/cas.mjs"
import loginPlugin from "../modules/auth/login.mjs"
import logoutPlugin from "../modules/auth/logout.mjs"

export default async function authPlugin(app, opts) {
    app.register(loginPlugin)  
    app.register(casPlugin)                
    app.register(logoutPlugin)
}