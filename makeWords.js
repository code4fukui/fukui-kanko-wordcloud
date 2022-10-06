import { CSV } from "https://js.sabae.cc/CSV.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";
import { getWords } from "./getWords.js";

const url = "https://code4fukui.github.io/fukui-kanko-survey/monthly/202208.csv";
//const url = "https://code4fukui.github.io/fukui-kanko-survey/all.csv";
const data = await CSV.fetchJSON(url);
console.log(data);

// area
const areas = ["すべてのエリア", ...ArrayUtil.toUnique(data.map(d => d.回答エリア2)).sort()];

const freecomment = ["福井県に求めるもの", "施設に求めるもの", "満足度の理由", "福井県内での交通手段の満足度の理由", "不便さの内容"];

const getWordsData = (data) => {
  const res = {};
  for (let i = 0; i < freecomment.length; i++) {
    const fc = freecomment[i];
    const list = data.map(d => d[fc]).filter(s => s);
    const words = getWords(list);
    res[fc] = words;
  }
  return res;
};

const make = () => {
  const list = {};
  for (const area of areas) {
    const data2 = data.filter(d => {
      const filterarea = area != "すべてのエリア";
      return !filterarea || d.回答エリア2 == area;
    });
    const d = getWordsData(data2);
    list[area] = d;
  }
  return list;
};
const res = make();
await Deno.writeTextFile("words.json", JSON.stringify(res, null, 2));
