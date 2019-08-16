<template>
  <div>
    <div class="container wrapper">

      <!--<button v-on:click="getNumberOfTheDay">Текущая дата</button>
    <button v-on:click="getTau">Текущая высота солнца</button>
    <button v-on:click="calcSinH(56,37)">SinH</button>
    <button v-on:click="degreesToRadians(150)">SH</button>-->
      <button v-on:click="SMax365">SMax365</button>
      <button v-on:click="forecast_calcSinH">forecast</button>

    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        kirpich: 123,
      }
    },

    methods: {

      /*getNumberOfTheDay() {
        let now = new Date()
        var dd = now.getDate()
        var mm = now.getMonth() + 1
        var yy = now.getFullYear() % 100
        //console.log(dd, mm, yy)
        let Monthes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        let N = 0
        let i = 0
        while (i != mm - 1) {
          N += Monthes[i]
          i++
        }
        if (((yy % 4 == 0 && yy % 100 != 0) || yy % 400 == 0) && mm > 2) N++;
        //console.log(N+dd)
        //return (N + dd)
        localStorage.setItem('current_numberOfTheDay', N + dd)

      },


      getTau() {
        let now = new Date()
        let Hour = now.getHours()
        //console.log(Hour)
        let difference = 12 - Hour
        let degree = difference * 15
        console.log(degree)
        localStorage.setItem('current_tau', degree * Math.PI / 180)
      },

      /*degreesToRadians:(grad) => {
          console.log((grad * Math.PI) / 180)
        return (grad * Math.PI) / 180;
      },*/

      /*calcSinH() {

        let day = parseInt(localStorage.getItem('current_numberOfTheDay'))
        let lat = parseFloat(localStorage.getItem('current_lat'))
        let tau = parseFloat(localStorage.getItem('current_tau'))
        let delta = 23.45 * Math.sin((360 * (284 + day) / 365) * Math.PI / 180)
        let CoefAtm = parseFloat(localStorage.getItem('CoefAtm'))
        let Io = parseInt(localStorage.getItem('Io'))

        let SinH = Math.sin(lat * Math.PI / 180) *
          Math.sin(delta * Math.PI / 180) +
          Math.cos(lat * Math.PI / 180) *
          Math.cos(delta * Math.PI / 180) *
          Math.cos(tau * Math.PI / 180);

        if (SinH < 0) {
          localStorage.setItem('sinH', 0)
        } else {
          localStorage.setItem('sinH', SinH)
        }

        let sunHight = Math.asin(SinH) * 180 / Math.PI
        localStorage.setItem('current_sunHight', sunHight)

        let Sort = Io * SinH / (SinH + CoefAtm)
        localStorage.setItem('current_Sort', Sort)

        console.log(SinH)
        console.log(sunHight)
        console.log(Sort)

      },*/

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

        console.log(dataDays)
        let myObject = new Object
        myObject.city = {
          id: dataDays.city.id,
          name: dataDays.city.name
        }
        myObject.list = new Array
        for (let item in dataDays.list) {
          //console.log(dataDays.list[item].dt_txt)


          let date = new Date((dataDays.list[item].dt + current_timezone + timezone) * 1000)
          /*console.log(new Date(dataDays.list[item].dt * 1000))
          console.log(date)
          console.log(date.getDate())
          console.log(date.getMonth() + 1)
          console.log(date.getFullYear())
          console.log(date.getHours())*/
          //let timezone = dataDays.city.timezone / 3600
          let dd = date.getDate()
          let mm = date.getMonth() + 1
          let yy = date.getFullYear()
          let hh = date.getHours()
          let coefficients = sinHDate(dd, mm, yy, hh)
          myObject.list.push({
            'date': yy + '-' + mm + '-' + dd + ' ' + hh + ':',
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
        console.log(myObject)
        localStorage.setItem('data_5/3', JSON.stringify(myObject))
      },

      SMax365() {
        let lat = parseFloat(JSON.parse(localStorage.getItem('current_weather')).city.lat)
        let CoefAtm = parseFloat(localStorage.getItem('CoefAtm'))
        let Io = parseInt(localStorage.getItem('Io'))
        let Br = parseInt(localStorage.getItem('Br'))
        let Hr = parseInt(localStorage.getItem('Hr'))

        let tauDate = (hour) => {
          let difference = 12 - hour
          let degree = difference * 15
          //console.log(degree)
          return (degree)
        };

        let sinHDate = (dayDate, hh) => {
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


          if (sinH < 0) {
            sinH = 0
          }

          let sunHight = Math.asin(sinH) * 180 / Math.PI //высота солнца

          let Sort = Io * sinH / (sinH + CoefAtm)

          let Sgor = Sort * sinH

          let cosQ0 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau) * Math.PI / 180))

          let cosQ90 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau - 90) * Math.PI / 180))

          let S0ver = Sort * cosQ0

          let S90ver = Sort * cosQ90

          let S0 = k1 * (Sgor * Br + S0ver * Hr) / 2000

          let S90 = k2 * (Sgor * Br + S90ver * Hr) / 2000

          let S = 0.5 * (S0 + S90)
          return S90
        }

        let MAX_S90 = 0
        let CUR_S90 = 0
        for (let i = 1; i <= 365; i++) {
          let dayDate = i
          let hh = 12
          CUR_S90 = sinHDate(dayDate, hh)
          MAX_S90 = Math.max(CUR_S90, MAX_S90)
        }
        console.log(MAX_S90)
        localStorage.setItem('max_s90_365', MAX_S90)
      },
    }
  }

</script>
