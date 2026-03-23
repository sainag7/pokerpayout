# Poker Payout

A calculator for settling up after home poker games. Enter each player's buy-ins and final chip counts, and the app figures out exactly who owes what — with all payments routed through a single banker via Zelle.

**Live site:** [(https://poker-payout.netlify.app/)](https://poker-payout.netlify.app/)

## How It Works

1. **Setup** — Add players, set their buy-in amounts, and designate a banker (the person who collects all buy-ins and sends payouts).
2. **Play** — Manage rebuys and late arrivals mid-game.
3. **Cashout** — Enter each player's final chip count. The app validates that total chips out equals total chips in.
4. **Results** — See a leaderboard of winners/losers and the exact Zelle transactions the banker needs to make.

All data stays on your device (localStorage) — no accounts, no backend.
