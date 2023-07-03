# AsianWiki API (Unofficial)

[AsianWiki](https://asianwiki.com) is a website devoted to Asian films, television dramas, and the performers behind these productions.

This API is built using a web scraping technique and returns in JSON format.

This API is only for practice purposes, not recommended for production.

# Table of contents

- [Technology Stack](#technology-stact)
- [API Documentation](#api-documentation)

## Technology Stack

- [Express](https://expressjs.com/)
- [Cheerio](https://www.npmjs.com/package/cheerio)
- [Got Scraping](https://www.npmjs.com/package/got-scraping)
- [NodeJS](https://nodejs.org/en)

## API Documentation

### Homepage

- URL: [`https://asianwiki-api.vercel.app/api/`](https://asianwiki-api.vercel.app/api/)
- Query parameters: `featured`, `movie`, `drama`.
- **featured** : will only list dramas and movies from the carousel on the Asianwiki homepage
- **drama** : will only list upcoming drama
- **movie** : will only list upcoming movie
- If no query is defined it will show all of them 
    - Example: `https://asianwiki-api.vercel.app/api`**?data=`featured`**
    - Response:
```json
{
    "type": "featured",
    "totalItems": 11,
    "items": [
        {
            "title": "Lies Hidden In My Garden",
            "link": "https://asianwiki.com/Lies_Hidden_In_My_Garden",
            "api_link": "asianwiki-api.vercel.app/api/detail/Lies_Hidden_In_My_Garden",
            "poster": "https://asianwiki.com/images/mainimagegallery2/mgimages/Lies Hidden In My Garden-F1.jpg"
        },
        ...
    ]
}

```

### Detail Page

- URL: [`https://asianwiki-api.vercel.app/api/detail/`**[AsianWiki_Detail_Path]**](https://asianwiki-api.vercel.app/api/detail/King_the_Land)
- Response:

```json
{
    "title": "King the Land",
    "hangul": "킹더랜드",
    "director": "Im Hyun-Wook",
    "writer": "Choi Rom",
    "network": "JTBC",
    "episodes": "16",
    "release_date": "June 17 - August 6, 2023",
    "runtime": "Saturday & Sunday 22:30",
    "language": "Korean",
    "country": "South Korea",
    "poster": "https://asianwiki.com//images/7/7f/King_the_Land-p1.jpg",
    "link": "https://asianwiki.com/King_the_Land",
    "rating": "Current user rating: 88/100 (1187 votes)",
    "synopsis": [
        "Gu Won (<a href=\"/Lee_Joon-Ho_(Junho)\" title=\"Lee Joon-Ho (Junho)\">Lee Joon-Ho</a>) is a son from a chaebol family. His family owns and runs the King Group. He is then thrown into an inheritance war over the King Group. Gu Won is a smart, elegant, and chic young man, but he is not very good with dating. He is unable to resist a fake smile.",
        "Cheon Sa-Rang (<a href=\"/Lim_Yoon-A\" title=\"Lim Yoon-A\">Lim Yoon-A</a>) has a bright personality, with a smiling face. She begins to work at the King Hotel, that was the backdrop for some of her happiest memories from her childhood. While working at the hotel, she faces various difficulties. She also grows as a person. Gu Won and Cheon Sa-Rang meet and a romantic relationship develops."
    ],
    "notes": [
        "\"King the Land\" takes over the JTBC's Saturday & Sunday 22:30 time slot previously occupied by \"Doctor Cha\" and followed by \"Behind Your Touch\" on August 12, 2023."
    ],
    "casts": [
        {
            "photo": "https://asianwiki.com/images/8/82/King_the_Land-Lee_Joon-Ho.jpg",
            "name": "Lee Joon-Ho",
            "link": "https://asianwiki.com/Lee_Joon-Ho_(Junho)",
            "as": "Gu Won"
        },
        {
            "photo": "https://asianwiki.com/images/8/81/King_the_Land-Lim_Yoon-A.jpg",
            "name": "Lim Yoon-A",
            "link": "https://asianwiki.com/Lim_Yoon-A",
            "as": "Cheon Sa-Rang"
        },
        ...
    ]
}
```