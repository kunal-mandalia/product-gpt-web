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
    getItemSummary,
    getEbayMarketPlace
} from "./util.js"


async function handleGoClick() {
    try {
        setLoading(true, 'Preparing a chat response...')
        // get text input
        let q = getQueryText();
        if (!q) {
            throw new Error('Missing query')
        }

        setResultValue('')
        clearProducts()

        let baseUrl = getAPIEndpoint()
        // api call for /textcompletion
        let tcEndpoint = baseUrl + "textcompletion?q=" + q;
        let tcRes = await fetch(tcEndpoint, {
            method: "GET",
        })
        let tcValue = await tcRes.json()
        let tc = tcValue.choices[0]
            .text
            .trimLeft()
            .replaceAll('\n', '<br/>')

        // render response
        setResultValue(tc)


        // api call for /entities
        setLoading(true, 'Identifying related products and services...')
        let entityEndpoint = baseUrl + "entities";
        let entityRes = await fetch(entityEndpoint, {
            method: "POST",
            body: JSON.stringify({
                query_request: tc,
            })
        })
        let entityValue = await entityRes.json()
        let entities = parseEntities(entityValue.choices[0].text)
        console.table(entities)
        

        // highlight response
        let ht = highlightEntities(tc, entities, [])
        setResultValue(ht)


        setLoading(true, 'Finding product prices...')
        // get ebay prod info inc prices for products
        let products = entities.filter(entity => entity.rootType === "Product" || entity.type === "Product")
        // TODO let api accept array of products
        let mp = getEbayMarketPlace()

        let productsInfo = []
        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            let productRes = await fetch(baseUrl + `ebay_search?q=${product.name}(${product.type})&marketplace=${mp}&limit=10`)
            let productInfo = await productRes.json()

            productsInfo.push({ product, info: productInfo })

            let ht = highlightEntities(tc, entities, productsInfo)
            setResultValue(ht)
        }

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

    let goButton = getGoButton()
    goButton.addEventListener('click', handleGoClick)

    let clearButton = getClearButton()
    clearButton.addEventListener('click', handleClearButtonClick)

    let randomButton = getRandomQueryButton()
    randomButton.addEventListener('click', handleRandomQueryButtonClick)
}
main()
