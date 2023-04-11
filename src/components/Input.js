export default function Input({ type, id, name, placeholder, value, onChange, refs, style}) {
  return (
    <div className="form__error-container">
      <input
        className={`form__input ${style}`}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={refs}
        required
      />
      <span className={`form__input-error ${id}-error`}></span>
    </div>
  )
}
