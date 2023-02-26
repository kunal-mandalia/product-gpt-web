export function getGoButton() {
    return document.getElementById('go-button')
}

export function getClearButton() {
    return document.getElementById('clear-button')
}

export function getRandomQueryButton() {
    return document.getElementById('random-query-button')
}

export function getQueryText() {
    return document.getElementById('query').value
}

export function getStatusIndicator() {
    return document.getElementById('status-indicator')
}
export function getStatusContainer() {
    return document.getElementById('status-container')
}
function isDev() {
    return false
    return window.location.hostname.includes('localhost')
}
export function getAPIEndpoint() {
    if (isDev()) {
        return "http://localhost:8888/.netlify/functions/product-gpt-api/"
    }
    return "https://main--product-gpt-api.netlify.app/.netlify/functions/product-gpt-api/"
}

export function setResultValue(nextVal) {
    var resultArea = document.getElementById('result')
    resultArea.innerHTML = nextVal
}

export function setQueryValue(val) {
    var q = document.getElementById('query')
    q.value = val
}


export function parseEntities(entitiesString) {
    // Entity Name | Entity Type | Saleable | Category | Entity Type | Type
    // ' God of War ', ' Video Game ', ' Yes ', ' Entertainment ', ' Product ', ' Product ',
    try {
        var rows;
        [, , , , ...rows] = entitiesString.split('\n')
        var d = rows
            .map(r => r.split('|'))
            .map(r => {
                return {
                    name: r[1].trim(),
                    type: r[2].trim(),
                    saleable: r[3].trim(),
                    category: r[4].trim(),
                    rootType: r[5].trim()
                }
            })
        return d
    } catch (e) {
        console.error(e)
        return []
    }
}

export function setLoading(isLoading, status) {
    var goBtn = getGoButton()
    var clearBtn = getClearButton()
    var randBtn = getRandomQueryButton()
    var statusIndicator = getStatusIndicator()
    var statusContainer = getStatusContainer()

    if (isLoading) {
        goBtn.innerText = status
        goBtn.disabled = true
        clearBtn.disabled = true
        randBtn.disabled  = true
        statusIndicator.innerText = status
        statusContainer.classList.remove("hidden")

    } else {
        goBtn.innerText = 'Go'
        goBtn.disabled = false
        clearBtn.disabled = false
        randBtn.disabled  = false
        statusContainer.classList.add("hidden")
    }
}


function replaceAt(str, index, beforeTerm, afterTerm) {
    return str.substring(0, index) + afterTerm + str.substring(index + beforeTerm.length, str.length)
}

export function highlightEntities(result, entities) {
    var lcResult = result.toLowerCase()
    var indices = entities
        .filter((entity) => {
            return ["Product", "Service"].includes(entity.rootType)
        })
        .map(entity => {
            var name = entity.name
            var startIndex = lcResult.indexOf(name.toLowerCase())
            if (startIndex === -1) return false
            var endIndex = lcResult.indexOf(name) + name.length
            var entityType = entity.rootType
            return { name, startIndex, endIndex, entityType }
        }).filter(Boolean)
    var sortedIndices = indices.sort((a, b) => {
        return a.startIndex < b.startIndex
    })
    let withHighlightsHTML = result
    var productLeftBracket = '<strong class="highlight product_highlight">'
    var serviceLeftBracket = '<strong class="highlight service_highlight">'
    var rightBracket = "</strong>"
    var bracketLength = productLeftBracket.length + rightBracket.length
    sortedIndices.forEach((entity, idx) => {
        var leftBracket = entity.entityType === "Product" ? productLeftBracket : serviceLeftBracket
        var replacement = `${leftBracket}${entity.name}${rightBracket}`
        var index = (bracketLength * idx) + entity.startIndex
        withHighlightsHTML = replaceAt(withHighlightsHTML, index, entity.name, replacement)
    })
    return withHighlightsHTML
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

export function getRandomQuery() {
    var q = getQueryText()
    var queries = [
        `Best PS4 games of all time`,
        `My house flooded due to a burst pipe. What should I do?`,
        `Was Homer real?`,
        `I'm throwing a birthday party for my niece who is 5 years old. How should I prepare?`
    ]
    var idx = getRandomInt(0, queries.length)
    var res = queries[idx]
    if (res === q) return getRandomQuery()
    return res
}

export function clearProducts() {
    var products = document.getElementById("products")
    products.replaceChildren();
}

export function getItemSummary(name, data) {
    let cur = ""
    let min = Infinity
    let max = 0
    data.itemSummaries.forEach(s => {
        let n = Number(s.price.value)
        cur = s.price.currency
        if (n < min) {
            min = n
        }
        if (n >= max) {
            max = n
        }
    })
    return `${name}: ${min} - ${max} ${cur}`
}

export function getEbayMarketPlace() {
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (["Europe/London", "Europe/Dublin"].includes(tz)) {
        return "EBAY_GB"
    }
    return "EBAY_US"
}
