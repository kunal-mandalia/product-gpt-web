import { highlightEntities } from "./util.js"

// tests
function test_highlightEntities() {
    let result = "The best way to get back into shape is to start with a combination of cardio and strength training. Start with a moderate intensity cardio workout such as walking, jogging, or cycling for 30 minutes a day, 3-4 days a week. Then, add in strength training exercises such as push-ups, squats, and lunges to build muscle and increase your overall strength. Make sure to give yourself rest days in between workouts to allow your body to recover. Finally, make sure to eat a balanced diet with plenty of fruits, vegetables, and lean proteins to fuel your body and help you reach your fitness goals."
    let entities = [
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

    let actual = highlightEntities(result, entities)
    let expected = `The best way to get back into shape is to start with a combination of cardio and strength training. Start with a moderate intensity cardio workout such as walking, jogging, or cycling for 30 minutes a day, 3-4 days a week. Then, add in strength training exercises such as push-ups, squats, and lunges to build muscle and increase your overall strength. Make sure to give yourself rest days in between workouts to allow your body to recover. Finally, make sure to eat a balanced diet with plenty of <strong class="highlight product_highlight">Fruits</strong>, <strong class="highlight product_highlight">Vegetables</strong>, and <strong class="highlight product_highlight">Lean Proteins</strong> to fuel your body and help you reach your fitness goals.`
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

runTests()
