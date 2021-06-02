export const state = () => ({
    loginUser: null,
    serverRes: null,
})

export const mutations ={
    setServerRes(state,payload){
        state.serverRes = payload;
    },
    setLoginUser(state, payload){
        state.loginUser = payload;
    }
}
export const actions = {
    async loadUser({commit,dispatch}, payload){
        try{
            const res = await this.$axios.get('http://localhost:3085/auth',{
                withCredentials: true
            });
            await commit('setLoginUser',res.data);
            //로그인 후 traceImages 둘다 불러옴
            await dispatch('trace/loadBeforeTraceImages',null,{root: true});
            await dispatch('trace/loadAfterTraceImages',null,{root: true});
        } catch(err){
            console.error(err);
        }
    },
    async signUp({commit}, payload){
        try{
            const res = await this.$axios.post('http://localhost:3085/auth/signUp',{
                email: payload.email,
                nickname: payload.nickname,
                password: payload.password,
            },{
                withCredentials: true,
            })
            commit('setServerRes',res.data);
        } catch(err){
            commit('setServerRes',err.response.data);
            console.error(err);
        }  
    },
    async login({commit,dispatch}, payload){
        try{
            const res = await this.$axios.post('http://localhost:3085/auth/login',{
                email: payload.email,
                password: payload.password,
            },{
                withCredentials: true,
            })
            await commit('setLoginUser',res.data);
            //로그인 후 traceImages 둘다 불러옴
            await dispatch('trace/loadBeforeTraceImages',null,{root: true});
            await dispatch('trace/loadAfterTraceImages',null,{root: true});
        } catch(err){
            commit('setServerRes',err.response.data);
            console.error(err);
        }
    },
    async logout({commit}, payload){
        try{
            this.$axios.post('http://localhost:3085/auth/logout',{},{
                withCredentials: true,
            })
            commit('setLoginUser',null);
        }catch(err){
            console.error(err);
        }
    }
    
}