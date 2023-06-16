// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path'
// import vueJsx from '@vitejs/plugin-vue-jsx';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue(),vueJsx()],
//   resolve:{
//     alias:{
//       '@':resolve('src')
//     }
//   }
// })


import {fileURLToPath, URL} from 'node:url'
// import createVitePlugins from './vite/plugins'
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import htmlPlugin from 'vite-plugin-index-html';
import selectorNamespace from 'postcss-selector-namespace';
import autoprefixer from 'autoprefixer';
import flexbugfixes from 'postcss-flexbugs-fixes'
// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {
        const {VITE_APP_ENV, VITE_APP_MODULE_NAME} = loadEnv(mode, process.cwd())
        console.log("ssss:", VITE_APP_MODULE_NAME, mode)
        return {
            // base: 'http://localhost:3002/vue3/',
            // base: VITE_APP_ENV == 'development' ? `http://localhost:3002/${VITE_APP_MODULE_NAME}/` : '/' + VITE_APP_MODULE_NAME + '/',
            plugins: [
                // {
                //     template: {
                //         transformAssetUrls: {
                //             base: '/src'
                //         }
                //     }
                // }
                vue(),
                vueJsx(),
            ],
            resolve: {
                alias: {
                    // '@': fileURLToPath(new URL('./src', import.meta.url))
                    // '@': path.resolve(__dirname, './src')
                          '@':path.resolve('src')
                },
                // https://cn.vitejs.dev/config/#resolve-extensions
                extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.svg']
            },
            build: {
                manifest: true,
                target: 'modules',
                outDir: 'vue3', //指定输出路径
                assetsDir: 'assets', // 指定生成静态资源的存放路径
                minify: 'terser', // 混淆器，terser构建后文件体积更小
                lib: {
                    name: 'lib',
                    entry: path.resolve(__dirname, 'src/main.js'),
                    formats: ['es'],
                },
                rollupOptions: {
                    input: 'src/main.js',
                    format: 'system',
                    preserveEntrySignatures: true
                },
            },
            // 强制预构建插件包
            optimizeDeps: {
                // include: ['axios'],
            },
            rollupOptions: {
                input: 'src/main.js',
                format: 'system',
                preserveEntrySignatures: true
            },
            server: {
                port: 3002,
                host: true,
                open: true,
                proxy: {
                    // https://cn.vitejs.dev/config/#server-proxy
                    '/api': {
                        target: 'http://localhost:3000',
                        changeOrigin: true,
                        rewrite: (p) => p.replace(/^\/api/, '')
                    }
                },
                hmr:{
                    // overlay :false
                }
            },
            //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
            css: {
                postcss: {
                    plugins: [
                        selectorNamespace({
                            namespace(css) {
                                /* 无需添加的样式 */
                                if (css.includes("element-variables.scss")) return "";
                                return "#app";
                            }
                        }),
                        autoprefixer({
                            overrideBrowserslist: [
                                'Android 4.1',
                                'iOS 7.1',
                                'Chrome > 31',
                                'ff > 31',
                                'ie >= 8',
                                '> 1%',
                            ],
                            grid: true,
                        }),
                        flexbugfixes,
                        {
                            postcssPlugin: 'internal:charset-removal',
                            AtRule: {
                                charset: (atRule) => {
                                    if (atRule.name === 'charset') {
                                        atRule.remove();
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
)
