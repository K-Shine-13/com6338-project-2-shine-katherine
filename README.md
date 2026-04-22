# com6338-project-2-shine-katherine
Project 2 - Create an Interactive Text-Based Adventure Game Using JavaScript

 Gameplay Logic Overview:
 Start Screen
   |
 Merchant Introduction (dialogue choice)
   |
 Cave Exploration
   |--> Infinite loop of cave encounters that player can go though until they either get enough to return to the merchant with
   |--> or the player falls to 0 health and dies.
   |
   |---> Player is faced with a fork in the cave
        |--> Option 1: Safe Route
            |--> Player gains a small amount of gems
            |--> Player finds another fork, returning to the same state
        |--> Option 2: More Dangerous (More lucrative) Route
            |--> Player comes across a large collection of gems worth alot of gold
            |--> if they choose to collect it, they are faced with a monster, and if they run
                |--> they recieve a small amount of damage
                |--> if the player's health reaches 0, they die, reseting the game.
            |--> If they fight the monster
                |--> They recieve a larger amount of damage, but get extra gems from the monster when it retreats.
                |--> They then encounter another fork in the face, restarting the cycle.
                |--> if the player's health reaches 0, they die, reseting the game.
        |- As the player travels, they encounter random chance events that may either grant a reward or cause a loss of either health or gems.
        |- They navigate through the caves until they gain enough loot to return to the merchant with, ending the game.

 Return to Surface → Merchant Inspects Loot
   |
   | --> ≥100 loot → Payout → Start Screen
   | --> <100 loot
         | --> Try again
         | --> Give up --> Start Screen