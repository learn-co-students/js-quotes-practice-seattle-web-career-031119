// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const QUOTE_URL = "http://localhost:3000/quotes"

document.addEventListener("DOMContentLoaded", () => {

  function getQuotes() {
    fetch(QUOTE_URL)
      .then(res => res.json())
      .then(quotes => displayQuotes(quotes))
  }

  function displayQuotes(quotes) {
    quotes.forEach(q => {
      makeQuote(q)
    })
  }

  function makeQuote(q) {
    let list = document.getElementById('quote-list')
    let li = document.createElement('li')
    li.classList.add('quote-card')
    list.appendChild(li)

    let blockquote = document.createElement('blockquote')
    blockquote.classList.add('blockquote')
    li.appendChild(blockquote)

    let p = document.createElement('p')
    p.classList.add('mb-0')
    p.textContent = q.quote
    blockquote.appendChild(p)

    let footer = document.createElement('footer')
    footer.classList.add('blockquote-footer')
    footer.textContent = q.author
    blockquote.appendChild(footer)

    let likeBtn = document.createElement('button')
    likeBtn.classList.add('btn-success')
    likeBtn.textContent = `Likes: ${q.likes}`
    blockquote.appendChild(likeBtn)
    likeBtn.addEventListener('click', () => {
      likeBtn.textContent = `Likes: ${++q.likes}`
      likeQuote(q)
    })

    let delBtn = document.createElement('button')
    delBtn.classList.add('btn-danger')
    delBtn.textContent = `Delete`
    blockquote.appendChild(delBtn)
    delBtn.addEventListener('click', () => {
      deleteQuote(q)
      li.remove()
    })

  }

  function deleteQuote(q){
    return fetch(QUOTE_URL + '/' + q.id, {
      method: 'DELETE'
    })
    .then(res => res.json())
  }

  function likeQuote(q){
    return fetch(QUOTE_URL + '/' + q.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        likes: q.likes
      })
    })
    .then(res => res.json())
  }


  const form = document.getElementById('new-quote-form')
  form.addEventListener('submit', handleSubmit)


  function handleSubmit(ev) {
    ev.preventDefault()
    console.log("author:", ev.target.elements['author'].value)
    console.log("new quote:", ev.target.elements['new-quote'].value)
    fetch(QUOTE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quote: ev.target.elements['new-quote'].value,
        likes: 0,
        author: ev.target.elements['author'].value
      })
    })
    .then(res => res.json())
    .then(newQuote => makeQuote(newQuote))
    ev.target.elements['author'].value = ""
    ev.target.elements['new-quote'].value = ""
  }


  getQuotes()

})
