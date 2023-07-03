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

```