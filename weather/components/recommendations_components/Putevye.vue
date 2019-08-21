<template>
  <div>
    <div class="tile is-ancestor ">
      <div class="tile is-vertical is-parent">
        <div class="tile is-child box">
          <div class="select select-1 is-fullwidth">
            <select v-model="selected" @change="test">
              <option class="unsel" disabled value="">Выберите один из вариантов путевых работ</option>
              <option v-for="item in names" :key="item.id" :value='item.id'>
                {{item.name}}
              </option>
            </select>
          </div>
          <div>
            <div class="select select-1 is-fullwidth">
              <select v-model="selected_2">
                <option class="unsel" disabled value="">Выберите участок пути</option>
                <option v-for="param in isSelected" :key="param.id" :value='param.value'>
                  {{param.name}}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="level">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">допустимая максимальная температура</p>
              <p class="title">{{valid_temp + '°C'}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <success-result v-if="isSuccess"></success-result>
    <fail-result v-if="isFailResult">
      <div slot="body">
        <div v-if="nothing_data">
          <div style="display:flex; align-items: center"> Для получения ближайшей даты допустимой для проведения работ
            получите <nuxt-link style="margin-left:10px;" class="button is-warning" to="/weather">Прогноз</nuxt-link>
          </div>
        </div>
        <div v-else-if="nearest_valid_date === false">
          Нет подходящего времени в течении ближайших 5 дней
        </div>
        <div v-else>
          Ближайшая допустимая дата для проведения работ: {{nearest_valid_date}}
        </div>
      </div>
    </fail-result>
  </div>
</template>

<script>
  import SuccessResult from '@/components/recommendations_components/SuccessResult.vue'
  import FailResult from '@/components/recommendations_components/FailResult.vue'
  export default {
    components: {
      SuccessResult,
      FailResult
    },

    data() {
      return {
        isSuccessResult: '',
        isFailResult: false,
        valid_temp: '-',
        nearest_valid_date: false,
        selected: '',
        selected_2: '',
        nothing_data: false,
        names: [{
            id: 1,
            name: `Исправление просадок, толчков и перекосов с вывеской путевой решетки домкратами`,
            params: [{
                name: 'В прямом участке',
                value: 15
              },
              {
                name: 'В кривой радиусом 800м и более',
                value: 10
              },
              {
                name: 'В кривой радиусом 500-799м',
                value: 10
              },
            ]

          },
          {
            id: 2,
            name: `Рихтовка гидравлическими приборами`,
            params: [{
                name: 'В прямом участке',
                value: 15
              },
              {
                name: 'В кривой радиусом 800м и более',
                value: 15
              },
              {
                name: 'В кривой радиусом 500-799м',
                value: 10
              },
            ]

          },
          {
            id: 3,
            name: `Вырезка балласта до уровня подошвы шпал на длине пути до 5 м`,
            params: [{
                name: 'В прямом участке',
                value: 20
              },
              {
                name: 'В кривой радиусом 800м и более',
                value: 15
              },
              {
                name: 'В кривой радиусом 500-799м',
                value: 10
              },
            ]


          },
          {
            id: 4,
            name: `Одиночная смена шпал с вывеской решетки до 2 см при условии, что между одновременно заменяемыми шпалами расположено не менее 20-ти прикрепленных шпал`,
            params: [{
                name: 'В прямом участке',
                value: 15
              },
              {
                name: 'В кривой радиусом 800м и более',
                value: 15
              },
              {
                name: 'В кривой радиусом 500-799м',
                value: 10
              },
            ]


          },
          {
            id: 5,
            name: `Одиночная смена не более 3-х шпал в одном месте без вывески решетки при условии, что между заменяемыми участками шпал расположено не менее 20-ти прикрепленных шпал`,
            params: [{
                name: 'В прямом участке',
                value: 20
              },
              {
                name: 'В кривой радиусом 800м и более',
                value: 15
              },
              {
                name: 'В кривой радиусом 500-799м',
                value: 10
              },
            ]
          },
          {
            id: 6,
            name: `Одиночная смена не более 3-х шпал в одном месте без вывески решетки при условии, что между заменяемыми участками шпал расположено не менее 20-ти прикрепленных шпал с вывеской решетки до 2 см`,
            params: [{
                name: 'В прямом участке',
                value: 10
              },
              {
                name: 'В кривой радиусом 800м и более',
                value: 10
              },
              {
                name: 'В кривой радиусом 500-799м',
                value: 5
              },
            ]
          }

        ],

      }

    },

    computed: {
      isSelected() {
        for (let i in this.names) {
          if (this.selected == this.names[i].id) {
            return this.names[i].params
          }
        }
      },
      isSuccess() {
        console.log('123123', this.isSuccessMethod())
        if (this.isSuccessMethod()) {
          console.log('true')
          return true
        }
      }

    },
    methods: {
      test() {
        this.selected_2 = ''
        this.valid_temp = '-'
      },

      isSuccessMethod() {
        if (this.selected_2 !== '') {
          if (localStorage.getItem('fixation_temp') === null) {
            localStorage.setItem('fixation_temp', 0)
          }
          let fixationTemp = parseFloat(localStorage.getItem('fixation_temp'))
          let rail_temp = parseFloat((JSON.parse(localStorage.getItem('current_weather'))).main.rail)
          this.valid_temp = parseInt(this.selected_2) + fixationTemp
          if (this.valid_temp >= rail_temp) {
            this.isFailResult = false
            return true
          } else {
            if (localStorage.getItem('data_5/3') !== null) {
              let DATA = JSON.parse(localStorage.getItem('data_5/3'))
              let list = DATA.list
              for (let i in list) {
                if (list[i].main.rail <= this.valid_temp) {
                  let date = new Date(list[i].date)
                  this.nearest_valid_date = date.toLocaleString()
                  break;
                }
              }
              this.isFailResult = true
            } else {
              this.nothing_data = true
              this.isFailResult = true
            }
            return false
          }
          console.log(rail_temp)
          return true
        } else {
          this.isFailResult = false
        }
      }
    }

  }

</script>

<style>
  .unsel {
    color: #bbbbbb;
    font-weight: 100;
  }

</style>
