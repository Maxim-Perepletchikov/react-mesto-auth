import PopupWithForm from './PopupWithForm'

export default function CardDeletePopup({ isOpen, onClose, onCardDelete, card }) {
  function handleSubmit(e) {
    e.preventDefault()

    onCardDelete(card)
  }


  return (
    <PopupWithForm
      name="cardDelete"
      title="Вы уверены?"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText='Да'
    />
  )
}