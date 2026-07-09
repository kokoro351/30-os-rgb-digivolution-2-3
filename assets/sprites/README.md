# Sprite assets

Each monster can have multiple frames. The game reads the paths from the `MONSTERS` data in `game.js`.

Current naming rule:

```text
assets/sprites/<monster-id>_01.png
assets/sprites/<monster-id>_02.png
```

Examples:

```text
assets/sprites/botamon_01.png
assets/sprites/botamon_02.png
assets/sprites/babumon_01.png
assets/sprites/babumon_02.png
assets/sprites/agumon_01.png
assets/sprites/agumon_02.png
assets/sprites/ikkakumon_01.png
assets/sprites/ikkakumon_02.png
assets/sprites/garudamon_01.png
assets/sprites/garudamon_02.png
assets/sprites/megakabuterimon_01.png
assets/sprites/megakabuterimon_02.png
assets/sprites/zudomon_01.png
assets/sprites/zudomon_02.png
assets/sprites/hououmon_01.png
assets/sprites/hououmon_02.png
assets/sprites/phoenixmon_01.png
assets/sprites/phoenixmon_02.png
assets/sprites/herculeskabuterimon_01.png
assets/sprites/herculeskabuterimon_02.png
assets/sprites/vikemon_01.png
assets/sprites/vikemon_02.png
```

If an image is missing, the game falls back to an attribute-colored placeholder and keeps running.

`Kabuterimon` is currently data-only. Add these files later to replace the fallback:

```text
assets/sprites/kabuterimon_01.png
assets/sprites/kabuterimon_02.png
```

Legacy single-frame files such as `agumon.png` may remain in the folder, but the current runtime uses the `_01` / `_02` frame files.
