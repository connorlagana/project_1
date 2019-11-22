window.onload = function () {

  const searchButton = document.querySelector("#getStock")
  const searchTicker = document.querySelector("#ticker")


  searchButton.addEventListener("click", async function (evt) {
    evt.preventDefault()
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

    //NEWS API
    let newsUrl = `https://stocknewsapi.com/api/v1?tickers=${ticker}&items=10&token=s1cutgipfbodqpr16bpyjxe7sn1txudauuk4uian`

    let newsResp = await axios.get(newsUrl)
    let newsArray = newsResp.data.data
    for (let i = 0; i < newsArray.length; i++) {

      console.log(newsArray[i])
    }

    //THROWING IT IN THE DOM
    let spanAdd = document.createElement('div');
    if (price < 50) {
      spanAdd.classList.add('green');
    }
    if (price > 90) {
      spanAdd.classList.add('red');
    }
    spanAdd.innerHTML = `Last Price: ${price}`

    document.querySelector("#results").appendChild(spanAdd)

  })
}

