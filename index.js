// Game State

// Create an object to track all player data and game mode
// - mode determines whether we are on start screen or in-game
// - currentScene determines which scene to render
// - loot(gold), health 

const gameState = {
    mode: "start",
    currentScene: null,
    nextScene: null,
    gold: 0,
    health: 100,
    dangerLevel: 0,
    //Prevents infinite loop of danger events
    dangerCooldown: false
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
    gameState.dangerLevel = 0
    gameState.dangerCooldown = false
}


// Check for Danger Scenes
// - Only allows danger scenes to appear if it is in a "normal" scene scenario

function isDangerScene(sceneId) {
    return ["shadowAttack", "whisperingVoices", "caveShift", "resumeJourney"].includes(sceneId);
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

const scenes = {

    // Merchant Intro

    merchantIntro: {
        text: "A crooked merchant grins at you. \"Looking for work, are we?\"",
        image: "images/merchant.jpg",
        choices: [
            { text: "“Just bored.”", next: "merchantBored" },
            { text: "“I need quick cash.”", next: "merchantCash" }
        ]
    },

    merchantBored: {
        text: "\"Hah! Boredom gets people killed around these parts.\" he chuckles. \"Well, if you insist on curing your boredom this way, enter yonder cave and bring me back a loot worth my time and money. Hrm...About 200 gold for your troubles sounds good, eh?\"",
        image: "images/merchant.jpg",
        choices: [{ text: "Better than nothing...Enter the cave", next: "fork" }]
    },

    merchantCash: {
        text: "\"Good. You'll find a quick job here. Enter yonder cave and bring me back a loot worth my time and money. Hrm...About 200 gold for your troubles sounds good, eh?\"",
        image: "images/merchant.jpg",
        choices: [{ text: "Score! Enter the cave", next: "fork" }]
    },

    // MAIN FORK

    fork: {
        text: "The cave splits into multiple tunnels.",
        image: "images/fork.jpg",
        choices: [
            { text: "Glowing tunnel", next: "crystalTunnel" },
            { text: "Dark tunnel", next: "darkTunnel" },
            { text: "Return to merchant", next: "merchantInspect" }
        ]
    },

    crystalTunnel: {
        text: "Soft blue crystals line the walls.",
        image: "images/crystals.jpg",
        choices: [
            {
                text: "Collect crystals (+20 gold)",
                next: "returnFork",
                effect: (s) => s.gold += 20
            },
            { text: "Go deeper", next: "deepCrystal" }
        ]
    },

    deepCrystal: {
        text: "The crystals pulse... like a heartbeat. Red spikes cover it's form.",
        image: "images/deep-crystal.jpg",
        choices: [
            {
                text: "Harvest large, spiky crystal",
                next: "returnFork",
                effect: (s) => {
                    s.gold += 30
                    s.health -= 10
                }
            },
            {
                text: "Ignore the pulsing gemstone.",
                next: "returnFork",
            }
        ]
    },

    darkTunnel: {
        text: "Something shifts in the darkness, a creature's fangs scrape the cave walls. From the darkness, you see the feint glimmer of gems.",
        image: "images/dark.jpg",
        choices: [
            {
                text: "Reach for the gems, take your chance with the shadow creature.",
                next: "returnFork",
                effect: (s) => {
                    s.gold += 10 + s.dangerLevel * 5
                    s.health -= 20 + s.dangerLevel * 1.5
                }
            },
            { text: "Return to the fork", next: "returnFork" }
        ]
    },

    healingCave: {
        text: "A quiet chamber glows softly. Strange plants pulse with an emerald glow.",
        image: "images/heal.jpg",
        choices: [
            {
                text: "Consume glowing fruit (+30 health)",
                next: "returnFork",
                effect: (s) => s.health += 30
            },
            {
                text: "Rest briefly (+15 health)",
                next: "returnFork",
                effect: (s) => s.health += 15
            },
            { text: "Leave it alone", next: "returnFork" }
        ]
    },

    returnFork: {
        text: "You find your way back to a familiar fork in the cave path.",
        image: "images/fork.jpg",
        choices: [
            { text: "Glowing tunnel", next: "crystalTunnel" },
            { text: "Dark tunnel", next: "darkTunnel" },
            { text: "Return to merchant", next: "merchantInspect" }
        ]
    },

    merchantInspect: {
        text: "The merchant inspects your haul carefully...",
        image: "images/merchant.jpg",
        choices: [{ text: "Wait for his ruling...", next: "merchantOutcome" }]
    },

    // Random Danger Events

    shadowAttack: {
        text: "Something lunges towards you in the dark. Claws rake across your side before you can react.",
        image: "images/dark.jpg",
        choices: [
            {
                text: "Yeouch! All you can do is stumble onward...",
                next: "resumeJourney",
                effect: (s) => s.health -= (10 + s.dangerLevel * 2)
            }
        ]
    },

    whisperingVoices: {
        text: "You hear whispers... promising riches to you if you lend an ear.",
        image: "images/echo.jpg",
        choices: [
            { text: "Ignore them", next: "resumeJourney" },
            {
                text: "Give the mysterious voices a listen, what could go wrong? (-health)",
                next: "resumeJourney",
                effect: (s) => s.health -= 15
            }
        ]
    },

    caveShift: {
        text: "The cave shifts around you.",
        image: "images/abyss.jpg",
        choices: [
            { text: "Press forward", next: "resumeJourney" }
        ]
    },

    resumeJourney: {
        text: "You gather yourself and continue.",
        image: "images/fork.jpg",
        choices: [
            { text: "Continue", next: "resumeStoredScene" }
        ]
    },

    // Endings

    goodEnding: {
        text: "“Now THIS is a haul!” He grins greedily and takes your gemstones with gnarled claws, and pays you well.",
        image: "images/gold.jpg",
        choices: [{ text: "Collect your riches and depart (Return to Start)", next: "startScreen" }]
    },

    badEnding: {
        text: "“This is nothing.” He looks disappointed.",
        image: "images/merchant.jpg",
        choices: [
            { text: "Go back into the cave", next: "fork" },
            { text: "Give up", next: "noPayEnding" }
        ]
    },

    noPayEnding: {
        text: "The merchant curses you under his breath and snatches what measly loot you have. You leave empty-handed.",
        image: "images/empty.jpg",
        choices: [{ text: "Better luck next time! (Return to Title)", next: "startScreen" }]
    },

    consumedEnding: {
        text: "As you try to make your way back to the merchant at the enterance, you the cave's darkness overtake your mind and soul. You've wandered too far into the depths...and the cave does not let you leave.",
        image: "images/death.jpg",
        choices: [{ text: "Whoops! Better luck next time (Return to Title)", next: "startScreen" }]
    },

    death: {
        text: "You feel your life force leave your body as your health depletes. Darkness consumes you.",
        image: "images/death.jpg",
        choices: [{ text: "Better luck next time! (Return to Title)", next: "startScreen" }]
    }
}

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
function renderScene() {
    const scene = scenes[gameState.currentScene]

    storyEl.textContent = scene.text
    imageEl.src = scene.image || ""
    goldEl.textContent = gameState.gold
    healthEl.textContent = gameState.health

    choicesEl.innerHTML = ""

    let choices = [...scene.choices]

    if (gameState.currentScene === "fork" || gameState.currentScene === "returnFork") {
        if (Math.random() < 0.3) {
            choices.push({ text: "A faint glowing passage", next: "healingCave" })
        }
    }

    choices.forEach(choice => {
        const btn = document.createElement("button")
        btn.textContent = choice.text
        btn.onclick = () => handleChoice(choice)
        choicesEl.appendChild(btn)
    })
}

// Main Render Swap

// If mode is "start", show start screen
// Otherwise, render current scene

function render() {
    if (gameState.mode === "start") {
        renderStartScreen()
    } else {
        renderScene()
    }
}

// Handle Player Choices

function handleChoice(choice) {

    // Start Screen Exit
    if (choice.next === "startScreen") {
        resetGame()
        gameState.mode = "start"
        gameState.currentScene = null
        render()
        return
    }

    // Apply effects
    if (choice.effect) {
        choice.effect(gameState)
    }

    // Clamp health at 0
    gameState.health = Math.max(0, gameState.health)

    // Death check
    if (gameState.health <= 0) {
        gameState.currentScene = "death"
        render()
        return
    }

    // Danger system
    if (
        choice.next !== "startScreen" &&
        !isDangerScene(gameState.currentScene) &&
        !gameState.dangerCooldown
    ) {
        gameState.dangerLevel++

        const baseChance = 0.02
        const scaling = gameState.dangerLevel * 0.01

        if (Math.random() < baseChance + scaling) {
            gameState.nextScene = choice.next

            const dangerScenes = ["shadowAttack", "whisperingVoices", "caveShift"]
            gameState.currentScene = dangerScenes[Math.floor(Math.random() * dangerScenes.length)]

            gameState.dangerCooldown = true

            render()
            return
        }
    }

    // Resume from danger
    if (choice.next === "resumeStoredScene") {
        gameState.currentScene = gameState.nextScene
        gameState.dangerCooldown = false
    }

    // Merchant logic
    else if (choice.next === "merchantOutcome") {
        if (gameState.dangerLevel > 25) {
            gameState.currentScene = "consumedEnding"
        } else if (gameState.gold >= 200) {
            gameState.currentScene = "goodEnding"
        } else {
            gameState.currentScene = "badEnding"
        }
    }

    // Normal progression
    else {
        gameState.currentScene = choice.next
    }

    render()
}

// Game Start Render
// Initialize the app by rendering the start gamestate
render()