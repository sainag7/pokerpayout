# Poker Payout

A calculator for settling up after home poker games. Enter each player's buy-ins and final chip counts, and the app figures out exactly who owes what.

**Live site:** https://poker-payout.netlify.app/

## How It Works

1. **Setup** -- Add players and set their buy-in amounts. Buy-ins can be edited at any time during setup. Requires at least 2 players to start.
2. **Play** -- Manage rebuys and late arrivals mid-game. Remove players who leave early.
3. **Cashout** -- Enter each player's final chip count. The app validates that total chips out equals total chips in before proceeding.
4. **Results** -- See a leaderboard of winners and losers, then choose how to settle up.

## Settlement Modes

Pick a mode on the Results screen after everyone has cashed out. You can switch between modes freely to compare.

**Banker Mode** -- One player is designated as the banker. All winners receive their payout directly from the banker via Zelle. Tap "Set Banker" next to any player's name on the Results screen to assign them.

**Simplified Payments** -- No banker needed. The app calculates the fewest possible peer-to-peer Zelle transfers to settle all debts, using a greedy algorithm that matches the biggest debtor to the biggest creditor each round.

Both modes show individual copy buttons per transaction plus a "Copy All" button to copy every payment as line-by-line text.

## Other Features

- **Edit buy-ins** -- Fix a buy-in amount directly on the Setup screen without removing and re-adding the player.
- **Reset button** -- Available on every screen after Setup. Clears all game data after a confirmation prompt.
- **Session persistence** -- Game data is saved automatically. If you lock your phone or switch apps, your session is restored. Refreshing the page or closing the tab starts fresh.

## Data Storage

All data stays on your device. Game state is stored in localStorage under a session token that lives in sessionStorage. Refreshing or closing the tab clears the session token, so the app resets to a clean state. No accounts, no backend.
