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
    clearProducts
} from "./util.js"

function getItemSummary(d) {
    var url = new URL(d.href)
    var q = url.searchParams.get("q")

    let cur = ""
    let min = Infinity
    let max = 0
    d.itemSummaries.forEach(s => {
        let n = Number(s.price.value)
        cur = s.price.currency
        if (n < min) {
            min = n
        }
        if (n >= max) {
            max = n
        }
    })
    return `${q}: ${min} - ${max} ${cur}`
}

async function handleGoClick() {
    try {
        setLoading(true, 'Preparing a chat response...')
        // get text input
        var q = getQueryText();
        if (!q) {
            throw new Error('Missing query')
        }

        setResultValue('')
        clearProducts()

        var baseUrl = getAPIEndpoint()
        // api call for /textcompletion
        var tcEndpoint = baseUrl + "textcompletion?q=" + q;
        var tcRes = await fetch(tcEndpoint, {
            method: "GET",
        })
        var tcValue = await tcRes.json()
        var tc = tcValue.choices[0]
            .text
            .trimLeft()
            .replaceAll('\n', '<br/>')

        // render response
        setResultValue(tc)


        // api call for /entities
        setLoading(true, 'Identifying related products and services...')
        var entityEndpoint = baseUrl + "entities";
        var entityRes = await fetch(entityEndpoint, {
            method: "POST",
            body: JSON.stringify({
                query_request: tc,
            })
        })
        var entityValue = await entityRes.json()
        var entities = parseEntities(entityValue.choices[0].text)
        console.table(entities)
        

        // highlight response
        var ht = highlightEntities(tc, entities)
        console.log(ht)
        setResultValue(ht)


        setLoading(true, 'Finding product prices...')
        // get ebay prod info inc prices for products
        let products = entities.filter(entity => entity[5] === "Product")
        // TODO let api accept array of products
        for (let i = 0; i < products.length; i++) {
            var product = products[i]
            var productRes = await fetch(baseUrl + `ebay_search?q=${product[0]}`)
            var productText = await productRes.json()
            console.log(productText)
            
            let node = document.getElementById("products")
            var newNode = document.createElement("div")
            newNode.classList.add("product");
            var newContent = document.createTextNode(getItemSummary(productText))
            newNode.appendChild(newContent)
            node.append(newNode)
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

    var goButton = getGoButton()
    goButton.addEventListener('click', handleGoClick)

    var clearButton = getClearButton()
    clearButton.addEventListener('click', handleClearButtonClick)

    var randomButton = getRandomQueryButton()
    randomButton.addEventListener('click', handleRandomQueryButtonClick)
}
main()
