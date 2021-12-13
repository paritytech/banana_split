let HtmlWebpackPlugin = require("html-webpack-plugin");
let HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
let Webpack = require("webpack");

// eslint-disable-next-line security/detect-child-process
let childProcess = require("child_process");
let GIT_REVISION = childProcess.execSync("git describe --long").toString();

module.exports = {
  productionSourceMap: false,
  css: {
    extract: false
  },
  configureWebpack: {
    plugins: [
      new HtmlWebpackPlugin({
        template: "public/index.html",
        inlineSource: ".(js|css)$"
      }),
      new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
      new Webpack.DefinePlugin({
        "process.env": {
          GIT_REVISION: JSON.stringify(GIT_REVISION)
        }
      })
    ]
  }
};
