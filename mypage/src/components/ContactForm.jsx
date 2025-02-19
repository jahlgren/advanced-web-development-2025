import styles from './ContactForm.module.css'
import Input from './Input'
import Row from './Row'
import Button from './Button'
import {useState} from 'react'

const ContactForm = (onSubmit) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [messageSent, setMessageSent] = useState(false)

  const submit = e => {
    e.preventDefault()
    setMessageSent(true)
    !onSubmit && onSubmit()
  }

  const reset = () => {
    setName('')
    setEmail('')
    setMessage('')
  }

  return messageSent ? (
    <>
      <h3 style={{marginBottom: '1rem'}}>Thank you for reaching out!</h3>
      <p>We've received your message and will get back to you as soon as possible. If your inquiry is urgent, feel free to call us directly. Have a great day!</p>
    </>
  ) : (
    <form className={styles.form} onSubmit={submit}>
      <Row>
        <Input label="Name" name="name" required value={name} onChange={v => setName(v)} />
        <Input type="email" label="Email" name="email" required value={email} onChange={v => setEmail(v)} />
      </Row>
      
      <Input label="Message" name="message" textarea required value={message} onChange={v => setMessage(v)} />

      <Row>
        <Button name="reset" onClick={reset}>Reset</Button>
        <Button type="submit" name="submit" primary>Submit</Button>
      </Row>
    </form>
  )
}

export default ContactForm
