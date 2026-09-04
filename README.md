# Void Not Here — Telegram Mini App

A dark cosmic game interface inspired by the supplied VoidNotHereBot screenshots. This first milestone is a responsive, dependency-free visual front-end with CSS-only navigation, so it works from a static host without a build step.

## Included

- Classic / Duels mode switcher
- Galactic League Season 3 card and rating progress
- Season leaderboard with podium and rank rows
- Profile screen with XP progress and perk cards
- Gift Lootbox screen
- Mobile-first dark UI with cosmic gradients, glow and safe-area support
- app.js interaction layer ready for the next Telegram/backend integration

## Run locally

Open index.html in a browser, or serve the folder with any static server:

    npx serve .

## Next build steps

1. Add a Telegram bot webhook and initData validation on a server.
2. Persist users, XP, rating, perks and inventory in Postgres.
3. Replace mock rankings with a seasonal leaderboard API.
4. Add real Classic and Duels gameplay loops.
5. Host the client over HTTPS and register the Mini App URL in BotFather.

The UI is an original implementation based on the provided visual reference; it does not copy proprietary assets or code from another bot.
