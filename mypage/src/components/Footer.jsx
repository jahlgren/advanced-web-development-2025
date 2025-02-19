import Container from './Container'
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container>&copy; 2025</Container>
    </footer>
  )
}

export default Footer