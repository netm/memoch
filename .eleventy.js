module.exports = function(eleventyConfig) {
  // CSS／画像／JSをそのまま出力ディレクトリにコピー
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");

  return {
    dir: {
      input: ".",    // ソースのルート
      output: "_site" // 出力先フォルダ
    }
  };
};