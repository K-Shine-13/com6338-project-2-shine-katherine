# com6338-project-2-shine-katherine
## Project 2 - Create an Interactive Text-Based Adventure Game Using JavaScript

Cave Explorer Simulator is a browser-based, text-driven adventure game inspired by classic terminal RPGs. The player takes on the role of a cave explorer tasked with collecting valuable loot for a mysterious merchant stationed at the cave entrance.

The core gameplay loop revolves around risk vs. reward:

- Players explore branching cave paths
- Collect loot (gold) while managing health
- Encounter increasingly dangerous conditions the longer they stay inside
- Return to the merchant to cash out—or risk losing everything
## Core Features
### Scene-Based Navigation
- The game is structured as interconnected “scenes”
- Each scene presents narrative text and a set of player choices
- Choices determine the next scene and may modify player stats
### Player State Management
- Tracks:
 - Gold (loot collected via collecting gems during the game)
 - Health
 - Danger Level (hidden difficulty scaling used to calculate probability for random danger events)
 - State persists across scenes until the game ends
### Dynamic Risk System
- The longer the player explores, the higher the dangerLevel rises, the chance of random negative events to occur
- Encourages players to balance greed vs. survival
### Randomized Elements
- Occasional hidden paths (e.g., healing cave)
- Random danger events that interrupt progression
- Adds replayability without requiring complex systems
### Multiple Endings
- Successful cash-out (the player has accumulated enough gold for the merchant to pay them)
- Failure (insufficient loot)
- Death (health reaches 0)
- Hidden endings (triggered by high danger levels)
### Game Loop Structure
- Start screen
- Merchant introduction
- Cave exploration loop
- Return to merchant or die
- End screen --> restart

## Pseudocode & Logic Structure of Cave Explorer Simulator
### 1. Game Initialization
START PROGRAM

Initialize gameState:
    mode = "start"
    currentScene = null
    gold = 0
    health = 100
    dangerLevel = 0
    dangerCooldown = false

Render the start screen

### 2. Start Screen Flow
FUNCTION renderStartScreen:
    Display title and intro text
    Display "Start Game" button

    ON button click:
        Reset game state
        Set mode = "game"
        Set currentScene = "merchantIntro"
        Render game

### 3. Scene Rendering System
FUNCTION renderScene:
    Get current scene from scenes object

    Display:
        scene.text
        player gold
        player health

    Clear previous choices

    Copy scene choices into a new list

    IF scene is a cave fork:
        Randomly add hidden path option

    FOR each choice:
        Create button
        Attach click handler → handleChoice(choice)

### 4. Handling Player Choices
FUNCTION handleChoice(choice):

    IF choice leads to start screen:
        Reset game
        Switch mode to "start"
        Render start screen
        EXIT

    Apply choice effects (if any):
        Modify gold and/or health

    Clamp health to minimum of 0

    IF health <= 0:
        Set currentScene = "death"
        Render
        EXIT

### 5. Danger System
IF current scene is NOT a danger scene
AND dangerCooldown is false:

    Increase dangerLevel

    Calculate chance:
        baseChance + (dangerLevel * scaling)

    IF random roll succeeds:
        Store intended next scene
        Redirect to random danger event
        Set dangerCooldown = true
        Render
        EXIT

### 6. Resolving Danger Events
IF player selects "continue" after danger:

    Set currentScene = stored nextScene
    Reset dangerCooldown = false

### 7. Merchant Outcome Logic
IF player returns to merchant:

    IF dangerLevel is very high:
        Trigger hidden ending

    ELSE IF gold >= required amount:
        Trigger good ending

    ELSE:
        Trigger bad ending

### 8. Scene Transition
Set currentScene = choice.next
Render updated scene

### 9. Game Loop Structure
REPEAT:
    Render scene
    Wait for player input
    Process choice
UNTIL:
    Player reaches ending or returns to start