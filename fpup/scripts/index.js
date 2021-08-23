// insertChat, resetChat are method from chat-demo.js which displays chat in chatbox
const commands = []

const init = async () => {

}

// init simulation
const runSimulation = () => {
  const opt = JSON.parse(document.getElementById('json').value)

  axios
    .post('http://localhost:3000/raw', opt)
    .then(res => {
      // initiate chat
      resetChat()

      // get 1st question
      const q1 = document.getElementById('q1').value

      // make chat based on 1st question and data collected
      let html = `
        <div class="container">
          <p>${q1}</p>
      `
      res.data.map((content, index) => {
        if (content[2].value == null) return
        html += `
          <div>
            <input type="radio" name="products" value="${content[0].value}" onChange="reply()">
              <b>${content[0].value}</b><br>
              ${content[2].value !== null ? `<img src="${content[2].value}" width="200" />` : ''}
            </input>
            <br><br>
          </div>
        `
      })
      html += '</div>'
      insertChat("you", html, 0)
    })
}

// catch user's selected product
const reply = () => {
  const products = document.getElementsByName('products')
  let selectedProduct = ''
  products.forEach(product => {
    if (product.checked) {
      selectedProduct = product.value
    }
  })

  // serialize selected product
  insertChat("me", selectedProduct, 0)

  // run commands
  if (commands.length == 0) return

  commands.forEach((command, index) => {
    switch(command) {
      case 'sendMessage':
        const message = document.getElementById(`sendMessage${index}`).value
        insertChat("you", message.replace('@selectedProduct', selectedProduct))
        break
      case 'sendColorOptions':
        break
      default:
        break
    }
  })
}

// add command after user selected a product
const addCommand = () => {
  const command = document.getElementById('command')

  switch(command.value) {
    case 'sendMessage':
      addSendMessageForm()
      break
    case 'sendColorOptions':
      break
    default:
      break
  }

  // add to list of commands
  commands.push(command.value)

  // revert selection to initial
  command.selectedIndex = 0
}

// add new form for send message
const addSendMessageForm = () => {
  const html = `
    <p>Send Message:</p>
    <textarea id="sendMessage${commands.length}" class="form-control" rows="5">Thank you for selecting @selectedProduct</textarea>
    <small class="text-muted">use @selectedProduct to use it as string</small><br><br>
  `

  document.getElementById('commandSection').innerHTML += html
}
