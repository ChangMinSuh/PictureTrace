<template>
  <v-dialog
    v-model="dialog"
    width="80%"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        text
        color="purple lighten-4"
        v-bind="attrs"
        v-on="on"
        @click="upViews(index)"
      >
        more
      </v-btn>
    </template>
    <v-card
      outlined
    >
      <v-form ref="updateForm" v-model="updateValid" @submit.prevent="updateOnSubmitForm">
        <v-container>
          <v-card-title v-if="!onUpdate">
            <span class="headline">{{ preventPost.title }}</span>
          </v-card-title>
          <v-card-title v-else>
            <v-text-field
              v-model="title"
              :rules="titleRules"
            />
          </v-card-title>
          <br>
          <v-card-text>
            <v-row>
              <v-spacer />
              by: {{ nickname }}
              views: {{ preventPost.views }}
              <br>
              <div>
                {{ preventPost.createdAt }}
              </div>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-text>
            <div v-if="!onUpdate" v-html="contentHtml" />
            <v-textarea 
              v-else 
              v-model="content"
              filled
              :rules="contentRules"
            />
          </v-card-text>
          <v-carousel
            v-if="!onUpdate && preventPost.PreventionImages.length > 0"
            height="400"
            hide-delimiter-background
            show-arrows-on-hover
          >
            <v-carousel-item
              v-for="(PreventionImage, i) in preventPost.PreventionImages"
              :key="i"
              :src="`http://localhost:3085/img/${PreventionImage.filePath}`"
              contain
            />
          </v-carousel>
        </v-container>
        <v-card-actions v-if="!onUpdate">
          <v-btn
            v-if="loginUser && loginUser.id === preventPost.UserId"
            type="button"
            color="green darken-1"
            text
            @click="updatePost(index)"
          >
            Update
          </v-btn>
          <v-btn
            v-if="loginUser && loginUser.id === preventPost.UserId"
            type="button"
            color="green darken-1"
            text
            @click="deletePost(index)"
          >
            Delete
          </v-btn>
          <v-spacer />
          <v-btn
            type="button"
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer />
          <v-btn
            type="button"
            color="green darken-1"
            text
            @click="onUpdate=false"
          >
            back
          </v-btn>
          <v-btn
            type="submit"
            color="green darken-1"
            text
            :disabled="!updateValid"
          >
            Complete
          </v-btn>
        </v-card-actions>      
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props:{ //부모로 부터 데이터를 받음
    preventPost:{
      type: Object,
      required: true,
    },
    index:{
      type:Number,
      required: true,
    },
  },
  data(){
    return{
      title: '',
      content: '',
      updateValid:false,
      dialog: false,
      onUpdate: false,
      titleRules: [
        v => !!v || 'title is required.'
      ],
      contentRules: [
        v => !!v || 'content is required.'
      ],
    }
  },
  computed:{
    ...mapState('users',['loginUser']),
    contentHtml(){
      return this.preventPost.content.split('\n').join('<br />')
    },
    nickname(){
      return this.preventPost.UserId === null ? '알수없음' : this.preventPost.User.nickname;
    }
  },
  methods:{
    async updateOnSubmitForm(){
      try{
        if(this.$refs.updateForm.validate()){
          this.onUpdate = false; 
          await this.$store.dispatch('prevention/updatePreventionPost',{
            title: this.title,
            content: this.content,
            index: this.index,
          });
        }
      } catch(err){
        console.error(err);
      }
    },
    updatePost(index){
      this.title = this.preventPost.title;
      this.content = this.preventPost.content;
      this.onUpdate = true;
    },
    deletePost(index){
      const answerCon = confirm('정말 삭제하겠습니까?');
      if(answerCon){
        console.log('vue index',index);
        this.$store.dispatch('prevention/removePreventionPost',{index});
        this.dialog = false;
      }
    },
    upViews(index){
      this.$store.dispatch('prevention/upViews',{index});
    },
  }
}
</script>

<style>

</style>