import React from 'react';
import {Navigate, Route} from "react-router-dom";

export default function ProtectedRoute({component: Component, loggedIn, ...props}) {
    return (
        <Route>
            {loggedIn ? <Component {...props} /> : <Navigate to="/sign-in"/>}
        </Route>
    )
}