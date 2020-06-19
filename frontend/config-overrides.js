const { override, fixBabelImports, addLessLoader } = require('customize-cra')
module.exports = override(
  fixBabelImports('@digihcs/innos-ui3', {
    libraryName: '@digihcs/innos-ui3',
    libraryDirectory: 'es',
    style: true
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  fixBabelImports('@digihcs/grid', {
    libraryName: '@digihcs/grid',
    libraryDirectory: 'esm',
    camel2DashComponentName: false,
    customName: name => {
      return `@digihcs/grid/esm/${name}`
    },
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true
  })
)
