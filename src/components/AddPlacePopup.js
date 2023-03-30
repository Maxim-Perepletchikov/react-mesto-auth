import PopupWithForm from './PopupWithForm'
import Input from './Input'
import { useEffect } from 'react'
import { useForm } from '../hooks/useForm'

export default function AddPlacePopup({ isOpen, onAddPlace, onClose, buttonText }) {
  const { values, handleChange, setValues } = useForm({})

  function handleSubmit(e) {
    e.preventDefault()

    // Передаём значения управляемых компонентов во внешний обработчик
    onAddPlace({
      name: values.titleInput,
      link: values.pathInput,
    })
  }

  useEffect(() => {
    setValues({})
  }, [isOpen])

  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      buttonTitle="Создать"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={buttonText}
    >
      <Input
        type="text"
        id="title-input"
        name="titleInput"
        placeholder="Название"
        value={values.titleInput || ''}
        onChange={handleChange}
      />
      <Input
        type="url"
        id="path-input"
        name="pathInput"
        placeholder="Ссылка на картинку"
        value={values.pathInput || ''}
        onChange={handleChange}
      />
    </PopupWithForm>
  )
}
