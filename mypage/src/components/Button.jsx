import styles from './Button.module.css'

const Button = ({children, type = 'button', name, onClick, primary}) => {
  return (
    <button type={type} name={name} className={styles.button + (primary ? ' ' + styles.primary : '')} onClick={onClick}>{
      children
    }</button>
  )
}

export default Button