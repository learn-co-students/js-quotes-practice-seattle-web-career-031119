// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", () => {
	const QUOTES_URL = "http://localhost:3000/quotes"

	function getQuotes(){
		fetch(QUOTES_URL)
			.then(res => res.json())
			.then(json => displayQuotes(json))
	}

	function displayQuotes(quotes) {
		quotes.forEach(showQuote)
	}



	function showQuote(phrase){
		//ul should only have li appended to it
		let ul = document.getElementById("quote-list")

		let li = document.createElement('li')
		li.classList.add('quote-card')
		ul.appendChild(li)

//blockquote gets appended to li
		let blockquote = document.createElement('blockquote')
		blockquote.classList.add('blockquote')
		li.appendChild(blockquote)

//everything below gets appended to blockquote bc it doesnt
//nest deeper in example shown
		let p = document.createElement('p')
		p.classList.add('mb-0')
		p.textContent = phrase.quote
		blockquote.appendChild(p)


		let authorsDiv = document.createElement('footer')
		authorsDiv.classList.add('blockquote-footer')
		authorsDiv.textContent = phrase.author
		blockquote.appendChild(authorsDiv)

		let qLikeButton = document.createElement('button')
		qLikeButton.classList.add('btn-success')
		qLikeButton.textContent = `${phrase.likes} likes`
			qLikeButton.addEventListener("click", () => {
				qLikeButton.textContent = `${++phrase.likes} likes`
				updateLikes(phrase.id, phrase.likes)
			})
		blockquote.appendChild(qLikeButton)

		let deleteButton = document.createElement('button')
			deleteButton.classList.add('btn-danger')
			deleteButton.textContent = "Delete"
			deleteButton.addEventListener('click', () => {
				deleteQuote(phrase.id)
				li.remove()
				//remove from li since quote and everything pertaining to it
				//lives in li of quote card
			})
		blockquote.appendChild(deleteButton)

	}

	function updateLikes(id, likes) {
		return fetch(QUOTES_URL + '/' + id, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				likes: likes++
			})
		})
		.then(res => res.json())
	}

//only add id if editing or deleting
	function deleteQuote(id) {
		return fetch(QUOTES_URL + '/' + id, {
			method: "DELETE",
		})
		.then(res => res.json())
	}

//create new function and get the form and set eventListener to call submit fx
//call the function inside of main
function addNewQuote() {
const form = document.getElementById('new-quote-form')
form.addEventListener('submit', handleSubmit)
//just reference handleSubmit or it will run here
}

function handleSubmit(ev){
	ev.preventDefault()
	//console.log what you want to see
	console.log("quote:", ev.target.elements["new-quote"].value);
	console.log("author:", ev.target.elements["author"].value);

fetch(QUOTES_URL, {
	method: "POST",
	headers: {
		"Content-Type": "application/json"
	},
	body: JSON.stringify({
		quote: ev.target.elements["new-quote"].value,
		author: ev.target.elements["author"].value,
		likes: 0
	})
})
.then(res => res.json())
.then(returnedQuote => showQuote(returnedQuote))
	ev.target.elements["new-quote"].value = ""
	ev.target.elements["author"].value = ""
}
// the ev.target.elements[].value = '' empty string resets the value on the
// form so you don't have to erase what you typed for previous entry


//final .then sends information somewhere
//We want to show it with the rest of the quotes
// Do not want to pass in displayQuotes because its ONE SINGLE QUOTE
// therefore pass in showQuote since it is for the ONE SINGLE QUOTE


//In console/debugger you can type in ev to recieve all the information
// you can see ev => target => elements and you'll see what you typed inspect
//ev.target => shows you what form youre in
//ev.target.elements["new-quote"].value pulls out the quote
	// pulling out of input id value in form
//ev.target.elements["author"].value pulls out the author


function main(){
	getQuotes()
	addNewQuote()
}

main()

})
