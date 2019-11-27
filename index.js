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

    //HISTORICAL PRICES
    let pricesMonthlyUrl = `https://api-v2.intrinio.com/securities/${ticker}/prices?frequency=monthly&api_key=${apiKey}`
    let pricesMonthlyResp = await axios.get(pricesMonthlyUrl)
    let historicalPriceArray = pricesMonthlyResp.data.stock_prices

    console.log(historicalPriceArray)

    let price5yr = historicalPriceArray[60].adj_close
    let price1yr = historicalPriceArray[12].adj_close
    let price6month = historicalPriceArray[6].adj_close
    let price1month = historicalPriceArray[1].adj_close


    let change5yr = (price - price5yr) / price5yr
    let change1yr = (price - price1yr) / price1yr
    let change6month = (price - price6month) / price6month
    let change1month = (price - price1month) / price1month

    let pricesArray = []
    let monthsArray = []

    for (let i = 0; i < historicalPriceArray.length; i++) {
      pricesArray.push(historicalPriceArray[i].adj_open)
      monthsArray.push(historicalPriceArray[i].date)
    }

    //DIVIDENDS
    let divUrl = `https://api-v2.intrinio.com/securities/${ticker}/dividends/latest?api_key=${apiKey}`
    let divResp = await axios.get(divUrl)
    let forwardDiv = divResp.data.forward_yield * 100
    console.log(forwardDiv)

    //THROWING IT IN THE DOM
    let spanAdd = document.createElement('div')
    spanAdd.innerHTML = `<h3 class='corp'>${name}</h3> <h3 class='otherData'>${ticker} $${price}</h3>`
    let priceDOM = document.createElement("h3")
    let classToAdd = ""
    let rounded5yr = Math.round(change5yr * 100) / 100
    let rounded1yr = Math.round(change1yr * 100) / 100
    let rounded6month = Math.round(change6month * 100) / 100
    let rounded1month = Math.round(change1month * 100) / 100
    priceDOM.innerHTML = `<h3 id="data" class='${classToAdd}'>5 yr: ${rounded5yr * 100}%, 1 yr: ${rounded1yr * 100}%, 6 m: ${rounded6month * 100}%, 1 m: ${rounded1month * 100}%</h3>`

    document.querySelector("#results").appendChild(spanAdd)
    document.querySelector("#results").appendChild(priceDOM)

    //CHARTS AND STUFF
    var ctx = document.getElementById('chart').getContext('2d');
    let xlabels = []
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthsArray.reverse(),
        datasets: [{
          label: `${ticker}`,
          data: pricesArray.reverse(),
          backgroundColor: [
            'rgba(133, 99, 216, 0.2)'
          ],
          borderColor: [
            'rgba(133, 90, 116, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  let newsArray = []

  async function addNews() {
    let ticker = `${searchTicker.value}`.toUpperCase()
    //NEWS API
    let newsUrl = `https://stocknewsapi.com/api/v1?tickers=${ticker}&items=50&token=s1cutgipfbodqpr16bpyjxe7sn1txudauuk4uian`
    let newsResp = await axios.get(newsUrl)
    newsArray = newsResp.data.data

    for (let i = 0; i < newsArray.length; i++) {
      let squareDiv = document.createElement("a")
      squareDiv.innerHTML = `<div class='card'> <h2 id='newsTitle'>${newsArray[i].title}</h2> <img class='imageNews'src=${newsArray[i].image_url}> <h5 id='newsText'>${newsArray[i].text}</h6></div>`

      let scrollMenu = document.querySelector(".scrollMenu")
      scrollMenu.appendChild(squareDiv)

    }

    //TODO: need source code for omdb to add event listener to container
    //TODO: Different colors for different string values (Does this make sense lol)



  }
}

