const inputUser = document.querySelector('input[name="user"]')
const inputPassword = document.querySelector('input[name="password"]')
const button = document.querySelector('#button')

button.addEventListener('click', () => {
  const data = {
    user: inputUser.value,
    password: inputPassword.value,
  }

  const url = '/testPost'

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json'
    }
  })
})