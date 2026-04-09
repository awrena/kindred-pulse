export default function Icon({ name, filled, className = '', size }) {
  const style = filled
    ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
    : {}
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ ...style, fontSize: size }}
    >
      {name}
    </span>
  )
}
