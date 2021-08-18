const puppeteer = require('puppeteer')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(cors({ origin: '*', credentials: true }))
app.get('/', async (req,res) => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  const url = 'https://www.youtube.com'
  await page.goto(url)

  const grabVideos = await page.evaluate(() => {
    const videosRaw = document.querySelectorAll('#dismissible')
    const videos = []
    videosRaw.forEach(video => {
      const v = {}
      v.title = video.querySelector('#video-title-link').innerText
      v.url = video.querySelector('#video-title-link').getAttribute('href')
      v.thumbnail = video.querySelector('#img').getAttribute('src')
      videos.push(v)
    })

    return videos
  })

  let html = "<ul>"
  grabVideos.forEach(video => {
    html += `
      <li style="list-style: none; margin-bottom: 20px;">
        <a href="${url}${video.url}">
          <img src="${video.thumbnail}" height="80" /><br>
          ${video.title}
        </a>
      </li>
    `
  })

  res.send(html)
})

app.post('/raw', async (req, res) => {
  const opt = req.body
  console.log(opt)

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  const url = opt.url
  await page.goto(url)

  const contents = await page.evaluate((opt) => {
    const cRaw = document.querySelectorAll(opt.parent)
    const cRes = []
    cRaw.forEach(async raw => {
      const x = []
      for await(detail of opt.details) {
        const Res = {}
        Res.name = detail.name
        Res.value = detail.type === 'innerText' ? raw.querySelector(detail.element).innerText :
          raw.querySelector(detail.element).getAttribute(detail.attribute)

        x.push(Res)
      }

      cRes.push(x)
    })

    return cRes
  }, opt)

  res.json(contents)
})

app.listen(3000, () => console.log('App running'))
