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
    // return false
    return window.location.hostname.includes('localhost')
}
export function getAPIEndpoint() {
    if (isDev()) {
        return "http://localhost:8888/.netlify/functions/product-gpt-api/"
    }
    return "https://main--product-gpt-api.netlify.app/.netlify/functions/product-gpt-api/"
}

export function setResultValue(nextVal) {
    const resultArea = document.getElementById('result')
    resultArea.innerHTML = nextVal
}

export function setQueryValue(val) {
    const q = document.getElementById('query')
    q.value = val
}


export function parseEntities(entitiesString) {
    try {
        let rows;
        [, , , , ...rows] = entitiesString.split('\n')
        const d = rows
            .map(r => r.split('|'))
            .map(r => {
                const offset = r.length === 8 ? 1 : 0
                return {
                    name: r[offset].trim(),
                    type: r[offset + 1].trim(),
                    saleable: r[offset +2].trim(),
                    category: r[offset + 3].trim(),
                    rootType: r[offset + 4].trim()
                }
            })
        return d
    } catch (e) {
        console.error(e)
        return []
    }
}

export function setLoading(isLoading, status) {
    const goBtn = getGoButton()
    const clearBtn = getClearButton()
    const randBtn = getRandomQueryButton()
    const statusIndicator = getStatusIndicator()
    const statusContainer = getStatusContainer()

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

export function getCurrencySymbol(cur) {
    const symbols = {
        'USD': '$', // US Dollar
        'EUR': '€', // Euro
        'CRC': '₡', // Costa Rican Colón
        'GBP': '£', // British Pound Sterling
        'ILS': '₪', // Israeli New Sheqel
        'INR': '₹', // Indian Rupee
        'JPY': '¥', // Japanese Yen
        'KRW': '₩', // South Korean Won
        'NGN': '₦', // Nigerian Naira
        'PHP': '₱', // Philippine Peso
        'PLN': 'zł', // Polish Zloty
        'PYG': '₲', // Paraguayan Guarani
        'THB': '฿', // Thai Baht
        'UAH': '₴', // Ukrainian Hryvnia
        'VND': '₫', // Vietnamese Dong
    }
    if (!symbols[cur]) {
        return ""
    }
    return symbols[cur]
}

export function highlightEntities(result, entities, productsInfo) {
    const lcResult = result.toLowerCase()
    const highlights = entities
        .filter((entity) => {
            return ["Product", "Service"].includes(entity.rootType) || ["Product", "Service"].includes(entity.type)
        })
        .map(entity => {
            const name = entity.name
            const startIndex = lcResult.includes(name.toLowerCase())
            if (startIndex === -1) return false
            const entityType = (entity.rootType === "Product" || entity.type === "Product") ? "Product" : "Service"
            let pricing = null
            const pi = productsInfo.find(x => x.product.name === entity.name)
            if (pi?.info?.itemSummaries) {
                pricing = getPriceRange(pi.info)
            }
            return { name, entityType, pricing }
        }).filter(Boolean)
    console.table(highlights)

    let withHighlightsHTML = result
    highlights.forEach(h => {
        const searchMask = h.name;
        const regEx = new RegExp(searchMask, "ig");
        const pricing = h.pricing ? `<span class="product_price">${getCurrencySymbol(h.pricing.cur)}${h.pricing.min} - ${h.pricing.max}</span>` : ''
        const className = h.entityType === "Product" ? "product_highlight" : "service_highlight"
        const replaceMask = `<strong class="highlight ${className}">${h.name}${pricing}</strong>`
        withHighlightsHTML = withHighlightsHTML.replace(regEx, replaceMask)
    })
    
    return withHighlightsHTML
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

export function getRandomQuery() {
    const q = getQueryText()
    const queries = [
        `Best PS4 games of all time`,
        `My house flooded due to a burst pipe. What should I do?`,
        `Was Homer real?`,
        `I'm throwing a birthday party for my niece who is 5 years old. How should I prepare?`,
        `What should I get my girlfriend for Valentines day?`
    ]
    const idx = getRandomInt(0, queries.length)
    const res = queries[idx]
    if (res === q) return getRandomQuery()
    return res
}

export function clearProducts() {
    const products = document.getElementById("products")
    products.replaceChildren();
}

export function getItemSummary(name, data) {
    let cur = ""
    const min = Infinity
    const max = 0
    data.itemSummaries.forEach(s => {
        const n = Number(s.price.value)
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

export function getPriceRange(data) {
    let cur = ""
    let min = Infinity
    let max = 0
    data.itemSummaries.forEach(s => {
        const n = Number(s.price.value)
        cur = s.price.currency
        if (n < min) {
            min = n
        }
        if (n >= max) {
            max = n
        }
    })
    return { min, max, cur }
}

export function getEbayMarketPlace() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (["Europe/London", "Europe/Dublin"].includes(tz)) {
        return "EBAY_GB"
    }
    return "EBAY_US"
}
