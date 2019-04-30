const QUOTES_URL = "http://localhost:3000/quotes"
const ul = document.getElementById('quote-list')

const form = document.getElementById('new-quote-form')
form.addEventListener('submit', handleSubmit)

fetch(QUOTES_URL)
  .then(resp => resp.json())
  .then(json => displayQuotes(json))

function displayQuotes(json) {
  json.forEach( (quote) => {
    const li = document.createElement('li')
    li.classList.add('quote-card')
    ul.appendChild(li)

    const block = document.createElement('blockquote')
    block.classList.add('blockquote')
    li.appendChild(block)

    const p = document.createElement('p')
    p.classList.add('mb-0')
    p.textContent = quote.quote
    block.appendChild(p)

    const footer = document.createElement('footer')
    footer.classList.add('blockquote-footer')
    footer.textContent = quote.author
    block.appendChild(footer)

    block.appendChild(document.createElement('br'))

    const likeButton = document.createElement('button')
    likeButton.textContent = "Likes:"
    likeButton.classList.add('btn-success')
    block.appendChild(likeButton)

    const span = document.createElement('span')
    span.textContent = quote.likes
    likeButton.appendChild(span)
    likeButton.addEventListener('click', () => handleLike(span, quote))

    const editButton = document.createElement('button')
    editButton.classList.add('btn-warning')
    editButton.textContent = "Edit"
    editButton.addEventListener('click', () => handleEdit(quote, p, footer, li))
    block.appendChild(editButton)

    const deleteButton = document.createElement('button')
    deleteButton.textContent = "Delete"
    deleteButton.classList.add('btn-danger')
    deleteButton.addEventListener('click', () => handleDelete(li, quote))
    block.appendChild(deleteButton)
  })
}



function handleSubmit(ev) {
  ev.preventDefault()
  postQuote().then(json => displayQuotes([json]))
}

function postQuote() {
  const quoteInput = document.getElementById('new-quote')
  const authorInput = document.getElementById('author')
  return fetch(QUOTES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quote: quoteInput.value,
      likes: 0,
      author: authorInput.value
    })
  })
  .then(resp => resp.json())
}

function handleDelete(li, quote) {
  deleteQuote(quote).then(() => li.remove())
}

function deleteQuote(quote) {
  return fetch(QUOTES_URL + "/" + quote.id, {
    method: 'DELETE'
  })
}

function handleLike(span, quote) {
  const likes = quote.likes + 1
  quote.likes = likes
  const body = {likes: likes}
  patchQuote(quote, body).then(() => span.textContent = likes)
}

function patchQuote(quote, body) {
  return fetch(QUOTES_URL + "/" + quote.id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(resp => resp.json())
}



function handleEdit(quote, p, footer, li) {
  const newQuote = document.createElement('input')
  newQuote.value = quote.quote
  li.appendChild(newQuote)

  const newAuthor = document.createElement('input')
  newAuthor.value = quote.author
  li.appendChild(newAuthor)

  makeEditButton(quote, p, footer, li)
}

function makeEditButton(quote, p, footer, li) {
  const button = document.createElement('button')
  button.textContent = "Edit Quote"
  li.appendChild(button)
  button.addEventListener('click', () => handleEditButton(quote, body))
}

function handleEditButton(quote, body) {
  postQuote(body)
}
