import {
    getGoButton,
    getQueryText,
    getAPIEndpoint,
    setResultValue,
    parseEntities,
    setLoading,
    highlightEntities,
    getClearButton,
    setQueryValue,
    getRandomQuery,
    getRandomQueryButton,
    clearProducts,
    getEbayMarketPlace,
    renderProducts,
    createPriceHandler
} from "./util.js"


async function handleGoClick() {
    try {
        setLoading(true, 'Preparing a chat response...')
        // get text input
        const q = getQueryText();
        if (!q) {
            throw new Error('Missing query')
        }

        setResultValue('')
        clearProducts()

        const baseUrl = getAPIEndpoint()
        const tcEndpoint = baseUrl + "textcompletion?q=" + q;
        const tcRes = await fetch(tcEndpoint, {
            method: "GET",
        })
        const tcValue = await tcRes.json()
        const tc = tcValue.choices[0]
            .text
            .trimLeft()
            .replaceAll('\n', '<br/>')

        // render response
        setResultValue(tc)


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
        console.table(entities)
        

        // highlight response
        const ht = highlightEntities(tc, entities, [])
        setResultValue(ht)


        setLoading(true, 'Finding product prices...')
        // get ebay prod info inc prices for products
        const products = entities.filter(entity => entity.rootType === "Product" || entity.type === "Product")
        const mp = getEbayMarketPlace()

        const productsInfo = []
        for (let i = 0; i < products.length; i++) {
            const product = products[i]
            const productRes = await fetch(baseUrl + `ebay_search?q=${product.name}(${product.type})&marketplace=${mp}&limit=10`)
            const productInfo = await productRes.json()

            const wrapped = { product, info: productInfo }
            productsInfo.push(wrapped)

            const ht = highlightEntities(tc, entities, productsInfo)
            setResultValue(ht)
            renderProducts([wrapped])
        }
        productsInfo.forEach(p => {
            createPriceHandler(p.product.name)
        })
    } catch (e) {
        console.error(e)
    } finally {
        setLoading(false)
    }
}

function handleClearButtonClick() {
    setQueryValue('')
    setResultValue('')
    clearProducts()
}

function handleRandomQueryButtonClick() {
    setQueryValue(getRandomQuery())
}

function main() {
    
    console.log('running app.js')

    setQueryValue(getRandomQuery())

    const goButton = getGoButton()
    goButton.addEventListener('click', handleGoClick)

    const clearButton = getClearButton()
    clearButton.addEventListener('click', handleClearButtonClick)

    const randomButton = getRandomQueryButton()
    randomButton.addEventListener('click', handleRandomQueryButtonClick)
}
main()
