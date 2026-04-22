// Game State

// Create an object to track all player data and game mode
// - mode determines whether we are on start screen or in-game
// - currentScene determines which scene to render
// - loot(gold), health 

const gameState = {
    mode: "start", // "start" or "game"
    currentScene: null,
    gold: 0,
    health: 100
}

// DOM Element Consts

const storyEl = document.getElementById("story")
const choicesEl = document.getElementById("choices")
const goldEl = document.getElementById("gold")
const healthEl = document.getElementById("health")
const imageEl = document.getElementById("scene-image")

// Reset Game Function

// Resets all player values to default
// Used when starting a new game when player cashes out/leaves/dies in game

function resetGame() {
    gameState.gold = 0
    gameState.health = 100
}

// Scenes

// Each scene contains:
// - text 
// - image (if applicable)
// - choices (array of options)
// Each choice contains:
// - text (button label)
// - next (next scene ID)
// - effect (optional function modification to statuses (health or loot increase/decrease))


// Render Start State

// Display title, author name, and start button for user to click to start game
// When clicked:
// - reset game state
// - switch mode to "game"
// - go to merchant intro scene

function renderStartScreen() {
    storyEl.innerHTML = `
    <h2>Welcome to Cave Explorer Simulator!</h2>
    <p>By K S</p>
    <p>You've heard tell of a local cave that may  (or may not) contain some valuable treasures.</p>
    <p> As luck would have it, a merchant seems to have set up shop outside of the cave mouth, intriging you further.</p>
    <p> What harm can there be in checking it out?</p>
  `

    imageEl.src = "images/title.jpg"
    choicesEl.innerHTML = ""

    const btn = document.createElement("button")
    btn.textContent = "Start Game"

    btn.onclick = () => {
        console.log("Start button clicked")
        resetGame()
        gameState.mode = "game"
        gameState.currentScene = "merchantIntro"
        render()
    }

    choicesEl.appendChild(btn)
}

// Render Scene

// Get current scene
// Update:
// - story text
// - image (if applicable)
// - stats display
// - buttons for each choice


// Main Render Swap

// If mode is "start", show start screen
// Otherwise, render current scene

function render() {
    console.log("MODE:", gameState.mode)


    if (gameState.mode === "start") {
        renderStartScreen()
    } else {
        renderScene()
    }
}

// Handle Player Choices

// When a player clicks a choice button:
// - Update statuses (gold/health changes)
// - Check for special transitions:
//    - merchant outcome (conditional branch)
//    - death condition
//    - return to start screen
// - Update current scene
// - Re-render


// Game Start Render
// Initialize the app by rendering the start gamestate
render()