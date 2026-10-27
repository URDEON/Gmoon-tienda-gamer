// Un campo con su etiqueta, su input y su mensaje de error.
// "children" permite poner algo debajo del input (por ejemplo, el botón de mostrar contraseña).
function CampoFormulario({ name, label, type = 'text', value, onChange, onBlur, placeholder, error, children }) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`${name}-error`}
      />
      {children}
      <p className="mensaje-error" id={`${name}-error`}>{error}</p>
    </>
  )
}

export default CampoFormulario