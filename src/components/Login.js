import { useForm } from '../hooks/useForm'
import Input from './Input'

export default function Login(params) {
  const { values, handleChange, setValues } = useForm({})

  function handleSubmit(e) {
    e.preventDefault()
    // ...
  }

  return (
    <div className="authorization">
      <h1 className="authorization__title">Вход</h1>
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
    </div>
  )
}
