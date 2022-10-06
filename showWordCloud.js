import * as d3 from "https://cdn.skypack.dev/d3@7";
import { cloud } from "https://code4fukui.github.io/d3-cloud-es/index.js";
import { kuromoji } from "https://code4fukui.github.io/kuromoji-es/kuromoji.js";
import { ignoreWords } from "./ignoreWords.js";

const drawWordCloud = async (querydom, data) => {
  const w = innerWidth - 40;
  const h = 800 / Math.max(w, 800) * 400;

  const randomColor = () => {
    return `hsl(${Math.random() * 360} 55% 50%)`;
  };
  const draw = (words) => {
    d3.select(querydom).append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", d => d.size + "px")
        //.style("font-family", "Impact")
        .style("fill", (d, i) => randomColor())
        .attr("text-anchor", "middle")
        .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
        .text(d => d.text);
  };

  //const max = data.reduce((p, c) => p < c.value ? c.value : p, 0);
  const max = data.length;
  const size = (value) => {
    /*
    if (value > max / 4 * 3) {
      return 80;
    } else if (value > max / 4 * 2) {
      return 60;
    } else if (value > max / 4 * 1) {
      return 50;
    } else {
      return 10;
    }
    */
    if (value < 5) {
      return 80;
    } else if (value < 10) {
      return 60;
    } else if (value < 30) {
      return 40;
    } else {
      return 10;
    }
  };
  const layout = cloud()
      .size([w, h])
      .words(data.map((d, i) => ({ text: d.text, size: size(/*d.value*/i) }))) // text, size
      .padding(1)
      //.rotate(function() { return ~~(Math.random() * 2) * 90; })
      //.font("Impact")
      .fontSize(d => d.size)
      .on("end", draw);
  layout.start();
};

const tokenizer = await kuromoji.createTokenizer();

export const showWordCloud = (domid, text) => {
  if (Array.isArray(text)) {
    text = text.join("。");
  }
  //const TARGET_POS = ['名詞', '動詞', '形容詞'];
  const TARGET_POS = ["名詞"];
  const NO_CONTENT = "*"; // kuromoji.jsの解析結果の値で特に値がない場合 "*" が設定される
  const tokens = tokenizer.tokenize(text); // テキストを引数にして形態素解析
  //console.log(tokens);
  // 解析結果から単語と出現回数を抽出
  const words = tokens
    // pos（品詞）を参照し、'名詞', '動詞', '形容詞'のみを抽出
    .filter(t => t.basic_form != NO_CONTENT && TARGET_POS.includes(t.pos) && !ignoreWords.includes(t.basic_form))
    // 単語を抽出(basic_formかsurface_formに単語が存在する)
    .map(t => t.basic_form)
    // [{text: 単語, value: 出現回数}]の形にReduce
    .reduce((data, text) => {
      const target = data.find(c => c.text === text)
      if (target) {
        target.value++;
      } else {
        data.push({ text, value: 1 });
      }
      return data
    }, [])
    .sort((a, b) => b.value - a.value);
  //console.log(words);

  document.getElementById(domid).innerHTML = "";
  drawWordCloud("#" + domid, words);
};
