document.addEventListener('DOMContentLoaded', () => {
  const URL = 'http://localhost:3000/quotes'
  let CURRENTQUOTE = null
  let QUOTES = []
  let ISSORTED = false
  const quotesUl = document.getElementById('quote-list')

  function getQuotes() {
    fetch(URL)
    .then(ret => ret.json())
    .then(json => eachQuote(json))
  }

  function eachQuote(quotes) {
    while(quotesUl.firstChild) {
      quotesUl.firstChild.remove()
    }
    QUOTES = []
    quotes.forEach(quote => {
      QUOTES.push(quote)
      showQuote(quote)
    })
  }

  function showQuote(quote) {

    const quoteLi = document.createElement('li')
    const blockquote = document.createElement('blockquote')
    blockquote.classList.add('blockquote')

    const quoteP = document.createElement('p')
    quoteP.classList.add('mb-0')
    quoteP.textContent = quote.quote

    const authorFoot = document.createElement('footer')
    authorFoot.classList.add('blockquote-footer')
    authorFoot.textContent = quote.author

    linebreak = document.createElement('br')

    const likeBtn = document.createElement('button')
    likeBtn.classList.add('btn-success')
    likeBtn.textContent = 'Likes: '

    likeBtn.addEventListener('click', () => {
      handleLike(quote)
      .then(json => {
        likeCount.textContent = json.likes
      })
    })

    const likeCount = document.createElement('span')
    likeCount.textContent = quote.likes
    likeBtn.appendChild(likeCount)

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('btn-danger')
    deleteBtn.textContent = 'Delete'

    deleteBtn.addEventListener('click', () => {
      handleDelete(quote)
      .then(() => {
        quoteLi.remove()
      })
    })

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    editBtn.addEventListener('click', () => {
      populateEditForm(quote)
    })

    quoteLi.appendChild(blockquote)
    quoteLi.appendChild(quoteP)
    quoteLi.appendChild(authorFoot)
    quoteLi.appendChild(linebreak)
    quoteLi.appendChild(likeBtn)
    quoteLi.appendChild(deleteBtn)
    quoteLi.appendChild(editBtn)
    quotesUl.appendChild(quoteLi)
  }

  function handleLike(quote) {
    return fetch(URL + '/' + quote.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        likes: ++quote.likes
      })
    })
    .then(res => res.json())
  }

  function handleDelete(quote) {
    return fetch(URL + '/' + quote.id, {
      method: 'DELETE'
    })
    .then(res => res.json())
  }

  function handleNewForm() {
    const form = document.getElementById("new-quote-form")
    form.addEventListener('submit', (ev) => {
      handleSubmit(ev)
      .then(json => {
        showQuote(json)
      })
    })
  }

  function handleSubmit(ev) {
    ev.preventDefault()

    return fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quote: ev.target.elements['new-quote'].value,
        author: ev.target.elements['author'].value,
        likes: 0
      })
    })
    .then(ret => ret.json())
  }

  function populateEditForm(quote) {
    CURRENTQUOTE = quote
    let form = document.getElementById("edit-quote-form")
    form.style.display="block"
    document.getElementById('edit-quote').value = quote.quote
    document.getElementById('edit-author').value = quote.author
  }

  function handleEditForm(ev) {
    ev.preventDefault()

    return fetch(URL + '/' + CURRENTQUOTE.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quote: ev.target.elements['edit-quote'].value,
        author: ev.target.elements['edit-author'].value
      })
    })
    .then(ret => ret.json())
  }

  function filterQuotes(sortButton) {
    if (ISSORTED) {
      ISSORTED = false
      sortButton.textContent = "Sort By Author"
      getQuotes()
    } else {
      let sortedQuotes = [...QUOTES]
      sortedQuotes = sortedQuotes.sort((a,b) => (a.author > b.author) ? 1:-1)
      eachQuote(sortedQuotes)
      sortButton.textContent = "Sort By Default"
      ISSORTED = true
    }
  }

  function main() {
    getQuotes()
    handleNewForm()

    const form = document.getElementById("edit-quote-form")
    form.addEventListener('submit', (ev) => {
      handleEditForm(ev)
      .then(json => {
        form.style.display="none"
        getQuotes()
      })
    })

    const sortButton = document.getElementById('sort-button')
    sortButton.addEventListener('click', () => {
      filterQuotes(sortButton)
    })

  }

  main()

})
