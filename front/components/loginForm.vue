<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          text
          v-bind="attrs"
          color="white"
          v-on="on"
        >
          login
        </v-btn>
      </template>

      <v-card 
        outlined
      >
        <v-container>
          <v-card-title class="white">
            LOGIN
            <v-spacer />
            <signup-form />
          </v-card-title>
        </v-container>
        <v-form id="loginForm" ref="form" v-model="valid" @submit.prevent="onSubmitForm">
          <v-container style="width: 80%;">
            <div>
              <v-text-field 
                v-model="email"
                color="purple lighten-4"
                :rules="emailRules"
                label="email"
                type="email"
                required
              />
              <v-text-field 
                v-model="password"
                color="purple lighten-4"
                :rules="passwordRules"
                label="password"  
                type="password"
                required
              />
            </div>
          </v-container>

          <v-card-actions style="width: 98%;">
            <v-spacer />
            <v-btn
              text
              color="purple lighten-4"
              @click="dialog = false"
            >
              <div style="color:#c79cc8; ">
                Close 
              </div>
            </v-btn>
            <v-btn
              text
              color="purple lighten-4"
              :disabled="!valid"
              type="submit"
            >
              <div style="color:#c79cc8; "> 
                LOGIN 
              </div>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import SignupForm from '~/components/SignupForm';
  import { mapState } from 'vuex';

  export default {
    components:{
        SignupForm
    },
    data() {
        return{
          dialog: false,
          valid:false,
          email: '',
          password: '',
          emailRules:[
              v => !!v || 'Email is required.',
              v => /.+@.+/.test(v) || 'The email is not valid.'
          ],
          passwordRules: [
              v => !!v || 'Password is required.'
          ],
        }
    },
    
    computed:{
      ...mapState('users',['loginUser','serverRes']),
    },
    methods:{
      async onSubmitForm(){
        if(this.$refs.form.validate()){
          try{
            await this.$store.dispatch('users/login',{
              email: this.email,
              password: this.password,
            })
            if(this.serverRes){ //서버의 응답이 왔다면.
              alert(this.serverRes.message);
              if(!this.serverRes === null){
                this.dialog = false;
              }
              this.$store.commit('users/setServerRes',null);
            }
          } catch(err){
            console.error(err);
          }
        }
      }
    }
  }
</script>

<style scoped>
</style>