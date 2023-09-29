module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "./dist/bundle.js",
  },

  // webpack의 출력을 디버깅하기 위해 소스맵을 활성화 합니다.
  devtool: "source-map",

  resolve: {
    // 해석 가능한 확장자로 '.ts' 와 '.tsx' 를 추가합니다.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },

  module: {
    loaders: [
      // '.ts' 나 '.tsx' 확장자로 끝나는 모든 파일은 'awesome-typescript-loader'에 의해 처리됩니다.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
    ],

    preLoaders: [
      // 모든 출력 '.js' 파일은 'source-map-loader'에 의해 재처리된 소스맵을 갖습니다.
      { test: /\.js$/, loader: "source-map-loader" },
    ],
  },

  // 다른 옵션들...
};
