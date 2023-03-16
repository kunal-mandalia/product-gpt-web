/**
 * Written by Kunal Mandalia Limited 2023
 */

import {
    getGoButton,
    getQueryText,
    getAPIEndpoint,
    parseEntities,
    setLoading,
    highlightEntities,
    getClearButton,
    setQueryValue,
    getRandomQuery,
    getRandomQueryButton,
    getEbayMarketPlace,
    createPriceHandler,
    updateApp
} from "./util.js"


async function handleGoClick() {
    try {
        const q = getQueryText();
        if (!q) {
            return null
        }

        updateApp("query", "Asking OpenAI...")

        const baseUrl = getAPIEndpoint()
        const r = Math.random()
        
        const tcEndpoint = r > 0.5 ? baseUrl + "textcompletion?q=" + q : "notfound"
        const tcRes = await fetch(tcEndpoint, {
            method: "GET",
        })
        const tcValue = await tcRes.json()
        const tc = tcValue.choices[0]
            .text
            .trimLeft()
            .replaceAll('\n', '<br/>')

        updateApp("chat", tc)


        // api call for /entities
        setLoading(true, 'Identifying related products and services...')
        const entityEndpoint = baseUrl + "entities";
        const entityRes = await fetch(entityEndpoint, {
            method: "POST",
            body: JSON.stringify({
                query_request: tc,
            })
        })
        const entityValue = await entityRes.json()
        const entities = parseEntities(entityValue.choices[0].text)

        // highlight response
        const ht = highlightEntities(tc, entities, [])
        updateApp("chat", ht)


        // get ebay prod info inc prices for products
        updateApp("loading", "Finding product prices...")
        const products = entities.filter(entity => entity.rootType === "Product" || entity.type === "Product")
        const mp = getEbayMarketPlace()

        updateApp("stop_loading")
        const productsInfo = []
        for (let i = 0; i < products.length; i++) {
            const product = products[i]
            const productRes = await fetch(baseUrl + `ebay_search?q=${product.name}(${product.type})&marketplace=${mp}&limit=10`)
            const productInfo = await productRes.json()

            const wrapped = { product, info: productInfo }
            productsInfo.push(wrapped)

            const ht = highlightEntities(tc, entities, productsInfo)
            updateApp("chat", ht)
            updateApp("products", [wrapped])
        }
        productsInfo.forEach(p => {
            createPriceHandler(p.product.name)
        })
        updateApp("finished")
        return null
    } catch (e) {
        console.error(e)
        updateApp("error", e)
        return e
    }
}

function handleClearButtonClick() {
    updateApp("clear")
}

function handleRandomQueryButtonClick() {
    setQueryValue(getRandomQuery())
}

function withRetry(func) {
    return async () => {
        const error = await func()
        if (error) {
            await func()
        }
    }
}

function main() {
    console.log('running app.js')

    const goButton = getGoButton()
    goButton.addEventListener('click', withRetry(handleGoClick))

    const clearButton = getClearButton()
    clearButton.addEventListener('click', handleClearButtonClick)

    const randomButton = getRandomQueryButton()
    randomButton.addEventListener('click', handleRandomQueryButtonClick)
}
main()
