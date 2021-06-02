export const state = () => ({
    preventionPosts:[],
    writeInputImages:[],
})

export const mutations ={
    loadPreventionPosts (state,payload) {
        state.preventionPosts = payload;
    },
    concatPreventionPost (state, payload){
        state.preventionPosts.unshift(payload);
    },
    concatWriteInputImages(state, payload){
        state.writeInputImages = state.writeInputImages.concat(payload);
    },
    updatePreventionPost(state, payload){
        state.preventionPosts.splice(payload.index,1,payload.data);
    },
    removeWriteInputImage(state, payload){
        state.writeInputImages.splice(payload,1);
    },
    clearWriteInputImages(state){
        state.writeInputImages = [];
    },
    removePreventionPost(state, payload){
        state.preventionPosts.splice(payload,1);
    },
    upViews(state, payload){
        state.preventionPosts[payload.index].views = payload.views;
    }
}
export const actions = {
    async loadPreventionPosts ({commit},payload){
        try{
            console.log('do loadPreventionPosts');
            const res = await this.$axios.get(`http://localhost:3085/prevention`,{
                withCredentials: true
            });
            console.log('res.data',res.data);
            commit('loadPreventionPosts',res.data);
        } catch(err){
            console.error(err);
        }
    },
    async uploadPreventionPost({commit,state}, payload){
        try{
            console.log('do uploadPreventionPost');
            console.log('state.writeInputImages',state.writeInputImages);
            const res = await this.$axios.post(`http://localhost:3085/prevention/upload`,{
                title: payload.title,
                content: payload.content,
                image: state.writeInputImages
            },{
                withCredentials: true
            })
            console.log('res.data',res.data);
            commit('concatPreventionPost',{
                index:payload.index,
                data: res.data
            });
            //commit('clearWriteInputImages');
        } catch(err){
            console.error(err);
        }
    },
    async uploadPreventionImages({commit}, payload){
        try{
            console.log('do uploadPreventionImages');
            const res = await this.$axios.post(`http://localhost:3085/prevention/image`,payload,{
                withCredentials:true
            })
            console.log('res uploadPreventionImages',res.data);
            commit('concatWriteInputImages',res.data);
        } catch(err){
            console.error(err);
        }
    },
    async updatePreventionPost({commit,state}, payload){
        try{
            const imgId = state.preventionPosts[payload.index].id;
            const res = await this.$axios.patch(`http://localhost:3085/prevention/update/${imgId}`,{
                title: payload.title,
                content: payload.content
            },{
                withCredentials:true
            },)
            console.log('update res',res.data);
            commit('updatePreventionPost',{
                index: payload.index,
                data: res.data
            });
        } catch(err){
            console.error(err);
        }
    }
    ,
    async removePreventionImage({commit},payload){
        try{
            commit('removeWriteInputImage',payload.index);
        } catch(err){
            console.error(err);
        }
    },
    async removePreventionPost({commit, state}, payload){
        try{
            console.log('store index',payload.index);
            const imgId = state.preventionPosts[payload.index].id;
            await this.$axios.delete(`http://localhost:3085/prevention/delete/${imgId}`,
            {
                withCredentials: true
            });
            commit('removePreventionPost',payload.index);
        } catch(err){
            console.error(err);
        }
    },
    async upViews({commit, state}, payload){
        try{
            const imgId = state.preventionPosts[payload.index].id;
            const res = await this.$axios.patch(`http://localhost:3085/prevention/upViews/${imgId}`,{
                withCredentials: true
            });
            commit('upViews',{
                index: payload.index,
                views: res.data
            });
        } catch(err){
            console.error(err);
        }
    }
}