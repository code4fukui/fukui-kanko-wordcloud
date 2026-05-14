# fukui-kanko-wordcloud

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A client-side web application that visualizes open data from Fukui Prefecture's tourism surveys. It generates interactive word clouds from free-text responses, allowing users to explore feedback by geographic area.

## Demo

**https://github.com/code4fukui/fukui-kanko-wordcloud

The live demo processes the survey data and generates word clouds directly in your browser.

## Features

-   **Geographic Filtering**: Select a specific area within Fukui to see localized survey feedback.
-   **Client-Side NLP**: Performs Japanese morphological analysis in the browser using [kuromoji.js](https://github.com/takuyaa/kuromoji.js/) to extract keywords from raw text.
-   **Dynamic Visualization**: Uses [d3-cloud](https://github.com/jasondavies/d3-cloud) to render word clouds where word size is determined by its frequency rank.
-   **Categorized Insights**: Displays separate word clouds for five different free-response survey questions:
    -   福井県に求めるもの (What is expected of Fukui Prefecture?)
    -   施設に求めるもの (What is expected of facilities?)
    -   満足度の理由 (Reasons for satisfaction)
    -   福井県内での交通手段の満足度の理由 (Reasons for satisfaction with transportation)
    -   不便さの内容 (Details about inconveniences)

## How It Works

1.  The application fetches the aggregate survey data (`all.csv`) from the data repository.
2.  When a user selects an area, the corresponding survey responses are filtered.
3.  For each category, `kuromoji.js` tokenizes the Japanese text and extracts the most common nouns.
4.  `d3-cloud` then calculates the word positions and renders the final SVG word cloud visualization.

## Local Development

To run the application locally, simply serve the repository's contents with a static file server.

This project also includes a Deno script to pre-process the survey data into a `words.json` file. This can be used for alternative implementations that require pre-generated data.

```bash
# Requires Deno to be installed
deno run --allow-net --allow-write makeWords.js
```

## Data Source

This project uses open data from the "Fukui Tourism Survey" project, which is fetched live from the following repository:
https://github.com/code4fukui/fukui-kanko-survey

## License

MIT License — see [LICENSE](LICENSE).