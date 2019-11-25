window.onload = function () {

  const searchButton = document.querySelector("#getStock")
  const searchTicker = document.querySelector("#ticker")


  searchButton.addEventListener("click", function (evt) {
    evt.preventDefault()

    retrieveFinance()

    addNews()
  })

  async function retrieveFinance() {
    let ticker = `${searchTicker.value}`.toUpperCase()

    //STOCK INFO API
    const apiKey = "OmQzMTBkZjhhNjRhOGM2OTI3MGI1MWUzNzE2ODJlMzY2"
    let baseUrl = `https://api-v2.intrinio.com/companies/${ticker}?api_key=${apiKey}`


    let resp = await axios.get(baseUrl)

    let name = resp.data.name
    console.log(name)

    //STOCK REAL TIME DATA API
    let realTimeUrl = `https://api-v2.intrinio.com/securities/${ticker}/prices/realtime?api_key=${apiKey}`
    let rtResp = await axios.get(realTimeUrl)
    let price = rtResp.data.last_price
    console.log(rtResp)


    //THROWING IT IN THE DOM
    let spanAdd = document.createElement('div');
    if (price < 50) {
      spanAdd.classList.add('green');
    }
    if (price > 90) {
      spanAdd.classList.add('red');
    }
    spanAdd.innerHTML = `<h3 class='corp'>${name}</h3> <h3 class='otherData'>${ticker} $${price}</h3>`

    document.querySelector("#results").appendChild(spanAdd)
  }

  async function addNews() {
    let ticker = `${searchTicker.value}`.toUpperCase()
    //NEWS API
    let newsUrl = `https://stocknewsapi.com/api/v1?tickers=${ticker}&items=10&token=s1cutgipfbodqpr16bpyjxe7sn1txudauuk4uian`
    console.log("working one")
    let newsResp = await axios.get(newsUrl)
    let newsArray = newsResp.data.data
    console.log(newsArray)
    for (let i = 0; i < newsArray.length; i++) {

      console.log(newsArray[i].title)
    }

    for (let i = 0; i < newsArray.length; i++) {
      let squareDiv = document.createElement("a")
      squareDiv.innerHTML = `<div> <h3>${newsArray[i].title}</h3> <img src=${newsArray[i].image_url}> <h5 class='newsText'>${newsArray[i].text}</h6></div>`

      let scrollMenu = document.querySelector(".scrollMenu")
      scrollMenu.appendChild(squareDiv)
      console.log(scrollMenu)
      // document.
    }


  }
}

