import styles from './Input.module.css'

const Input = ({ 
  type = "text", 
  name = undefined, 
  onChange, value, 
  label = 'Unknown', 
  textarea = false,
  required = false
}) => {
  return (
    <label className={styles.label}>
      <span>{label}</span>
      { textarea ? (
        <textarea 
          rows="6"
          name={name}
          required={required}
          className={styles.input}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        ></textarea>
      ) : (
        <input
          name={name}
          required={required}
          className={styles.input}
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      )}
    </label>
  );
};

export default Input;