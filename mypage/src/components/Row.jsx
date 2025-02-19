import styles from './Row.module.css'

const Row = ({children}) => {
  return (
    <div className={styles.row}>
      {children}
    </div>
  )
}

export default Row