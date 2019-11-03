forecast_calcSinH() {
    let dataDays = JSON.parse(localStorage.getItem('forecast_5/3'))
    let lat = parseFloat(dataDays.city.coord.lat)
    let Monthes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    let CoefAtm = parseFloat(localStorage.getItem('CoefAtm'))
    let Io = parseInt(localStorage.getItem('Io'))
    let Br = parseInt(localStorage.getItem('Br'))
    let Hr = parseInt(localStorage.getItem('Hr'))
    let Smax = parseFloat(localStorage.getItem('max_s90_365'))
    let K = parseFloat(localStorage.getItem('current_coeffK'))
    let timezone = dataDays.city.timezone
    let current_timezone = (new Date().getTimezoneOffset()) * 60

    let numberDayDate = (d, m, y) => {
      let N = 0
      let i = 0
      while (i != m - 1) {
        N += Monthes[i]
        i++
      }
      if (((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) && m > 2) N++;
      //console.log('numberDay: ', N + d)
      return (N + d)
    };

    let tauDate = (hour) => {
      let difference = 12 - hour
      let degree = difference * 15
      //console.log(degree)
      return (degree)
    };

    let sinHDate = (dd, mm, yy, hh) => {
      let dayDate = numberDayDate(dd, mm, yy)
      let delta = 23.45 * Math.sin((360 * (284 + dayDate) / 365) * Math.PI / 180);
      let k1 = 1.7
      let k2 = 1.7
      if (hh == 12) {
        k1 = 2
      }

      let tau = tauDate(hh)

      let sinH = Math.sin(lat * Math.PI / 180) *
        Math.sin(delta * Math.PI / 180) +
        Math.cos(lat * Math.PI / 180) *
        Math.cos(delta * Math.PI / 180) *
        Math.cos(tau * Math.PI / 180);
      //console.log('sinH', sinH)
      if (sinH < 0) {
        sinH = 0
      }
      let sunHight = Math.asin(sinH) * 180 / Math.PI //высота солнца
      //console.log('sunHight', sunHight)

      let Sort = Io * sinH / (sinH + CoefAtm)
      //console.log('Sort', Sort)

      let Sgor = Sort * sinH
      //console.log('Sgor', Sgor)

      let cosQ0 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau) * Math.PI / 180))
      //console.log('cosQ0 ', cosQ0)

      let cosQ90 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau - 90) * Math.PI / 180))
      //console.log('cosQ90 ', cosQ90)

      let S0ver = Sort * cosQ0
      //console.log('S0ver ', S0ver)

      let S90ver = Sort * cosQ90
      //console.log('S90ver ', S90ver)

      let S0 = k1 * (Sgor * Br + S0ver * Hr) / 2000
      //console.log('S0 ', S0)

      let S90 = k2 * (Sgor * Br + S90ver * Hr) / 2000
      // console.log('S90 ', S90)

      let S = 0.5 * (S0 + S90)
      //console.log('S ', S)
      //console.log("")
      let deltaT90 = (S90 * 25) / Smax * K
      let deltaT0 = (S0 * 25) / Smax * K
      let deltaT = 0.5 * (deltaT0 + deltaT90)


      return {
        'sunHight': sunHight,
        'Sort': Sort,
        'Sgor': Sgor,
        'cosQ0': cosQ0,
        'cosQ90': cosQ90,
        'S0ver': S0ver,
        'S90ver': S90ver,
        'S0': S0,
        'S90': S90,
        'S': S,
        'deltaT0': deltaT0,
        'deltaT90': deltaT90,
        'deltaT': deltaT
      }
    }
    let myObject = new Object
    myObject.city = {
      id: dataDays.city.id,
      name: dataDays.city.name
    }
    myObject.list = new Array
    for (let item in dataDays.list) {
      let date = new Date((dataDays.list[item].dt + current_timezone + timezone) * 1000)
      let dd = date.getDate()
      let mm = date.getMonth() + 1
      let yy = date.getFullYear()
      let hh = date.getHours()
      let coefficients = sinHDate(dd, mm, yy, hh)
      myObject.list.push({
        'date': yy + '-' + mm + '-' + dd + ' ' + hh + ':',
        'date_txt': date.toLocaleString(),
        'date_txt_chart': date.getDate() + '.' + (date.getMonth() + 1) + ' ' + date.getHours() + ':00',
        'icon': dataDays.list[item].weather[0].icon,
        'icon_link': "https://openweathermap.org/img/wn/" + dataDays.list[item].weather[0].icon + "@2x.png",
        "main": {
          'temp': Math.round(dataDays.list[item].main.temp - 273),
          'clouds': dataDays.list[item].clouds.all,
          'wind': dataDays.list[item].wind.speed,
          'humidity': dataDays.list[item].main.humidity,
          'rail': (Math.round(dataDays.list[item].main.temp - 273) + coefficients.deltaT).toFixed(1),
        },
        "coefficients": coefficients
      })
    }
    //console.log(myObject)
    this.table_tr = myObject.list
    localStorage.setItem('data_5/3', JSON.stringify(myObject))
    this.chartJS(myObject.list)
  },