module.exports = {
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                @import "@/styles/main.scss";
                `
            }
        }
    },
    chainWebpack: config=>{
        config
            .plugin('html')
            .tap(args=>{
                args[0].title= "<%= title || 'TRPG Toaster'%>"
                return args
            })
    },
    indexPath: "index.ejs",
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3002',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: {
                    "*": ""
                },
                onProxyReq: (proxyReq, req) => {
                    // Forward cookies from the original request
                    if (req.headers.cookie) {
                        proxyReq.setHeader('Cookie', req.headers.cookie);
                    }
                }
            }
        }
    }
};
