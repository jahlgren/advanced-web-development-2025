const ul = document.querySelector('ul')
const form = document.querySelector('form')
const title = document.querySelector('#title')
const author = document.querySelector('#author')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const response = await fetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({title: title.value, author: author.value})
  })

  if(response.status !== 201)
    return;

  const book = await response.json()
  addBookToView(book)

  title.value = ''
  author.value = ''
})

fetchBooks()

async function fetchBooks() {
  const response = await fetch('/api/books')
  const books = await response.json()||[]
  renderBooks(books)
}

function renderBooks(books) {
  console.log(books)
  while(ul.children.length > 0)
    ul.children[0].remove()

  for(let i = 0; i < books.length; i++) {
    addBookToView(books[i])
  }
}

function addBookToView(book) {
  const li = document.createElement('li')

  const editButton = document.createElement('button')
  editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>`;
  li.append(editButton)

  const titleElement = document.createElement('strong')
  titleElement.innerText = book.title;
  li.append(titleElement)

  const authorElement = document.createElement('span')
  authorElement.innerText = '(by: ' + book.author + ')';
  li.append(authorElement)

  const deleteButton = document.createElement('button')
  deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`;
  deleteButton.style.margin = "0 0 0 auto"
  li.append(deleteButton)

  ul.append(li)

  deleteButton.addEventListener('click', async () => {
    const response = await fetch('/api/books/' + book.id, {
      method: 'DELETE'
    })
    if(response.status === 200)
      li.remove()
  })

  editButton.addEventListener('click', () => {
    editButton.remove()
    titleElement.remove()
    authorElement.remove()
    deleteButton.remove()

    openEditMode(li, book, (newBook) => {
      if(newBook) {
        titleElement.value = newBook.title
        authorElement.value = newBook.author
        titleElement.innerText = newBook.title
        authorElement.innerText = '(by: ' + newBook.author + ')';
      }

      li.append(editButton)
      li.append(titleElement)
      li.append(authorElement)
      li.append(deleteButton)
    })
  })
}

function openEditMode(li, book, callback) {
  const form = document.createElement('form')

  const cancel = document.createElement('button')
  cancel.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
  cancel.type = 'button'
  form.append(cancel)
  
  const save = document.createElement('button')
  save.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>`;
  save.type = 'submit'
  form.append(save)

  const titleInput = document.createElement('input')
  titleInput.placeholder = 'Title'
  titleInput.value = book.title
  form.append(titleInput)
  
  const authorInput  = document.createElement('input')
  authorInput.placeholder = 'Title'
  authorInput.value = book.author
  form.append(authorInput)
  
  li.append(form)

  cancel.addEventListener('click', () => {
    form.remove()
    callback()
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const response = await fetch('/api/books', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: book.id, title: titleInput.value, author: authorInput.value})
    })
    if(response.status !== 200)
      callback()

    const data = await response.json()
    form.remove()
    callback(data)
  })
}
