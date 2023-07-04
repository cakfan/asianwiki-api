const { gotScraping } = require('got-scraping')
const cheerio = require('cheerio')

const BASE_URL = process.env.BASE_URL

const handlePromisesData = (req, $, listElement) => {
    const promisesList = listElement.map((_index, element) => {
        const $element = $(element)
        const divList = $element.find('div')
        const m1 = $(divList[0]).find('ul')
        const m2 = $(divList[1]).find('ul')
        if (m1.find('a').length > 0 || m2.find('a').length > 0) {
            return Promise.all(
                m1.find('a').map(async (_idx, mElement) => {
                    const $ej = $(mElement)
                    const title = $ej.text().trim()
                    const urlPost = $ej.attr('href')
                    const res = await gotScraping(urlPost)
                    const $$ = cheerio.load(res.body)
                    const poster = BASE_URL + $$('.thumbimage').attr('src')
                    return {
                        title,
                        link: urlPost,
                        api_link: req.get('host') + '/api/detail/' + urlPost.replace(BASE_URL, ''),
                        poster
                    }
                })
            ).then((res1) => {
                if (m2.find('a').length > 0) {
                    return Promise.all(m2.find('a').map(async (_idx, mElement) => {
                        const $ej = $(mElement)
                        const title = $ej.text().trim()
                        const urlPost = $ej.attr('href')
                        const res = await gotScraping(urlPost)
                        const $$ = cheerio.load(res.body)
                        const poster = BASE_URL + $$('.thumbimage').attr('src')
                        return {
                            title,
                            link: urlPost,
                            api_link: req.get('host') + '/api/detail/' + urlPost.replace(BASE_URL, ''),
                            poster
                        }
                    })).then((res2) => {
                        return [...res1, ...res2]
                    })
                } else {
                    return [...res1]
                }
            })
        }
    })

    const list = Promise.all(
        promisesList
    ).then((resAll) => {
        const movies = resAll.flat()
        return movies
    }).catch(error => console.error(error))
    return list
}

const getMainPage = async (req, res) => {
    const path = 'Main_Page'
    const url = BASE_URL + path
    const data = req.query.data

    try {
        const userAgent = 'Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0'
        const response = await gotScraping({
            url: url,
            headers: {
                'user-agent': userAgent
            }
        })
        await delay(10000)
        const $ = cheerio.load(response.body)
        const pageTitle = $('title').first().text()
        console.log(pageTitle)
        const featuredElement = $('#amazingslider-1 ul li')
        const moviesElement = $('#slidorion #slider .slide')
        const dramasElement = $('#slidorion2 #slider .slide2')

        const featuredList = []
        if (featuredElement.length > 0) {
            featuredElement.each((_index, element) => {
                const $element = $(element)
                const url = $element.find('a').attr('href')
                const imgEl = $element.find('a img')
                const imgUrl = imgEl.attr('src')
                const title = imgEl.attr('alt')
                featuredList.push({
                    title,
                    link: url,
                    api_link: req.get('host') + '/api/detail/' + url.replace(BASE_URL, ''),
                    poster: imgUrl
                })
            })
        }

        if (data === "featured") {
            res.json({
                type: data,
                totalItems: featuredList.length,
                items: featuredList
            })
        } else if (data === "drama") {
            try {
                const dramas = await handlePromisesData(req, $, dramasElement)
                res.json({
                    type: data,
                    totalItems: dramas.length,
                    items: dramas
                })
            } catch (error) {
                console.error(error)
                res.status(400).json({
                    status: "error",
                    message: "Something went wrong"
                })
            }
        } else if (data === "movie") {
            try {
                const movies = await handlePromisesData(req, $, moviesElement)
                res.json({
                    type: data,
                    totalItems: movies.length,
                    items: movies
                })
            } catch (error) {
                console.error(error)
                res.status(400).json({
                    status: "error",
                    message: "Something went wrong"
                })
            }
        } else {
            try {
                const movies = await handlePromisesData(req, $, moviesElement)
                const dramas = await handlePromisesData(req, $, dramasElement)
                res.json({
                    featured: {
                        type: data,
                        totalItems: featuredList.length,
                        items: featuredList
                    },
                    dramas: {
                        type: data,
                        totalItems: dramas.length,
                        items: dramas
                    },
                    movies: {
                        type: data,
                        totalItems: movies.length,
                        items: movies
                    }
                })
            } catch (error) {
                console.error(error)
                res.status(400).json({
                    status: "error",
                    message: "Something went wrong"
                })
            }
        }
    } catch (error) {
        console.error(error)
    }

}

