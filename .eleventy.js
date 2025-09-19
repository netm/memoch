const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // CSS／画像／JSをそのまま出力ディレクトリにコピー
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");

  // Markdown→HTML変換設定
  const mdOptions = {
    html: true,
    breaks: false
  };
  eleventyConfig.setLibrary("md", markdownIt(mdOptions));

  // 出力後に空<p>を一掃
  eleventyConfig.addTransform("removeEmptyP", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      return content.replace(/<p>\s*<\/p>/g, "");
    }
    return content;
  });

  // 入出力ディレクトリ設定
  return {
    dir: {
      input: ".",     // ソースのルート
      output: "_site" // 出力先フォルダ
    }
  };
};