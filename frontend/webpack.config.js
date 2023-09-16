const webpack = require("webpack");
const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const GLOBALS = {
  "process.env.ENDPOINT": JSON.stringify(
    process.env.ENDPOINT || "http://0.0.0.0:9000/api"
  )
};

module.exports = {
  mode: "development",
  cache: true,
  devtool: "eval-source-map",
  entry: {
    main: ["@babel/polyfill", path.join(__dirname, "src/App.tsx")]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    modules: ["src", "node_modules"]
  },
  devServer: {
    static: "src/public",
    historyApiFallback: true,
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 8000
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[hash:8].js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /\.css$/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-react",
                [
                  "@babel/env",
                  {
                    targets: { browsers: ["last 2 versions"] },
                    modules: false
                  }
                ]
              ],
              plugins: ["@babel/plugin-proposal-class-properties"]
            }
          },
          { loader: "ts-loader" }
        ]
      },
      {
        test: /\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]"
              },
              importLoaders: 1
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/public/index.html",
      filename: "index.html"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/public",
          to: "."
        }
      ]
    }),
    new webpack.DefinePlugin(GLOBALS)
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all"
    }
  }
};
