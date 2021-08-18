// insertChat, resetChat are method from chat-demo.js which displays chat in chatbox

const init = async () => {

}

const runSimulation = async () => {
  resetChat()
  const opt = JSON.parse(document.getElementById('json').value)
  console.log(opt)

  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
  var theUrl = `http://localhost:3000/raw`;
  xmlhttp.open("POST", theUrl);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(JSON.stringify(opt));

  xmlhttp.onreadystatechange = async function() {
    if (this.readyState != 4 && this.status != 200) return
    const contents = JSON.parse(this.responseText)
    for await(content of contents) {
      const html = `
        <div class="container">
          <a href="https://www.youtube.com${content[1].value}" target="_blank" style="text-decoration: none;">
            <b>${content[0].value}</b><br>
            ${content[2].value !== null ? `<img src="${content[2].value}" width="200" />` : ''}
          </a>
        </div>
      `
      if (content[2].value !== null) insertChat("me", html, 0)
    }
  }
}
