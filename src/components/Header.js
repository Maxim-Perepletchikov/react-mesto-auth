import { Route, Routes } from 'react-router-dom'
import logo from '../images/header-logo.svg'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип" />
      <Routes>
        <Route
          path="/sign-up"
          element={
            <Link to={'/sign-in'} className="header__link">
              Войти
            </Link>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Link to={'/sign-up'} className="header__link">
              Регистрация
            </Link>
          }
        />
      </Routes>
    </header>
  )
}
