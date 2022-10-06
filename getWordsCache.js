const data = await (await fetch("./words.json")).json();
console.log(data)
export const getWordsCache = (area, fc) => {
  return data[area][fc];
};
