import React from 'react';
import {Redirect, Route} from "react-router-dom";

export default function ProtectedRoute({component: Component, loggedIn, ...props}) {
    return (
        <Route>
            {loggedIn ? <Component {...props} /> : <Redirect to="/sign-in"/>}
        </Route>
    )
}