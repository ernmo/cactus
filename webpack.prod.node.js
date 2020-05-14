const packageDir = process.cwd();
const pkg = require(`${packageDir}/package.json`);
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const packageNameNoScope = pkg.name.substring(pkg.name.lastIndexOf('/') + 1);
const libraryName = `${packageNameNoScope}`;

module.exports = {
  entry: {
    [pkg.mainMinified]: `${packageDir}/src/main/typescript/index.ts`,
  },
  target: 'node',
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: "tsconfig.json"
            },
          }
        ]
      },
      {
        test: /\.(js|ts)$/,
        enforce: "pre",
        use: [
          {
            loader: "source-map-loader"
          }
        ]
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: `${pkg.mainMinified}.html`
    })
  ],
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  output: {
    filename: '[name]',
    path: packageDir,
    libraryTarget: 'umd',
    library: libraryName,
    umdNamedDefine: true,
    globalObject: 'this',
  },
  externals: {
  },
};