const webpack = require("webpack");

export default{
    head:{
        title:'PictureTrace',
        script:[
            { type: 'text/javascript',src: "jquery.min.js",  body: true},
            { type: 'text/javascript',src: "jquery.scrollex.min.js",  body: true},
            { type: 'text/javascript',src: "jquery.scrolly.min.js",  body: true},
            { type: 'text/javascript',src: "browser.min.js",  body: true},
            { type: 'text/javascript',src: "breakpoints.min.js",  body: true},
            { type: 'text/javascript',src: "util.js",  body: true},
            { type: 'text/javascript',src: "main.js",  body: true},
        ],
        noscript:[
          
        ]
    },
    modules:[
        '@nuxtjs/axios',
        
    ],
    buildModules:[
        '@nuxtjs/fontawesome',
        '@nuxtjs/vuetify'
    ],
    vuetify:{
        
    },
    css:[
        '~/assets/css/main.css',
        '~/assets/css/noscript.css',
        '~/assets/css/fontawesome-all.min.css'
    ],
    build: {
        vendor: ['jquery', 'bootstrap'],
        plugins: [
          // set shortcuts as global for bootstrap
          new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
          })
        ]
      },

    fontawesome: {
        icons: [

        ]
      }
}