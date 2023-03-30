export default function PopupWithForm({
  name,
  title,
  children,
  buttonText,
  isOpen,
  onClose,
  onSubmit,
}) {
  return (
    <div className={`popup popup_type_${name} ${isOpen && 'popup_opened'}`}>
      <div className="popup__form-container">
        <button
          className="popup__close-button"
          type="button"
          aria-label="Кнопка закрытия"
          onClick={onClose}
        />
        <form className="form" onSubmit={onSubmit} name={name}>
          <h2 className="form__title">{title}</h2>
          {children}
          <button className="form__save-button" type="submit">
            {buttonText || 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  )
}
