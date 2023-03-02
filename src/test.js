import { highlightEntities, parseEntities } from "./util.js"

// tests
function test_highlightEntities() {
    const result = "The best way to get back into shape is to start with a combination of cardio and strength training. Start with a moderate intensity cardio workout such as walking, jogging, or cycling for 30 minutes a day, 3-4 days a week. Then, add in strength training exercises such as push-ups, squats, and lunges to build muscle and increase your overall strength. Make sure to give yourself rest days in between workouts to allow your body to recover. Finally, make sure to eat a balanced diet with plenty of fruits, vegetables, and lean proteins to fuel your body and help you reach your fitness goals."
    const entities = [
        {
            name: "Fruits",
            type: "Food",
            rootType: "Product"
        },
        {
            name: "Vegetables",
            type: "Food",
            rootType: "Product"
        },
        {
            name: "Lean Proteins",
            type: "Food",
            rootType: "Product"
        }
    ]

    const actual = highlightEntities(result, entities, [])
    const expected = `The best way to get back into shape is to start with a combination of cardio and strength training. Start with a moderate intensity cardio workout such as walking, jogging, or cycling for 30 minutes a day, 3-4 days a week. Then, add in strength training exercises such as push-ups, squats, and lunges to build muscle and increase your overall strength. Make sure to give yourself rest days in between workouts to allow your body to recover. Finally, make sure to eat a balanced diet with plenty of <span id="price_RnJ1aXRz" class="highlight product_highlight">Fruits</span>, <span id="price_VmVnZXRhYmxlcw" class="highlight product_highlight">Vegetables</span>, and <span id="price_TGVhbiBQcm90ZWlucw" class="highlight product_highlight">Lean Proteins</span> to fuel your body and help you reach your fitness goals.`
    if (actual !== expected) {
        console.error(`test_highlightEntities failed.
got:
${actual}

want:
${expected}`)
    } else {
        console.info(`highlightEntities passed`)
    }
}

function test_parseEntities() {
    const response = `| Entity Name | Entity Type | Saleable | Category | Entity Type | Type |
    | God of War | Video Game | Yes | Entertainment | Product | Product |
    | The Last of Us Remastered | Video Game | Yes | Entertainment | Product | Product |
    | Red Dead Redemption 2 | Video Game | Yes | Entertainment | Product | Product |
    | Marvel's Spider-Man | Video Game | Yes | Entertainment | Product | Product |
    | Bloodborne | Video Game | Yes | Entertainment | Product | Product |
    | Horizon Zero Dawn | Video Game | Yes | Entertainment | Product | Product |
    | Uncharted 4: A Thief's End | Video Game | Yes | Entertainment | Product | Product |
    | Persona 5 | Video Game | Yes | Entertainment | Product | Product |
    | Grand Theft Auto V | Video Game | Yes | Entertainment | Product | Product |
    | The Witcher 3: Wild Hunt | Video Game | Yes | Entertainment | Product | Product |`

    const actual = parseEntities(response)
    const expected = [{"name":"Marvel's Spider-Man","type":"Video Game","saleable":"Yes","category":"Entertainment","rootType":"Product"},{"name":"Bloodborne","type":"Video Game","saleable":"Yes","category":"Entertainment","rootType":"Product"},{"name":"Horizon Zero Dawn","type":"Video Game","saleable":"Yes","category":"Entertainment","rootType":"Product"},{"name":"Uncharted 4: A Thief's End","type":"Video Game","saleable":"Yes","category":"Entertainment","rootType":"Product"},{"name":"Persona 5","type":"Video Game","saleable":"Yes","category":"Entertainment","rootType":"Product"},{"name":"Grand Theft Auto V","type":"Video Game","saleable":"Yes","category":"Entertainment","rootType":"Product"},{"name":"The Witcher 3: Wild Hunt","type":"Video Game","saleable":"Yes","category":"Entertainment","rootType":"Product"}]

    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        console.error(`test_parseEntities failed.
got:
${JSON.stringify(actual)}

want:
${JSON.stringify(expected)}`)
    } else {
        console.info(`test_parseEntities passed`)
    }
}

function test_parseEntities_2() {
    const response = `.

    Entity Name | Entity Type | Saleable | Category | Entity Type | Type
    ------------|-------------|----------|---------|-------------|------
    Water Supply | Resource | No | Utility | Resource | Other
    Insurance Company | Organization | No | Service Provider | Organization | Service
    Water Damage Restoration Company | Organization | No | Service Provider | Organization | Service
    Items | Product | Yes | Goods | Product | Product
    Photos | Product | Yes | Goods | Product | Product
    Plumber | Organization | No | Service Provider | Organization | Service
    Mold Growth | Resource | No | Utility | Resource | Other`

    const actual = parseEntities(response)
    const expected = [{"name":"Water Supply","type":"Resource","saleable":"No","category":"Utility","rootType":"Resource"},{"name":"Insurance Company","type":"Organization","saleable":"No","category":"Service Provider","rootType":"Organization"},{"name":"Water Damage Restoration Company","type":"Organization","saleable":"No","category":"Service Provider","rootType":"Organization"},{"name":"Items","type":"Product","saleable":"Yes","category":"Goods","rootType":"Product"},{"name":"Photos","type":"Product","saleable":"Yes","category":"Goods","rootType":"Product"},{"name":"Plumber","type":"Organization","saleable":"No","category":"Service Provider","rootType":"Organization"},{"name":"Mold Growth","type":"Resource","saleable":"No","category":"Utility","rootType":"Resource"}]

    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        console.error(`test_parseEntities_2 failed.
got:
${JSON.stringify(actual)}

want:
${JSON.stringify(expected)}`)
    } else {
        console.info(`test_parseEntities_2 passed`)
    }
}

function test_parseEntities_3() {
    const response = `.

    Entity Name | Entity Type | Saleable | Category | Entity Type | Type
    ------------|------------|----------|---------|------------|------
    Pikachu Illustrator (1st Edition) | Trading Card | Yes | Trading Card | Product | Product
    Charizard (1st Edition Shadowless) | Trading Card | Yes | Trading Card | Product | Product
    Blastoise (1st Edition) | Trading Card | Yes | Trading Card | Product | Product
    Venusaur (1st Edition) | Trading Card | Yes | Trading Card | Product | Product
    Alakazam (1st Edition) | Trading Card | Yes | Trading Card | Product | Product`

    const actual = parseEntities(response)
    const expected = [{"name":"Pikachu Illustrator (1st Edition)","type":"Trading Card","saleable":"Yes","category":"Trading Card","rootType":"Product"},{"name":"Charizard (1st Edition Shadowless)","type":"Trading Card","saleable":"Yes","category":"Trading Card","rootType":"Product"},{"name":"Blastoise (1st Edition)","type":"Trading Card","saleable":"Yes","category":"Trading Card","rootType":"Product"},{"name":"Venusaur (1st Edition)","type":"Trading Card","saleable":"Yes","category":"Trading Card","rootType":"Product"},{"name":"Alakazam (1st Edition)","type":"Trading Card","saleable":"Yes","category":"Trading Card","rootType":"Product"}]

    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        console.error(`test_parseEntities_3 failed.
got:
${JSON.stringify(actual)}

want:
${JSON.stringify(expected)}`)
    } else {
        console.info(`test_parseEntities_3 passed`)
    }
}

function runTests() {
    test_highlightEntities()
    test_parseEntities()
    test_parseEntities_2()
    test_parseEntities_3()
}

runTests()
