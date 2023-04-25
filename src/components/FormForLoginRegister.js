export default function FormForLoginRegister({
  onSubmit,
  buttonText,
  children,
  title,
  styleButton,
  name
}) {
  return (
    <form className="form" onSubmit={onSubmit} name={name}>
      <h2 className="form__title form__title_color_white">{title}</h2>
      {children}
      <button className={`form__save-button ${styleButton}`} type="submit">
        {buttonText}
      </button>
    </form>
  )
}
