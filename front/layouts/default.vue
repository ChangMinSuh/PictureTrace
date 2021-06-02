<template>
  <v-app>
    <div class="is-preload ">
      <!-- Wrapper -->
      <div id="wrapper">
        <!-- Header -->
        <header id="header" class="alt">
          <v-avatar
            size="80"
          >
            <img
              src="~/assets/images/logo.jpg"
              alt=""
            >
          </v-avatar>      
          <h1>
            Picture Trace
          </h1>
          <login-form v-if="!loginUser" />
          <v-container>
            <div v-if="loginUser">
              <div style="color: white;">
                Hello {{ loginUser.nickname }}!
              </div>
            </div>
          </v-container>
          <v-btn
            v-if="loginUser"
            color="white darken-1"
            text
            @click="onLogout"
          >
            logout
          </v-btn>
        </header>
        
        <nuxt />

        <!-- Footer -->
        <footer id="footer">
          <section>
            <h2>PICTURE TRACE</h2>
            <p>저작권의 도용이 많아 저작권의 관심이 높아지는 지금, 사진 및 그림의 저작권 증명 및 도용을 탐지하는 프로그램.</p>
            <dir>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn 
                    dark
                    icon
                    href="https://youtu.be/v2-LISummBM"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>
                      mdi-youtube
                    </v-icon>
                  </v-btn>
                </template>
                중간보고서
              </v-tooltip>
            </dir>
          </section>
          <section>
            <h2>Bae Undefined</h2>
            <dl class="alt">
              <dt>Leader</dt>
              <dd>배수광 (컴퓨터정보공학부 201620660) </dd>
              <dt>Members</dt>
              <dd>신재욱 (컴퓨터정보공학부 201620767)</dd>
              <dd>서창민 (컴퓨터정보공학부 201620695)</dd>
            </dl>
          </section>
          <p class="copyright">
            &copy; Untitled. Design: <a href="https://html5up.net">HTML5 UP</a>.
          </p>
        </footer>
        <nuxt-link to="#top" class="smoothup" title="Back to top">
          <span class="genericon genericon-collapse" />
        </nuxt-link>
      </div>
    </div>
  </v-app>
</template>

<script>
import LoginForm from '~/components/LoginForm';

export default {
    components:{
        LoginForm
    },
    computed:{
      loginUser(){
        return this.$store.state.users.loginUser;
      }
    },
    methods: {
        onLogout(){
            this.$store.dispatch('users/logout');
        }
    }
}
</script>

<style>
</style>