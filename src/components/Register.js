import { useForm } from '../hooks/useForm'
import { Link } from 'react-router-dom'

export default function Register(params) {
  const { values, handleChange, setValues } = useForm({})

  function handleSubmit(e) {
    e.preventDefault()
    // ...
  }

  return (
    <div className="authorization">
      <h1 className="authorization__title">Регистрация</h1>
      <form className="authorization__form" onSubmit={handleSubmit}>
        <Input
          type="email"
          id="login-input"
          name="email"
          placeholder="Email"
          value={values.email || ''}
          onChange={handleChange}
        />
        <Input
          type="password"
          id="password-input"
          name="password"
          placeholder="Пароль"
          value={values.password || ''}
          onChange={handleChange}
        />
      </form>
      <Link to="/sign-in" className="authorization__link">
        Уже зарегистрированы? Войти
      </Link>
    </div>
  )
}
