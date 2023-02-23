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
    getRandomQueryButton
} from "./util.js"

async function handleGoClick() {
    try {
        setLoading(true, 'Preparing a chat response')
        // get text input
        var q = getQueryText();
        if (!q) {
            throw new Error('Missing query')
        }

        setResultValue('')

        var baseeUrl = getAPIEndpoint()
        // api call for /textcompletion
        var tcEndpoint = baseeUrl + "textcompletion?q=" + q;
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
        setLoading(true, 'Identifying related products and services')
        var entityEndpoint = baseeUrl + "entities";
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

        // todo: api call for /search for further products
    } catch (e) {
        console.error(e)
    } finally {
        setLoading(false)
    }
}

function handleClearButtonClick() {
    setQueryValue('')
    setResultValue('')
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