const getDetailPage = async (req, res) => {
    const path = req.params.path
    const url = BASE_URL + path

    const response = await gotScraping.get(url)
    const $ = cheerio.load(response.body)

    const title = $('h1').text()
    const ratingRaw = $('#w4g_rb_area-1').text()
    const poster = BASE_URL + $('.thumbimage').attr('src')
    const ulElement = $('#mw-content-text ul')
    const detailInfoList = []
    ulElement.map((_idx, ulEl) => {
        const detailInfos = $(ulEl).find('li')
        detailInfos.map((_index, element) => {
            const df = ["Hangul", "Romaji", "Japanese", "Director", "Writer", "Network", "Episodes", "Release Date", "Runtime", "Genre", "Language", "Country"]
            const detailInfo2Raw = $(element)
            const isDetailInfo = df.some(item => detailInfo2Raw.text().includes(item))
            if (isDetailInfo) {
                let altTitleKeyRaw = detailInfo2Raw.find('b').text().replace(':', '').trim().toLowerCase()
                if (altTitleKeyRaw.includes(' ')) {
                    altTitleKeyRaw = altTitleKeyRaw.replace(' ', '_').trim()
                }
                const altTitleRaw = detailInfo2Raw.text().slice(detailInfo2Raw.text().indexOf(':') + 1).trim()
                const altTitle = JSON.parse(`{"${altTitleKeyRaw}": "${altTitleRaw}"}`)
                detailInfoList.push(altTitle)
            }
        })
    })
    const notesRaw = $('ol li')
    const notes = []
    if (notesRaw.length > 0) {
        notesRaw.map((_idx, element) => {
            const $element = $(element).text().trim()
            notes.push($element)
        })
    }
    const synopsisRaw = $.html().match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)
    let synopsis

    const dataCasts = []
    if (synopsisRaw && synopsisRaw.length >= 2) {
        const getSynopsis = $.html().substring($.html().indexOf(synopsisRaw[3]) + synopsisRaw[3].length, $.html().indexOf(synopsisRaw[4]))
        const paragraphs = getSynopsis.match(/<p\b[^>]*>([\s\S]*?)<\/p>/g)
        synopsis = paragraphs ? paragraphs.map((p) => p.replace(/<\/?p[^>]*>/g, '').trim()) : ['Synopsis not found']
        const getCastsRaw = $.html().substring($.html().indexOf(synopsisRaw[paragraphs ? 5 : 4]) + synopsisRaw[paragraphs ? 5 : 4].length, $.html().indexOf(synopsisRaw[paragraphs ? 6 : 5]))
        const tableCasts = $(getCastsRaw.match(/<table\b[^>]*>([\s\S]*?)<\/table>/g))
        if (tableCasts.length > 0) {
            tableCasts.map((_idx, element) => {
                const $element = $(element).find('tbody tr')
                const tdEl = $element.find('td')
                const imgRes = []
                const nameRes = []
                const asNameRes = []
                if (tdEl.length > 0) {
                    tdEl.map((idx, tdElement) => {
                        const $tdEl = $(tdElement)
                        const imgSrc = $tdEl.find('img').attr('src')
                        const nameSrc = $tdEl.find('a').text().trim()
                        const linkSrc = $tdEl.find('a').attr('href')
                        const asNameSrc = $tdEl.text().trim()
                        if (asNameSrc !== undefined && asNameSrc !== '' && idx >= (((tdEl.length / 2) + tdEl.length) / 2)) {
                            asNameRes.push({
                                as: asNameSrc
                            })
                        }
                        if (imgSrc !== undefined) {
                            imgRes.push({
                                photo: BASE_URL.substring(0, BASE_URL.length - 1) + imgSrc
                            })
                        }
                        if (nameSrc !== undefined && nameSrc !== '') {
                            nameRes.push({
                                name: nameSrc,
                                link: BASE_URL.substring(0, BASE_URL.length - 1) + linkSrc
                            })
                        }
                    })
                }
                const entry = imgRes.map((item, i) => {
                    return {
                        ...item,
                        ...nameRes[i],
                        ...asNameRes[i]
                    }
                })
                dataCasts.push(entry)
            })
        }
    } else {
        console.log('No matching <h2> elements found.')
    }
    const info = Object.assign({}, ...detailInfoList)
    res.json({
        title,
        ...info,
        poster,
        link: url,
        rating: ratingRaw,
        synopsis,
        notes,
        casts: dataCasts ? dataCasts.flat() : undefined
    })
}

const getData = (req, res) => {
    const path = req.path
    if (path.includes('detail')) {
        getDetailPage(req, res)
    } else if (path.includes('/')) {
        getMainPage(req, res)
    } else {
        res.status(400).json({
            'status': 'error',
            'message': 'Bad request or missing',
            path: req.path
        })
    }

}

module.exports = {
    getData
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}