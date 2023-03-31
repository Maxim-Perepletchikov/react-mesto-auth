import React from 'react'
import { Navigate, Route } from 'react-router-dom'

export default function ProtectedRoute({
  component: Component,
  loggedIn,
  ...props
}) {
  return loggedIn ? <Component {...props} /> : <Navigate to="/sign-in" />
}
