<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <template #activator="{ on, attrs }">
        <v-spacer />
        <v-btn
          text
          color="purple lighten-4"
          v-bind="attrs"
          v-on="on"
        >
          <div style="color:#c79cc8; "> 
            Sign Up
          </div>
        </v-btn>
      </template>
      <v-card
        outlined
      >
        <v-card-title class="headline">
          <v-container>
            Sign Up
          </v-container>
        </v-card-title>
        <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
          <v-card-text>
            <v-container style="width: 85%;">
              <v-text-field
                v-model="email"
                color="purple lighten-4"
                label="이메일 *"
                type="email"
                :rules="emailRules"
                required
              />
              <v-text-field
                v-model="nickname"
                color="purple lighten-4"
                label="닉네임 *"
                type="string"
                :rules="nicknameRules"
                required
              />
              <v-text-field
                v-model="password"
                color="purple lighten-4"
                label="비밀번호 *"
                type="password"
                :rules="passwordRules"
                required
              />
              <v-text-field
                v-model="passwordCheck"
                color="purple lighten-4"
                label="비밀번호 확인 *"
                type="password"
                :rules="passwordCheckRules"
                required
              />
              <small>*indicates required field</small>
            </v-container>
          </v-card-text>
          <v-card-actions style="width: 98%;">
            <v-spacer />
            <v-btn
              color="purple lighten-4"
              text
              @click="dialog = false"
            >
              CLOSE
            </v-btn>
            <v-btn
              color="purple lighten-4"
              text
              type="submit"
              :disabled="!valid"
            >
              SAVE
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    data(){
        return{
            valid: false,
            dialog: false,
            email:'',
            nickname: '',
            password: '',
            passwordCheck: '',
            emailRules:[
              v => !!v || 'Email is required.',
              v => /.+@.+/.test(v) || 'The email is not valid.'
            ],
            nicknameRules:[ 
                v => !!v || 'Nickname is required.',
            ],
            passwordRules: [
                v => !!v || 'Password is required.'
            ],
            passwordCheckRules:[
                v => !!v || 'Password_Chk is required.',
                v => v === this.password || 'The password does not match.'
            ]
        }
    },
    computed:{
      serverRes(){
        return this.$store.state.users.serverRes;
      }
    },
    methods: {
      async onSubmitForm(){
        if(this.$refs.form.validate()){
          try{
            await this.$store.dispatch('users/signUp',{
              nickname: this.nickname,
              email: this.email,
              password: this.password,
            })
            if(this.serverRes){ //서버의 응답이 왔다면.
              alert(this.serverRes.message);
              if(!this.serverRes.errorCode){
                this.dialog = false;
                this.email = '';
                this.nickname = '';
                this.password = '';
                this.passwordCheck = '';
              }
              this.$store.commit('users/setServerRes',null);
            }
          } catch (err){
            console.error(err);
          }
        }
      }
    }
  }
</script>