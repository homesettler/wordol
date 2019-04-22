
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  base: '/wordol',
  publicPath: "https://homesettler.github.io/wordol/",
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'wordOl',
      dll: false,
      routes: {
        exclude: [
        
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
        
          /components\//,
        ],
      },
    }],
  ],
  routes: [{
    path: '/editor/:userId/:fileId',
    component: './$editor',
  },{
    path: '/login',
    component:'./login',
  },{
    path: '/workSpace',
    component:'./workSpace',
  }]
}
