import styles from './Header.module.css'
import Container from './Container'
import Logo from './Logo'

const Header = () => {
  return (
    <header className={styles.header}>
      <Container>
        <Logo />
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header