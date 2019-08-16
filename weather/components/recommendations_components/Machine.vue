<template>
  <div>
    <div class="tile is-ancestor ">
      <div class="tile is-vertical is-parent">
        <div class="tile is-child box">
          <div class="select select-1 is-fullwidth">
            <select v-model="selected_1" @change="unselect_selected_2">
              <option class="unsel" disabled value="">Выберите тип машины</option>
              <option v-for="item in names" :key="item.id" :value='item.id'>
                {{item.name}}
              </option>
            </select>
          </div>
          <div>
            <div class="select select-1 is-fullwidth">
              <select v-model="selected_2">
                <option class="unsel" disabled value="">Выберите участок пути</option>
                <option v-for="param in isSelected" :key="param.id" :value='param.params'>
                  {{param.name}}
                </option>
              </select>
            </div>
            <!-- 
            <div v-for="item in selected_2" :key="item.id">
              {{item.name}}: {{item.value}}
            </div>
            <div>
              критические температуры: повышения: {{valid_temp_high}}, понижения: {{valid_temp_low}}
            </div>-->
          </div>
        </div>
        <div class="level">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">допустимая максимальная температура</p>
              <p class="title">{{valid_temp_high + '°C'}}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">допустимая минимальная температура</p>
              <p class="title"> {{valid_temp_low + '°C'}}</p>
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
        selected_1: '',
        selected_2: '',
        isFailResult: false,
        valid_temp_high: '-',
        valid_temp_low: '-',
        nearest_valid_date: false,
        noting_data: false,
        names: [{
            id: 1,
            name: `Щебнеочистительные баровые: ЩОМ-6Б,СЧ - 600, СЧ - 601, СЧУ - 800, РМ - 76, RM80, РМ - 2002, ОТ - 400, ОТ - 800, АХМ - 801`,
            params: [{
                name: 'в прямых участках и в кривых радиусом 800м и более',
                params: [{
                  name: 'повышения',
                  value: '15'
                }, {
                  name: 'понижения',
                  value: '25'
                }]
              },
              {
                name: 'в кривых радиусом менее 800 м',
                params: [{
                  name: 'повышения',
                  value: '10'
                }, {
                  name: 'понижения',
                  value: '20'
                }]
              },
            ]
          },
          {
            id: 2,
            name: `Щебнеочистительные роторные: ЩОМ-6Р, УМ-М`,
            params: [{
                name: 'в прямых участках и в кривых радиусом 800м и более',
                params: [{
                  name: 'повышения',
                  value: '20'
                }, {
                  name: 'понижения',
                  value: '25'
                }]
              },
              {
                name: 'в кривых радиусом менее 800 м',
                params: [{
                  name: 'повышения',
                  value: '15'
                }, {
                  name: 'понижения',
                  value: '20'
                }]
              },
            ]
          },
          {
            id: 3,
            name: `Балластировочные и рихтовочные: ЭЛБ-3, ЭЛБ-4, ЭЛБ-1Р, ЭЛБ-ЗМК, Р-2000, Р-02, ПРБ`,
            params: [{
                name: 'в прямых участках и в кривых радиусом 800м и более',
                params: [{
                  name: 'повышения',
                  value: '10'
                }, {
                  name: 'понижения',
                  value: '30'
                }]
              },
              {
                name: 'в кривых радиусом менее 800 м',
                params: [{
                  name: 'повышения',
                  value: '5'
                }, {
                  name: 'понижения',
                  value: '25'
                }]
              },
            ]
          },
          {
            id: 4,
            name: `Выправочно-подбивочные: ВПО-3000, ВПО-3-3000, 20 15 30 25 ВПР-1200, ВПР-02, «Дуоматик», ВПРС-500, ВПРС-02, ВПРС-03, «Унимат», Динамик 09-3х`,
            params: [{
                name: 'в прямых участках и в кривых радиусом 800м и более',
                params: [{
                  name: 'повышения',
                  value: '20'
                }, {
                  name: 'понижения',
                  value: '30'
                }]
              },
              {
                name: 'в кривых радиусом менее 800 м',
                params: [{
                  name: 'повышения',
                  value: '15'
                }, {
                  name: 'понижения',
                  value: '25'
                }]
              },
            ]
          },
          {
            id: 5,
            name: `Вакуумная уборочная машина СМ ВУ-1800`,
            params: [{
                name: 'в прямых участках и в кривых радиусом 800м и более',
                params: [{
                  name: 'повышения',
                  value: '15'
                }, {
                  name: 'понижения',
                  value: '30'
                }]
              },
              {
                name: 'в кривых радиусом менее 800 м',
                params: [{
                  name: 'повышения',
                  value: '10'
                }, {
                  name: 'понижения',
                  value: '25'
                }]
              },
            ]
          },
          {
            id: 6,
            name: `Динамические стабилизаторы: ДСП, ДСПС, СПП`,
            params: [{
                name: 'в прямых участках и в кривых радиусом 800м и более',
                params: [{
                  name: 'повышения',
                  value: '25'
                }, {
                  name: 'понижения',
                  value: 'без ограничений'
                }]
              },
              {
                name: 'в кривых радиусом менее 800 м',
                params: [{
                  name: 'повышения',
                  value: '25'
                }, {
                  name: 'понижения',
                  value: 'без ограничений'
                }]
              },
            ]
          },
        ],

      }

    },

    computed: {

      isSelected() {
        for (let i in this.names) {
          if (this.selected_1 == this.names[i].id) {
            return this.names[i].params
          }
        }
      },
      isSuccess() {
        if (this.isSuccessMethod()) {
          return true
        }
      }
    },
    methods: {
      unselect_selected_2() {
        this.selected_2 = ''
        this.valid_temp_high ='-'
        this.valid_temp_low ='-'
      },
      isSuccessMethod() {
        if (this.selected_2 !== '') {
          let fixationTemp = parseFloat(localStorage.getItem('fixation_temp'))
          let rail_temp = parseFloat((JSON.parse(localStorage.getItem('current_weather'))).main.rail)
          let temp_high = parseInt(this.selected_2[0].value)
          let temp_low = parseInt(this.selected_2[1].value)
          if (isNaN(temp_low)) {
            temp_low = 400
          }
          this.valid_temp_high = fixationTemp + temp_high
          this.valid_temp_low = fixationTemp - temp_low
          if (this.valid_temp_high >= rail_temp && rail_temp >= this.valid_temp_low) {
            this.isFailResult = false
            return true
          } else {
            if (localStorage.getItem('data_5/3') !== null) {
              let DATA = JSON.parse(localStorage.getItem('data_5/3'))
              let list = DATA.list
              for (let i in list) {
                if (this.valid_temp_low <= list[i].main.rail && list[i].main.rail <= this.valid_temp_high) {
                  let date = new Date(list[i].date)
                  this.nearest_valid_date = date.toLocaleString()
                  break;
                }
              }
              this.nothing_data = false
              this.isFailResult = true
            } else {
              this.nothing_data = true
              this.isFailResult = true
            }
            return false
          }
          return true
        } else {
          this.isFailResult = false
        }
      }
    }

  }

</script>

<style>

</style>
