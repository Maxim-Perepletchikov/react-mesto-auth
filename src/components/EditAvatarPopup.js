import PopupWithForm from './PopupWithForm'
import Input from './Input'
import { useRef } from 'react'

export default function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, buttonText }) {
  const avatar = useRef()

  function handleSubmit(e) {
    e.preventDefault()

    onUpdateAvatar(avatar.current.value)
  }

  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={buttonText}
    >
      <Input
        refs={avatar}
        type="url"
        id="avatar-input"
        name="pathAvatar"
        placeholder="Ссылка на аватар"
      />
    </PopupWithForm>
  )
}
