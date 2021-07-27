// 配置src 中文件别名
// 默认src 别名->@
module.exports = {
    configureWebpack: {
        resolve: {
            alias:{
                'assets':'@/assets',
                'common':'@/common',
                'components':'@/components',
                'network':'@/network',
                'views':'@/views'
            }
        }
    }
}
