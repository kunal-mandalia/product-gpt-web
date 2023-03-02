export function getGoButton() {
    return document.getElementById('go_button')
}

export function getClearButton() {
    return document.getElementById('clear_button')
}

export function getActions() {
    return document.getElementById('actions')
}

export function getRandomQueryButton() {
    return document.getElementById('random_query_button')
}

export function getQueryText() {
    return document.getElementById('query').value
}

export function getStatusIndicator() {
    return document.getElementById('status_indicator')
}
export function getStatusContainer() {
    return document.getElementById('status_container')
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
    const actions = getActions()
    const statusIndicator = getStatusIndicator()
    const statusContainer = getStatusContainer()

    if (isLoading) {
        actions.classList.add("hidden")
        statusIndicator.innerText = status
        statusContainer.classList.remove("hidden")

    } else {
        actions.classList.remove("hidden")
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
        const pricing = h.pricing ? `<button type="button" class="product_price">${getCurrencySymbol(h.pricing.cur)}${h.pricing.min} - ${h.pricing.max}</button>` : ''
        const className = h.entityType === "Product" ? "product_highlight" : "service_highlight"
        const replaceMask = `<span id="price_${h.name}" class="highlight ${className}">${h.name}${pricing}</span>`
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
        `Tell me the top five PS4 games I should play and why`,
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

export function getProductNode({ product, info }) {
    const node = document.createElement('div')
    node.setAttribute('id', product.name )
    node.classList = 'product_details'
    const title = document.createElement('h4')
    title.innerHTML = product.name
    node.appendChild(title)

    const imgWrapper = document.createElement('div')
    imgWrapper.classList = 'img_container'
    node.appendChild(imgWrapper)

    const buyLink = document.createElement('div')
    buyLink.classList = 'buy_container'
    buyLink.innerHTML = `<a class="buy_link fade_in" target="_blank">Buy from eBay</a>`

    info?.itemSummaries?.forEach((s, idx) => {
        if (s?.thumbnailImages?.length > 0 && idx < 3) {
            if (idx === 0) {
                buyLink.innerHTML = `<a class="buy_link fade_in" href="${s.itemWebUrl}" target="_blank">Buy from eBay</a>`
            }
            const img = document.createElement('img')
            img.setAttribute('src', s.thumbnailImages[0].imageUrl)
            img.classList = 'product_image'
            imgWrapper.appendChild(img)
        }
    })
    node.appendChild(buyLink)
    return node
}

export function renderProducts(productsInfo) {
    const rootNode = document.getElementById('products')
    productsInfo.forEach(p => {
        const node = getProductNode(p)
        rootNode.appendChild(node)
    })
}

export function createPriceHandler(productName) {
    const el = document.getElementById(`price_${productName}`)
    const target = document.getElementById(productName)
    if (el && target) {
        el.removeAttribute('href')
        el.onclick = () => {
            target.scrollIntoView({
                behavior: 'smooth'
            })
            target.classList = 'product_details flash_product_details'
            setTimeout(() => {
                target.classList = 'product_details'
            }, 3000);
        }
    }
}