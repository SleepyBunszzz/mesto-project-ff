const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',  // основная точка входа вашего JS
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction
        ? 'js/bundle.[contenthash:8].js'
        : 'js/bundle.js',
      assetModuleFilename: 'assets/[hash][ext][query]', 
      clean: true, // гарантированно очищаем папку dist перед сборкой
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
    resolve: {
      extensions: ['.js', '.json'], // если будете подключать без расширений
    },
    module: {
      rules: [
        // 1) Обработка JS через Babel
        {
          test: /\.m?js$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // кеширование для ускорения сборки
            },
          },
        },

        // 2) Обработка CSS
        {
          test: /\.css$/i,
          use: [
            // В продакшн — отдельно файл, в режиме разработки — style-loader можно (но здесь сразу MiniCss)
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../', // чтобы в CSS-ссылках (например, url(...)) пути правильно вели при вложенности
              },
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1, // сначала postcss-loader, затем css-loader
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProduction,
                postcssOptions: {
                  config: path.resolve(__dirname, 'postcss.config.js'),
                },
              },
            },
          ],
        },

        // 3) Обработка изображений (png, jpg, svg и т.д.)
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset', // по умолчанию: если файл < 8КБ — превратится в base64, иначе — файл в dist/assets
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8 КБ
            },
          },
        },

        // 4) Обработка шрифтов
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource', // всегда копировать как файл
          generator: {
            filename: 'fonts/[hash][ext][query]',
          },
        },

        // 5) Обработка HTML, чтобы подтянуть локальные <img src="./assets/...">
        {
          test: /\.html$/i,
          loader: 'html-loader',
          options: {
            sources: {
              list: [
                // по умолчанию html-loader уже обрабатывает <img src="...">
                // можно добавить поддержку <link rel="icon">, <video src> и т.д.
                '...'
              ],
            },
            minimizer: false, // минификация HTML будет ниже в optimization
          },
        },
      ],
    },

    plugins: [
      // 1) HtmlWebpackPlugin — генерировать index.html в dist
      new HtmlWebpackPlugin({
        template: './src/index.html', // файл-исходник
        filename: 'index.html',
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyCSS: true,
              minifyJS: true,
              minifyURLs: true,
            }
          : false,
      }),

      // 2) MiniCssExtractPlugin — вынос CSS в отдельный файл
      new MiniCssExtractPlugin({
        filename: isProduction
          ? 'css/[name].[contenthash:8].css'
          : 'css/[name].css',
      }),
    ],

    optimization: {
      minimize: isProduction,
      minimizer: [
        `...`, // сохранить встроенный TerserPlugin для JS
        new CssMinimizerPlugin(), // минификация CSS
      ],
      splitChunks: {
        chunks: 'all', // если хотите вынести сторонние библиотеки в отдельный чанк
      },
    },

    // Настройки devServer для режима разработки
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      compress: true,
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true, // если SPA с history API
    },
  };
};
