import { useForm } from '../hooks/useForm'
import FormForLoginRegister from './FormForLoginRegister'
import Input from './Input'

export default function Register({onRegister}) {
  const { values, handleChange, setValues } = useForm()

  const handleSubmit = (e) => {
    e.preventDefault()
    onRegister(values)
  }

  return (
    <div className="auth">
      <FormForLoginRegister
        buttonText="Зарегистрироваться"
        title="Регистрация"
        styleButton="form__save-button_color-white"
        onSubmit={handleSubmit}
        name='register'
      >
        <Input
          type="email"
          id="email-input"
          name="emailInput"
          placeholder="Email"
          style="form__input_color_black"
        />
        <Input
          type="password"
          id="password-input"
          name="passwordInput"
          placeholder="Пароль"
          style="form__input_color_black"
        />
      </FormForLoginRegister>
      <div className="auth__footer">Уже зарегистрированы? Войти</div>
    </div>
  )
}
