# XVideos scraper for Localnet

Reads `xvideos` pages for Localnet, a browser extension that is a personal search engine.
Localnet pulls it from here the first time it scrapes such a page, through the
[localnet-scrapers](https://github.com/opowell/localnet-scrapers) scraper source.

A video page (/video.oluviiu2124/part_2…) is one video (see videoPage in Localnet's DOM helpers), played in XVideos' player: its uploader the first of the labels under it (li.main-uploader), its performers the labels marked as pornstars, its tags the keywords, its description its JSON-LD's where it says more than the title, and the videos related to it those the page lists beside it. Any other page (the home page, a tag, a search, a profile) is a listing of the videos it shows.

- `source.json`: what Localnet reads to know the scraper: its name, the URLs it reads, how the site is searched, and the file to run.
- `xvideos.js`: the parser. It is injected into the scraped page after Localnet's DOM helpers (content-scripts/utils/dom.js) and defines `window.__dynamicParser`.
- `xvideos.test.ts`: its unit tests, run from a Localnet checkout (`pnpm parsers pull`, then `pnpm test parsers/localnet-scraper-xvideos`).
- `saved-pages/` (not in git): real pages saved from the site, which Localnet's `e2e/saved-pages.test.ts` scrapes. See Localnet's README.
- Its videos are played in Read in the site's own player (its embed page), as `source.json`'s `videos` says: the site's own files are signed for the viewer's address or for a few hours.
