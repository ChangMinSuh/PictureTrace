<template>
  <div>
    <!-- Nav -->
    <nav id="nav">
      <ul>
        <li><a href="#intro" class="active">Introduction</a></li>
        <li><a href="#image-proof">Image Proof</a></li>
        <li><a href="#prevention">Prevention</a></li>
      </ul>
    </nav>
    <!-- Main -->
    <div id="main">
      <!-- Introduction -->
      <v-container id="intro" class="main overflow-y-auto">
        <div class="spotlight">
          <div class="content">
            <header class="major">
              <h2>Introdution</h2>
            </header>
            <p>
              1. 원작자의 정보를 숨겨진 메시지에 저장시켜 주는 기능<br>
              2. 도용된 사례를 업로드할 수 있는 게시판<br>
              3. 신고받은 사례를 원작자에게 이메일로 알려주는 기능<br>
            </p>
          </div>
          <span class="image"><img src="~/assets/images/logo.jpg" alt=""></span>
        </div>
      </v-container>

      <!-- Image Proof Section -->
      <section id="image-proof" class="main special">
        <header class="major">
          <h2>Image Proof</h2>
        </header>

        <image-proof />
      </section>

      <!-- Second Section -->
      <section id="prevention" class="main special">
        <header class="major">
          <h2>Prevention</h2>
        </header>
        
        <v-container>
          <v-row>
            <v-spacer />
            <v-btn
              color="purple lighten-4"
              :disabled="!loginUser"
              @click="showWrite = !showWrite"
            >
              <div style="color:white;">
                글쓰기
              </div>
            </v-btn>
          </v-row>
        </v-container>
        <v-container>
          <v-expand-transition>
            <div v-show="showWrite">
              <v-form id="preventionForm" ref="preventionForm" v-model="preventionValid" @submit.prevent="preventionOnSubmitForm">
                <v-container>
                  <v-text-field 
                    v-model="writeTitle"
                    color="purple lighten-4"
                    :rules="titleRules"
                    label="Title"
                    type="title"
                    required
                    outlined
                  />
                  <v-textarea 
                    v-model="writeContent"
                    outlined
                    no-resize
                    rows="10"
                    color="purple lighten-4"
                    :rules="contentRules"
                    label="Content"
                    required
                  />
                  <input
                    ref="imageInput"
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    @change="uploadPreventionImages"
                  >
                  <v-btn
                    type="button"
                    color="purple lighten-4"
                    @click="onClickImageUpload"
                  >
                    <div style="color:white;">
                      이미지 업로드
                    </div>
                  </v-btn>

                  <v-btn
                    text
                    color="purple lighten-4"
                    :disabled="!preventionValid || !loginUser" 
                    type="submit"
                  >
                    <div style="color:#c79cc8; "> 
                      Complete 
                    </div>
                  </v-btn>
                </v-container>
              </v-form>
              <v-container>
                <v-row>
                  <v-col
                    v-for="(inputImage,index) in writeInputImages"
                    :key="inputImage.id"  
                    class="d-flex child-flex"
                    cols="4"
                  >
                    <v-hover>
                      <template #default="{ hover }">
                        <v-card
                          class="mx-auto"
                          max-width="250"
                          max-height="250"
                        >
                          <v-img 
                            :src="`http://localhost:3085/img/${inputImage.destination}/${inputImage.filename}`" 
                            aspect-ratio="1"
                            max-height="200"
                            contain
                            class="white lighten-2"
                          >
                            <template #placeholder>
                              <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                              >
                                <v-progress-circular
                                  indeterminate
                                  color="grey lighten-5"
                                />
                              </v-row>
                            </template>
                          </v-img>
                          <v-fade-transition>
                            <v-overlay
                              v-if="hover"
                              absolute
                            >
                              <div>
                                <v-btn
                                  class="mx-2"
                                  fab
                                  small
                                  color="#efa8b0"
                                  @click="removeInputImage(index)"
                                >
                                  <v-icon color="white">
                                    mdi-delete
                                  </v-icon>
                                </v-btn>
                              </div>
                            </v-overlay>
                          </v-fade-transition>
                        </v-card>
                      </template>
                    </v-hover>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider />
            </div>
          </v-expand-transition>
        </v-container>
        <v-row>
          <v-col
            v-for="(post, index) in preventionPostsPage"
            :key="index"
            cols="4"
          >
            <v-card
              class="mx-auto"
              max-width="344"
              outlined
            >
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="headline mb-1">
                    {{ post.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ post.content }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar
                  color="purple lighten-4"
                  size="50"
                >
                  <div v-if="post.UserId === null" style="color:white;">
                    알수없음
                  </div>
                  <div v-else style="color:white;">
                    {{ post.User.nickname }}
                  </div>
                </v-list-item-avatar>
              </v-list-item>

              <v-card-actions>
                <prevention-post-more :prevent-post="post" :index="showPosts * (page - 1) + index" />
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-container>
          <v-pagination
            v-model="page"
            :length="preventionPostsPageLength"
            circle
            color="purple lighten-4"
            total-visible="5"
          />
        </v-container>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ImageProof from '~/components/imageProof';
import PreventionPostMore from '~/components/preventionPostMore';

export default {
  components:{
    ImageProof,
    PreventionPostMore,
  },
  middleware({ store }){ // 화면이 뜨기전에 미리 서버에서 로딩해오는것
    console.log('middleware');
    return store.dispatch('prevention/loadPreventionPosts');
  },
  data () {
    return{
      writeTitle: '',
      writeContent: '',
      showWrite : false,
      preventionValid: false,
      titleRules: [
          v => !!v || 'title is required.'
      ],
      contentRules: [
          v => !!v || 'content is required.'
      ],
      page: 1 ,
      showPosts : 6,
    }
  },
  computed:{
    ...mapState('users',['loginUser']),
    ...mapState('prevention',['preventionPosts','writeInputImages']),
    preventionPostsPageLength(){
      return Math.ceil(this.preventionPosts.length / this.showPosts);
    },
    preventionPostsPage(){
      const start = this.showPosts * (this.page - 1);
      const end = this.showPosts * this.page;
      return this.preventionPosts.slice(start,end);
    }
  },
  methods:{
    async preventionOnSubmitForm(){
      try{
        if(this.$refs.preventionForm.validate()){
          await this.$store.dispatch('prevention/uploadPreventionPost',{
            title: this.writeTitle,
            content: this.writeContent,
          });
          this.writeTitle = '';
          this.writeContent = '',
          this.showWrite = false;
        }
      } catch(err){
        console.error(err);
      }
    },
    onClickImageUpload(){
      this.$refs.imageInput.click();
    }
    ,
    async uploadPreventionImages(e){
      const imageFormData = new FormData();
      [].forEach.call(e.target.files, file => {imageFormData.append('image',file)}) 
      await this.$store.dispatch('prevention/uploadPreventionImages',imageFormData);
    },
    async removeInputImage(index){
      this.$store.dispatch('prevention/removePreventionImage',{index});
    }
  }
}
</script>

<style>

</style>