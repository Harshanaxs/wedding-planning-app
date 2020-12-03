<template>
  <div>
    <layout>
      <div slot="main">
        <v-container>
          <v-row>
            <v-col cols="4">
              <v-list>
                <v-list-item>
                  <v-list-item-content>

                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="8"></v-col>
          </v-row>
        </v-container>


      </div>
    </layout>

  </div>
</template>

<script>

import layout from '@/components/layout.vue';
import {db} from 'firebase.js';
export default {
  components:{
    layout
  },
  data(){
    return {
        
    }
  },
  methods:{

  },
  computed:{

  },
  firestore:{

  }
}
</script>