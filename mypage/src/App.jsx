import styles from './App.module.css'
import Header from './components/Header'
import Footer from './components/Footer'
import ContactForm from './components/ContactForm'
import Container from './components/Container'

function App() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container id="home" component="section">
          <h2>Home</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo quo perferendis veritatis sapiente reprehenderit atque necessitatibus velit. Enim quas, atque magnam numquam minus earum dicta.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa ducimus illo cumque deserunt harum atque dolores optio quidem iste, eligendi incidunt quod ab adipisci impedit eveniet voluptate delectus vel voluptas magni laborum qui magnam sint! Nesciunt quas cumque quia officia impedit. Odit est voluptate, beatae a earum odio qui vitae.</p>
        </Container>
        
        <Container id="about" component="section">
          <h2>About</h2>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi ullam omnis saepe odit quas eum neque repudiandae temporibus, dicta et, porro placeat eos ad? Culpa, expedita reprehenderit temporibus voluptate unde quos eaque sequi alias. Minima.</p>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia adipisci amet ipsa delectus ratione optio quis, molestias ea facere perspiciatis perferendis distinctio nulla impedit itaque dignissimos provident? Modi, nulla necessitatibus.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci atque asperiores illo! Autem iusto, explicabo, quas omnis, laboriosam provident itaque exercitationem odio temporibus tenetur quisquam voluptatibus possimus cumque. Enim quasi sint tenetur. Dolorum rem quo perferendis nesciunt, minus vitae facere.</p>
        </Container>
        
        <Container id="contact" component="section">
          <h2>Contact</h2>
          <ContactForm />
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default App
