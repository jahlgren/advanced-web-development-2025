import styles from './Container.module.css'

const Container = ({children, id, component='div'}) => {
  const C = component
  return (
    <C className={styles.container} id={id}>
      {children}
    </C>
  )
}

export default Container