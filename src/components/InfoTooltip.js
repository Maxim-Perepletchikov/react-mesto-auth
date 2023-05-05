import message_error from "../images/message_error.svg";
import message_ok from "../images/message_ok.svg";

export default function InfoTooltip({isOpen, onClose, message}) {
  return (
    <div className={`popup popup_type_message ${isOpen && 'popup_opened'}`}>
      <div className="popup__form-container popup__form-container_pos_center ">
        <button
          className="popup__close-button"
          type="button"
          aria-label="Кнопка закрытия"
          onClick={onClose}
        />
        <img className="popup__response-image" src={message.status ? message_ok : message_error} alt="Статус входа и регистрации" />
        <h2 className="popup__title">{message.text}</h2>
      </div>
    </div>
  )
}