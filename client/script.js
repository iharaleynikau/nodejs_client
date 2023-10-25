// input values
const inputUser = document.querySelector('input[name="user"]')
const inputPassword = document.querySelector('input[name="password"]')

// buttons
const buttonLogin = document.querySelector('#buttonLogin')
const buttonRegister = document.querySelector('#buttonRegister')
const buttonLogout = document.querySelector('#buttonLogout')

// error div
const passwordError = document.querySelector('#passwordError')

// loader
const loader = document.querySelector('#loader')

buttonLogin.addEventListener('click', async () => {
  try {
    loader.style.display = 'block'

    buttonLogin.disabled = true
    buttonRegister.disabled = true
    buttonLogout.disabled = true

    const data = await fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: inputUser.value,
        password: inputPassword.value,
      }),
      headers: {
        'Content-type': 'application/json'
      }
    }).then((res) => res.json())

    if (data.token) {
      localStorage.setItem('userData', JSON.stringify({ token: data.token }))
      passwordError.textContent = ''
    } else if (data.errors) {
      data.errors.map((error) => {
        if (error.path === 'password') {
          passwordError.textContent = error.msg
        } else {
          passwordError.textContent = ''
        }
      })
    }
    loader.style.display = 'none'

    buttonLogin.disabled = false
    buttonRegister.disabled = false
    buttonLogout.disabled = false

  } catch (error) {
    console.log(error)
  }
})

buttonRegister.addEventListener('click', async () => {
  try {
    await fetch('/auth/registration', {
      method: 'POST',
      body: JSON.stringify({
        username: inputUser.value,
        password: inputPassword.value,
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
  } catch (error) {
    console.log(error)
  }
})

buttonLogout.addEventListener('click', () => {
  try {
    localStorage.clear()
  } catch (error) {
    console.log(error)
  }
})