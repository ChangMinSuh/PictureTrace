<template>
  <v-container>
    <v-stepper
      v-model="e13"
      vertical
    >
      <v-stepper-step
        step="1"
        color="#a77ca8"
        editable
        :complete="e13 > 1"
        :rules="[() => true]"
      >
        Read Me
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card>
          <v-card-text
            color="white lighten-1"
            class="mb-12"
            height="200px"
            style="line-height:300%; text-align:left;"
          >
            <ol>
              <li>
                <strong>Select Image</strong>에 메세지를 숨길 이미지 업로드
              </li>
              <li>
                업로드된 이미지에 마우스를 올려 실행
                <v-btn
                  class="mx-2"
                  fab
                  x-small
                  color="#c79cc8"
                >
                  <v-icon color="white">
                    mdi-check
                  </v-icon>
                </v-btn>
                혹은 삭제
                <v-btn
                  class="mx-2"
                  fab
                  x-small
                  color="#efa8b0"
                >
                  <v-icon color="white">
                    mdi-delete
                  </v-icon>
                </v-btn> 
                버튼 클릭
              </li>
              <li>
                <strong>Select Image</strong>에서 실행 완료된 이미지는
                <strong>Download Image</strong>로 이동
              </li>
              <li>
                <strong>Download Image</strong>에서 원하는 이미지에 마우스를 올려 다운로드
                <v-btn
                  class="mx-2"
                  fab
                  x-small
                  color="#c79cc8"
                >
                  <v-icon color="white">
                    mdi-download
                  </v-icon>
                </v-btn>
                , 삭제
                <v-btn
                  class="mx-2"
                  fab
                  x-small
                  color="#efa8b0"
                >
                  <v-icon color="white">
                    mdi-delete
                  </v-icon>
                </v-btn>
                , 더 많은 이미지 정보
                <v-btn
                  class="mx-2"
                  fab
                  x-small
                  color="#a89cc8"
                >
                  <v-icon color="white">
                    mdi-dots-horizontal
                  </v-icon>
                </v-btn>
                버튼 클릭
              </li>
            </ol>
            <ul>
              <li>이미지의 사이즈가 큰 경우, 서버 내에 이미지 인코딩이 오래걸릴 수 있습니다.</li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="#c79cc8"
              @click="e13 = 2"
            >
              <div style="color:white;">
                Next
              </div>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-step
        step="2"
        color="#a77ca8"
        editable
        :complete="e13 > 2"
        :rules="[() => true]"
      >
        Select Image
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card
          outline
        >
          <label for="inputFiles">
            upload image file
          </label>
          <v-file-input
            id="inputFiles"
            v-model="inputFiles"
            :disabled="!loginUser"
            multiple
            flat
            label="jpg"
            prepend-icon="mdi-image"
            :show-size="1000"
            @change="uploadBeforeTraceImages"
          />
          <v-container>
            <v-row>
              <v-col
                v-for="(file,index) in beforeTraceImages"
                :key="file.id"  
                class="d-flex child-flex"
                cols="4"
              >
                <v-hover>
                  <template #default="{ hover }">
                    <v-card
                      class="mx-auto"
                      max-width="250"
                      max-height="250"
                      :loading="isProcessingTrace[index]"
                    >
                      <v-card-text
                        v-if="isComplete[index]"
                        style="text-align:center;"
                      >
                        <div>
                          success!
                        </div>
                      </v-card-text>
                      <template slot="progress">
                        <v-progress-linear
                          v-model="processTrace[index]"
                          color="#975c88"
                          height="5"
                          indeterminate
                        />
                      </template>
                      <v-img 
                        :src="`http://localhost:3085/img/${file.filePath}`" 
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
                      <v-fade-transition
                        v-if="!isComplete[index]"
                      >
                        <v-overlay
                          v-if="hover"
                          absolute
                        >
                          <div v-if="!isProcessingTrace[index]">
                            <v-btn
                              class="mx-2"
                              fab
                              small
                              color="#efa8b0"
                              @click="removeBeforeTraceImages(index)"
                            >
                              <v-icon color="white">
                                mdi-delete
                              </v-icon>
                            </v-btn>
                            <v-btn
                              class="mx-2"
                              fab
                              small
                              color="#c79cc8"
                              @click="processingTrace(index)"
                            >
                              <v-icon color="white">
                                mdi-check
                              </v-icon>
                            </v-btn>
                          </div>
                          <div v-else>
                            <v-list>
                              <v-list-item>
                                <v-list-item-content>
                                  <v-list-item-title>Processing... </v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>

                              <v-list-item>
                                <v-list-item-content>
                                  <v-list-item-title>info</v-list-item-title>
                                  <v-list-item-subtitle>{{ file.fileName }}</v-list-item-subtitle>
                                  <v-list-item-subtitle>{{ file.fileSize }}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </div>
                        </v-overlay>
                      </v-fade-transition>
                    </v-card>
                  </template>
                </v-hover>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="e13 = 1"
              >
                <div style="color:#c79cc8;">
                  back
                </div>
              </v-btn>
              <v-btn
                color="#c79cc8"
                @click="e13 = 3"
              >
                <div style="color:white;">
                  Next
                </div>
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-stepper-content>

      <v-stepper-step
        step="3"
        color="#a77ca8"
        editable
        :complete="e13 > 3"
        :rules="[() => true]"
      >
        Download Image
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-card>
          <v-container>
            <v-row>
              <v-col
                v-for="(file,index) in afterTraceImages"
                :key="file.id"
                class="d-flex child-flex"
                cols="4"
              >
                <v-hover>
                  <template #default="{ hover }">
                    <v-card
                      class="mx-auto"
                      max-width="344"
                    >
                      <v-img
                        :src="`http://localhost:3085/img/${file.filePath}`" 
                        contain
                        aspect-ratio="1"
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
                          v-if="hover || onInfo[index] == true"
                          absolute
                        >
                          <div>
                            <v-card-text contain>
                              {{ file.fileName }}
                            </v-card-text>
                            <v-btn
                              class="mx-2"
                              fab
                              small
                              color="#efa8b0"
                              @click="removeAfterTraceImages(index)"
                            >
                              <v-icon color="white">
                                mdi-delete
                              </v-icon>
                            </v-btn>
                            <v-btn
                              class="mx-2"
                              fab
                              small
                              color="#c79cc8"
                              :href="`http://localhost:3085/trace/downloadAfterTraceImages?imgId=${afterTraceImages[index].id}`"
                            >
                              <v-icon color="white">
                                mdi-download
                              </v-icon>
                            </v-btn>
                            <v-dialog
                              v-model="onInfo[index]"
                              width="600px"
                            >
                              <template #activator="{ on, attrs }">
                                <v-btn
                                  class="mx-2"
                                  fab
                                  small
                                  color="#a89cc8"
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="onInfo[index] = true"
                                >
                                  <v-icon color="white">
                                    mdi-dots-horizontal
                                  </v-icon>
                                </v-btn>
                              </template>
                              <v-card>
                                <v-card-title>
                                  <span class="headline">Metadata</span>
                                </v-card-title>
                                <v-card-text v-if="isFull">
                                  <span v-html="infoFull(index)"></span>
                                </v-card-text>
                                <v-card-text v-else>
                                  <span v-html="infoCore(index)"></span>
                                </v-card-text>
                                <v-card-actions>
                                  <v-spacer />
                                  <v-btn
                                    color="green darken-1"
                                    text
                                    @click="isFull = !isFull"
                                  >
                                    <div v-if="isFull">SHORT</div>
                                    <div v-else>FULL</div>
                                  </v-btn>
                                  <v-btn
                                    color="green darken-1"
                                    text
                                    @click="onInfoOff()"
                                  >
                                    CLOSE
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </div>
                        </v-overlay>
                      </v-fade-transition>
                    </v-card>
                  </template>
                </v-hover>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="e13 = 2"
              >
                <div style="color:#c79cc8;">
                  back
                </div>
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    components: {
      
    },
    data () {
      return {
        e13: 1,
        isComplete: [],
        inputFiles: [],
        inputFilesChange: {},
        processTrace: [],
        isFull: false,
        onInfo: [],
      }
    },
    fetch({ store }){ // 화면이 뜨기전에 미리 서버에서 로딩해오는것
      if(store.state.users.loginUser){
        console.log('imageProff fetch success');
        store.dispatch('trace/loadBeforeTraceImages');
        store.dispatch('trace/loadAfterTraceImages');
      }
    },
    computed:{
      ...mapState('trace',['beforeTraceImages','afterTraceImages','isProcessingTrace']),
      ...mapState('users',['loginUser']),
    },
    methods: {
      async uploadBeforeTraceImages(inputFiles){
        console.log("inputFiles",inputFiles);
        const imageFormData = new FormData();
        inputFiles.forEach(file => {imageFormData.append('image', file)});
        await this.$store.dispatch('trace/uploadBeforeTraceImages', imageFormData);
        console.log('beforeTraceImages',this.$store.state.beforeTraceImages);
      },
      uploadAfterTraceImages(inputFiles){
        console.log("inputFiles",inputFiles);
        const imageFormData = new FormData();
        inputFiles.forEach(file => {imageFormData.append('image', file)});
        this.$store.dispatch('trace/uploadAfterTraceImages', imageFormData);
        console.log('afterTraceImages',this.$store.state.afterTraceImages);
      },
      removeBeforeTraceImages(index){
        this.$store.dispatch('trace/removeBeforeTraceImages',{index});
      },
      removeAfterTraceImages(index){
        this.$store.dispatch('trace/removeAfterTraceImages',{index});
      },
      async downloadAfterTraceImages(index){ // download 서버에 요청 후 응답
        const imgId = this.afterTraceImages[index].id;
        const res = await this.$axios.get(`http://localhost:3085/trace/downloadAfterTraceImages?imgId=${imgId}`,{
          withCredentials:true,
        })
        return res;
      },
      async processingTrace(index){
        try{
          await this.$store.dispatch('trace/processingTrace',{index}); 
          this.isComplete[index] = true;
        } catch(err){
        }
      },
      infoFull(index){
        return this.afterTraceImages[index].AfterInfoFull.fileInfo;
      },
      infoCore(index){
        return this.afterTraceImages[index].AfterInfoCore.fileInfo;
      },
      onInfoOff(index){
        this.onInfo = [];
      }
    },

  }
</script>

<style>
</style>