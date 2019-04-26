// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

// <li class='quote-card'>
//   <blockquote class="blockquote">
//     <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
//     <footer class="blockquote-footer">Someone famous</footer>
//     <br>
//     <button class='btn-success'>Likes: <span>0</span></button>
//     <button class='btn-danger'>Delete</button>
//   </blockquote>
// </li>

const QUOTES_URL = 'http://localhost:3000/quotes'

function fetchQuotes(){
  fetch(QUOTES_URL)
    .then( res => res.json())
    .then( json => {
      addQuotes(json)
    })
}

function addQuotes(quotes){
  const ul = document.getElementById("quote-list")
  quotes.forEach( quote => {
    let li = makeQuoteLi(quote)
    ul.appendChild(li);
  })
}

function makeQuoteLi(quote){
  let li = document.createElement('li')
  li.classList.add('quote-card')

  let blockquote = document.createElement('blockquote')
  blockquote.classList.add('blockquote')

  let quoteText = document.createElement('p')
  quoteText.textContent = quote.quote
  quoteText.classList.add("mb-0")

  let footer = document.createElement('footer')
  footer.textContent = quote.author
  footer.classList.add("blockquote-footer")

  let br = document.createElement('br')

  let likeButton = document.createElement('button')
  likeButton.textContent = `Likes:`
  likeButton.classList.add("btn-success")
  likeButton.addEventListener('click', () => {
    likeQuote(quote.id, quote.likes)
    .then( json => {
      likeSpan.textContent = ++quote.likes
    })
  })

  let likeSpan = document.createElement('span')
  likeSpan.textContent = `${quote.likes}`

  let deleteButton = document.createElement('button')
  deleteButton.textContent = "Delete"
  deleteButton.classList.add("btn-danger")
  deleteButton.addEventListener('click', (ev) => {
    deleteQuote(quote.id)
      .then( () => li.remove())
  })

  li.appendChild(blockquote);
  blockquote.appendChild(quoteText)
  blockquote.appendChild(footer)
  blockquote.appendChild(br)
  blockquote.appendChild(likeButton)
  likeButton.appendChild(likeSpan)
  blockquote.appendChild(deleteButton)

  return li;
}

function deleteQuote(id) {
  return fetch(QUOTES_URL + '/' + id, {
    method: "DELETE"
  })
  .then(res => res.json())
}

function likeQuote(id, likes) {
  return fetch(QUOTES_URL + '/' + id, {
    method: "PATCH",
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      likes: ++likes
    })
  })
  .then( res => res.json())
}

function attachFormListeners() {
  let newQuoteForm = document.getElementById('new-quote-form')
  newQuoteForm.addEventListener('submit', createQuote)

}

function createQuote(ev) {
  ev.preventDefault()
  let quoteText = document.getElementById('new-quote').value
  let quoteAuthor = document.getElementById('author').value
  let ul = document.getElementById("quote-list")


  fetch(QUOTES_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      quote: quoteText,
      author: quoteAuthor,
      likes: 1
    })
  })
  .then( res => res.json())
  .then( quote => {
    let li = makeQuoteLi(quote)
    ul.appendChild(li)
  })
  .catch (err => {
    console.log(err)
  })

}


function main() {
  fetchQuotes()
  attachFormListeners()
}

document.addEventListener('DOMContentLoaded', main)
