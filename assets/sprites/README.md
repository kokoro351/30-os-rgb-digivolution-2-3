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
assets/sprites/agumon_01.png
assets/sprites/agumon_02.png
```

If an image is missing, the game falls back to an attribute-colored placeholder and keeps running.

Legacy single-frame files such as `agumon.png` may remain in the folder, but the current runtime uses the `_01` / `_02` frame files.
