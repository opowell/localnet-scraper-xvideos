// A video's page on XVideos (xvideos.com, xvideos.es and its other domains), /video.<id>/<slug> or the older
// /video<number>/<slug>, as { id, url }, its address as the site redirects a listing's link to it
// (/video.<id>/<n>/<n>/<slug>); null for any other page.
function xvideosVideo(link) {
  const page = new URL(link, location.href)
  const match = /^\/video(?:\.([a-z0-9]+)|(\d+))\/(?:.+\/)?([^/]+)$/.exec(page.pathname)
  if (!/(?:^|\.)xvideos\d*\.[a-z.]+$/.test(page.hostname) || !match) {
    return null
  }
  const id = match[1] || match[2]
  return { id, url: `${page.origin}/video${match[1] ? '.' : ''}${id}/${match[3]}` }
}

// Text as the page writes it into its JSON-LD, HTML entities and all ("Part 2&period;I Hope…"), as text.
function xvideosText(html) {
  const text = document.createElement('textarea')
  text.innerHTML = html || ''
  return text.value.trim()
}

// The videos the page offers beside a video, which it draws from the list a script of its own sets (video_related).
function xvideosRelated() {
  for (const script of document.querySelectorAll('script:not([src])')) {
    const list = /\bvideo_related\s*=\s*(\[.*?\]);/s.exec(script.textContent)?.[1]
    if (list) {
      try {
        return JSON.parse(list).map(video => video.u && new URL(video.u, location.origin).href).filter(Boolean)
      } catch {}
    }
  }
  return linkUrls('#related-videos a[href]')
}

// A video page (/video.oluviiu2124/part_2…) is one video (see videoPage), played in XVideos' player: its uploader the
// first of the labels under it (li.main-uploader), its performers the labels marked as pornstars, its tags the
// keywords, its description its JSON-LD's where it says more than the title, and the videos related to it those the
// page lists beside it. Any other page (the home page, a tag, a search, a profile) is a listing of the videos it shows.
function parseXVideos(_profileId) {
  if (!/(?:^|\.)xvideos\d*\.[a-z.]+$/.test(location.hostname)) {
    return null
  }
  const id = xvideosVideo(location.href)?.id
  if (!id) {
    return videoListing(url => xvideosVideo(url)?.url ?? null)
  }
  const meta = jsonLdVideo()
  const name = a => a.querySelector('.name')?.textContent.trim() || linkName(a)
  const uploader = document.querySelector('.video-metadata li.main-uploader a[href]')
  return videoPage({
    player: `${location.origin}/embedframe/${id}`,
    title: xvideosText(meta.name) || document.querySelector('.page-title')?.firstChild?.textContent.trim(),
    description: xvideosText(meta.description),
    authors: uploader ? [{ name: name(uploader), url: uploader.href }] : [],
    performers: Array.from(document.querySelectorAll('.video-metadata a.is-pornstar[href]'), a => ({ text: name(a), url: a.href })),
    tags: namedLinks('.video-metadata a.is-keyword[href]'),
    related: xvideosRelated().map(url => xvideosVideo(url)?.url).filter(Boolean),
  })
}

// The parser a scrape calls.
registerParser(parseXVideos)
