export const state = () =>({
    beforeTraceImages:[], //
    afterTraceImages:[], //
    isProcessingTrace:[]
});

export const mutations = {
    //before
    loadBeforeTraceImages(state,payload){
        state.beforeTraceImages = payload;
    },
    concatBeforeTraceImages(state, payload) {
        state.beforeTraceImages = state.beforeTraceImages.concat(payload);
    },
    removeBeforeTraceImages(state, payload){
        state.beforeTraceImages.splice(payload,1);
    },
    // after
    loadAfterTraceImages(state,payload){
        state.afterTraceImages = payload;
    },
    concatAfterTraceImages(state, payload) {
        state.afterTraceImages = state.afterTraceImages.concat(payload);
    },
    removeAfterTraceImages(state, payload){
        state.afterTraceImages.splice(payload,1);
    },
    switchIsProcessingTrace(state, payload){
        state.isProcessingTrace[payload.index] = payload.switch;
    },
};

export const actions = {
    async loadBeforeTraceImages({ commit }){
        try{
            const res = await this.$axios.get('http://localhost:3085/trace/loadBeforeTraceImages', {
                withCredentials: true,
            });
            console.log('helloRes in LoadBTIP',res.data);
            commit('loadBeforeTraceImages',res.data);
        } catch(err){
            console.error(err);
        }
    },
    async uploadBeforeTraceImages({ commit }, payload) {
        try{
            const res = await this.$axios.post('http://localhost:3085/trace/uploadBeforeTraceImages', payload, {
              withCredentials: true,
            });
            console.log('res',res);
            commit('concatBeforeTraceImages',res.data);

        } catch(err){
            console.error(err);
        }
    },
    async removeBeforeTraceImages({commit, state},payload){
        try{
            console.log(state.beforeTraceImages, payload);
            const imgId = state.beforeTraceImages[payload.index].id;
            const res = await this.$axios.delete(`http://localhost:3085/trace/removeBeforeTraceImages/${imgId}` ,{
                withCredentials: true,
            })
            commit('removeBeforeTraceImages',payload.index);
        } catch(err){
            console.error(err);
        }
    },
    async processingTrace({ commit,state }, payload){
        try{
            const imgId = state.beforeTraceImages[payload.index].id;
            await commit('switchIsProcessingTrace',{'index':payload.index, 'switch':true});
            console.log('processingTrace Go!',imgId);
            const res = await this.$axios.get(`http://localhost:3085/trace/processingTrace?imgId=${imgId}`, { 
                withCredentials: true,
            });
            await this.$axios.delete(`http://localhost:3085/trace/removeBeforeTraceImages/${imgId}` ,{
                withCredentials: true,
            })
            await commit('switchIsProcessingTrace',{'index':payload.index, 'switch':false});
            console.log('res.data',res.data);
            if(res.data) commit('concatAfterTraceImages',res.data);
        } catch(err){

        }
    },
    
    //after
    async loadAfterTraceImages({ commit },payload){
        try{
            const res = await this.$axios.get('http://localhost:3085/trace/loadAfterTraceImages', {
                withCredentials: true,
            });
            commit('loadAfterTraceImages',res.data);
        } catch(err){
            console.error(err);
        }
    },
    async uploadAfterTraceImages({ commit }, payload) {
        try{
            const res = await this.$axios.post('http://localhost:3085/trace/uploadAfterTraceImages', payload, {
              withCredentials: true,
            });
            console.log('res',res);
            commit('concatAfterTraceImages',res.data);

        } catch(err){
            console.error(err);
        }
    },
    async removeAfterTraceImages({commit, state},payload){
        try{
            console.log(state.afterTraceImages, payload);
            const imgId = state.afterTraceImages[payload.index].id;
            const res = await this.$axios.delete(`http://localhost:3085/trace/removeAfterTraceImages/${imgId}` ,{
                withCredentials: true,
            })
            commit('removeAfterTraceImages',payload.index)
        } catch(err){
            console.error(err);
        }
    },
    async downloadAfterTraceImages({commit, state}, payload){
        try{
            const imgId = state.afterTraceImages[payload.index].id;
            const res = await this.$axios.get(`http://localhost:3085/trace/downloadAfterTraceImages?imgId=${imgId}`,{
                withCredentials:true,
            })
            console.log('downloadRes',res);

        } catch(err){
            console.error(err);
        }
    },
    
}
