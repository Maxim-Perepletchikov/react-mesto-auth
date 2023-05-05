import PopupWithForm from './PopupWithForm'
import Input from './Input'
import { useContext, useEffect } from 'react'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import { useForm } from '../hooks/useForm'

export default function EditProfilePopup({
  isOpen,
  onClose,
  onUpdateUser,
  buttonText,
}) {
  const currentUser = useContext(CurrentUserContext)

  const { values, handleChange, setValues } = useForm({})

  function handleSubmit(e) {
    e.preventDefault()

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name: values.titleNameInput,
      about: values.aboutInput,
    })
  }

  useEffect(() => {
    setValues({
      ...values,
      titleNameInput: currentUser.name,
      aboutInput: currentUser.about,
    })
  }, [currentUser, isOpen])

  return (
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={buttonText}
    >
      <Input
        type="text"
        id="name-input"
        name="titleNameInput"
        placeholder="Имя"
        value={values.titleNameInput || ''}
        onChange={handleChange}
      />
      <Input
        type="text"
        id="job-input"
        name="aboutInput"
        placeholder="О себе"
        value={values.aboutInput || ''}
        onChange={handleChange}
      />
    </PopupWithForm>
  )
}
