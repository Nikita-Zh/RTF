<template>
  <div>
      <!-- tabs -->
      <div class="tabs is-centered is-boxed">
        <ul>
          <li @click="tabsToggle(), tabsParams={isCity:true, isGeo:false, isForecast:false}" class="is-active"><a>По
              городу</a></li>
          <li @click="tabsToggle(), tabsParams={isCity:false, isGeo:true, isForecast:false}"><a>По координатам</a></li>
          <li @click="tabsToggle(), tabsParams={isCity:false, isGeo:false, isForecast:true}"><a>Прогноз</a></li>
        </ul>
      </div>

      <!-- WeatherByCity -->
         
      <keep-alive>
       <transition name="comp">
        <weather-by-city v-show="tabsParams.isCity" @changeCityParams='cityParams = $event'></weather-by-city>
       </transition>
      </keep-alive>

      <!-- WeatherByGeo -->
      <keep-alive>
         <transition name="comp">
        <weather-by-geo v-show="tabsParams.isGeo" @changeCityParams='cityParams = $event'></weather-by-geo>
         </transition>
      </keep-alive>


  </div>
</template>

<script>
  
  export default {

    data() {
      return {
       
      }
    },

    computed: {

    },


    mounted: function () {
      const tabs = document.querySelectorAll("div.tabs ul li")
      tabs.forEach(el => {
        el.addEventListener('click', () => {
          el.classList.add('is-active')
        })
      });
    },

    methods: {
      tabsToggle() {
        document.querySelectorAll("div.tabs ul li.is-active")[0].classList.remove('is-active')
      }
    }
  }

</script>