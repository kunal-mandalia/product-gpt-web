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
    try {
        var rows;
        [, , , , ...rows] = entitiesString.split('\n')
        var d = rows.map(r => r.split(' | '))
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

    if (isLoading) {
        goBtn.innerText = status
        goBtn.disabled = true
        clearBtn.disabled = true
        randBtn.disabled  = true
        statusIndicator.innerText = status
        statusIndicator.classList.remove("hidden")

    } else {
        goBtn.innerText = 'Go'
        goBtn.disabled = false
        clearBtn.disabled = false
        randBtn.disabled  = false
        statusIndicator.classList.add("hidden")
    }
}


function replaceAt(str, index, beforeTerm, afterTerm) {
    return str.substring(0, index) + afterTerm + str.substring(index + beforeTerm.length, str.length)
}

export function highlightEntities(result, entities) {
    var lcResult = result.toLowerCase()
    var indices = entities
        .filter((entity) => {
            return ["Product", "Service"].includes(entity[5])
            // return entity[2] === "Yes" || entity[5] === "Business" || entity[5] === "Professional"
        })
        .map(entity => {
            var name = entity[0]
            var startIndex = lcResult.indexOf(name.toLowerCase())
            if (startIndex === -1) return false
            var endIndex = lcResult.indexOf(name) + name.length
            var entityType = entity[5]
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
        `My house flooded due to a burst pipe. What should I do?`,
        `Was Homer real?`,
        `I'm throwing a birthday party for my niece who is 5 years old. How should I prepare?`
    ]
    var idx = getRandomInt(0, queries.length)
    var res = queries[idx]
    if (res === q) return getRandomQuery()
    return res
}

// tests
function test_highlightEntities() {
    var result = "The best way to get back into shape is to start with a combination of cardio and strength training. Start with a moderate intensity cardio workout such as walking, jogging, or cycling for 30 minutes a day, 3-4 days a week. Then, add in strength training exercises such as push-ups, squats, and lunges to build muscle and increase your overall strength. Make sure to give yourself rest days in between workouts to allow your body to recover. Finally, make sure to eat a balanced diet with plenty of fruits, vegetables, and lean proteins to fuel your body and help you reach your fitness goals."
    var entities = [
        [
            "Cardio",
            "Exercise",
            "No"
        ],
        [
            "Strength Training",
            "Exercise",
            "No"
        ],
        [
            "Walking",
            "Exercise",
            "No"
        ],
        [
            "Jogging",
            "Exercise",
            "No"
        ],
        [
            "Cycling",
            "Exercise",
            "No"
        ],
        [
            "Push-ups",
            "Exercise",
            "No"
        ],
        [
            "Squats",
            "Exercise",
            "No"
        ],
        [
            "Lunges",
            "Exercise",
            "No"
        ],
        [
            "Rest Days",
            "Recovery",
            "No"
        ],
        [
            "Fruits",
            "Food",
            "Yes"
        ],
        [
            "Vegetables",
            "Food",
            "Yes"
        ],
        [
            "Lean Proteins",
            "Food",
            "Yes"
        ]
    ]

    var actual = highlightEntities(result, entities)
    var expected = "The best way to get back into shape is to start with a combination of cardio and strength training. Start with a moderate intensity cardio workout such as walking, jogging, or cycling for 30 minutes a day, 3-4 days a week. Then, add in strength training exercises such as push-ups, squats, and lunges to build muscle and increase your overall strength. Make sure to give yourself rest days in between workouts to allow your body to recover. Finally, make sure to eat a balanced diet with plenty of <strong>Fruits</strong>, <strong>Vegetables</strong>, and <strong>Lean Proteins</strong> to fuel your body and help you reach your fitness goals."
    if (actual !== expected) {
        console.error(`test_highlightEntities failed.
got:
${actual}

want:
${expected}`)
    }
}

function runTests() {
    test_highlightEntities()
}

if (isDev()) {
    runTests()
}
