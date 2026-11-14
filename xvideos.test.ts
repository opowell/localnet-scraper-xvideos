import { afterEach, describe, expect, it } from 'vitest'
import { parserLoader, resetPage, setSiteRules, useSourceRules, videoEmbed, visit } from '#scraper-test'

// The parser, evaluated with the helpers it is injected with, as a scrape runs it.
const load = parserLoader(__dirname)

afterEach(resetPage)

describe('xVideos', () => {
  it('reads an XVideos video\'s uploader, performers and tags from its labels, and the videos beside it from the page\'s list', () => {
    const { parseXVideos } = load('xvideos.js', ['parseXVideos'])
    const ld = { '@type': 'VideoObject', 'name': 'Part 2&period; A video&excl;', 'description': 'Part 2&period; A video&excl;', 'thumbnailUrl': ['https://thumb.example/a.jpg'], 'duration': 'PT00H20M45S' }
    visit('https://www.xvideos.com/video.oluviiu2124/part_2', `<script type="application/ld+json">${JSON.stringify(ld)}</script>
      <div class="video-metadata"><ul><li class="main-uploader"><a href="/ellie_wild"><span class="name">Elliewild</span><span class="count">27k</span></a></li>
      <li><a href="/models/ellie" class="is-pornstar"><span class="name">Ellie Wild</span><span class="count">42k</span></a></li>
      <li><a href="/tags/sexy" class="is-keyword">sexy</a></li></ul></div>
      <script>var video_related=[{"id":1,"u":"\/video.oluhike8a5f\/part_1"}];window.wpn_categories="";</script>`)
    const parsed = parseXVideos()
    expect(parsed.title).toBe('Part 2. A video!')
    expect(parsed.content).toEqual(['<post author="Elliewild" author-url="https://www.xvideos.com/ellie_wild">', '[![](https://thumb.example/a.jpg)](https://www.xvideos.com/embedframe/oluviiu2124)'])
    expect(parsed.links).toContainEqual({ url: 'https://www.xvideos.com/video.oluhike8a5f/part_1', score: 1 })
    expect(parsed.details).toContainEqual(['performers', [{ text: 'Ellie Wild', url: 'https://www.xvideos.com/models/ellie' }]])
    expect(parsed.details).toContainEqual(['tags', [{ text: 'sexy', url: 'https://www.xvideos.com/tags/sexy' }]])
  })

  it('reads https://www.xvideos.es/?k=red as a listing of what it links to', async () => {
    const { parseXVideos } = load('xvideos.js', ['parseXVideos'])
    visit('https://www.xvideos.es/?k=red', '<a href="/video.omfuhke592a/58907413/0/a_video">A</a><a href="/tags/red">red</a>')
    expect(await parseXVideos()).toEqual({ listing: true, links: [{ url: 'https://www.xvideos.es/video.omfuhke592a/a_video', score: 1 }] })
  })

  it('plays its videos in the site\'s own player, as its source says', () => {
    useSourceRules(__dirname)
    expect(videoEmbed('https://www.xvideos.es/embedframe/oluviiu2124')).toBe('https://www.xvideos.es/embedframe/oluviiu2124')
    setSiteRules([])
  })
})
