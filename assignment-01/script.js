const form = document.querySelector('form');
const resetButton = document.querySelector('button[name="reset"]');

resetButton.addEventListener('click', e => {
  resetForm();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  form.innerHTML = '<h3 style="margin-bottom: 0">Thank you for reaching out!</h3><p>We’ve received your message and will get back to you as soon as possible. If your inquiry is urgent, feel free to call us directly. Have a great day!</p>'
});

function resetForm() {
  form.querySelectorAll('input, textarea').forEach(element => element.value = '');
}
