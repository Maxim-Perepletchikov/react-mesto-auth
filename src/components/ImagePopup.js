export default function ImagePopup({card, onClose}) {
  return (
    <div className={`popup popup_type-image ${card.isOpen && 'popup_opened'}`}>
      <div className="popup__form-container popup__form-container_type_image">
        <img className="popup__image" src={card.link} alt={card.name} />
        <p className="popup__image-title">{card.name}</p>
        <button
          className="popup__close-button"
          type="button"
          aria-label="Кнопка закрытия"
          onClick={onClose}
        ></button>
      </div>
    </div>
  )
}
