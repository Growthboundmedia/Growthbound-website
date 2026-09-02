# Palettes

The written-down record of the site's colour, so trying an alternative is never
a one-way door. `src/styles/tokens.css` is the only file in the site allowed to
contain a hex value, so a palette swap is that one file and nothing else.

---

## GRAPHITE + AMBER — the locked palette

**This is the live one.** Warm near-black ground, warm off-white paper, one
amber accent. Chosen because amber on near-black reads as the trades without
being a hi-vis costume, and because a dark ground makes photography of someone
else's work look like the product.

### Ground
| Token | Hex | Job |
|---|---|---|
| `--ink` | `#0E1011` | the page. Not pure black: a trace of blue-green stops it reading as a switched-off screen |
| `--coal` | `#16191A` | a raised surface, a card, a panel |
| `--carbon` | `#1E2223` | a hover, a hairline fill, an inset |

### Light sections
| Token | Hex | Job |
|---|---|---|
| `--bone` | `#F2F0EC` | warm off-white. Never `#FFF`: it glares next to the dark |
| `--linen` | `#E8E5DF` | a second light surface |

### Text
| Token | Hex |
|---|---|
| `--on-dark` | `#F2F0EC` |
| `--on-dark-soft` | `#A8A9A5` |
| `--on-light` | `#0E1011` |
| `--on-light-soft` | `#575A57` |

### Accent and state
| Token | Hex | Job |
|---|---|---|
| `--amber` | `#F0A82C` | the FILL: buttons, bullets, flags |
| `--amber-text` | `#F0A82C` | the TEXT amber. `.on-light` swaps it for `--amber-deep` |
| `--amber-deep` | `#8A5E04` | amber dark enough to read on a light ground |
| `--red` | `#DF603A` | form errors ON DARK |
| `--red-deep` | `#B13A16` | form errors ON LIGHT |

### Verified contrast (computed, never estimated. AA: 4.5 body, 3 large)
```
--bone         #F2F0EC on --ink   #0E1011   16.76  PASS
--on-dark-soft #A8A9A5 on --ink   #0E1011    8.07  PASS
--on-dark-soft #A8A9A5 on --coal  #16191A    7.48  PASS
--on-dark-soft #A8A9A5 on --carbon#1E2223    6.79  PASS
--amber        #F0A82C on --ink   #0E1011    9.39  PASS
--amber        #F0A82C on --coal  #16191A    8.71  PASS
--ink          #0E1011 on --amber #F0A82C    9.39  PASS  (button face)
--ink          #0E1011 on --bone  #F2F0EC   16.76  PASS
--on-light-soft#575A57 on --bone  #F2F0EC    6.14  PASS
--on-light-soft#575A57 on --linen #E8E5DF    5.56  PASS
--amber-deep   #8A5E04 on --bone  #F2F0EC    5.01  PASS
--amber-deep   #8A5E04 on --linen #E8E5DF    4.53  PASS
--red          #DF603A on --ink   #0E1011    5.33  PASS
--red-deep     #B13A16 on --bone  #F2F0EC    5.29  PASS
--red-deep     #B13A16 on --linen #E8E5DF    4.79  PASS
```

**Errors need TWO reds.** One value cannot clear 4.5:1 on both a near-black and
a warm off-white. The first attempt (`#D14A32`) measured 4.30 and 3.90 and would
have shipped an unreadable error on every surface.

### The derived alphas
These are `--ink` and `--bone` at opacity, so they move with the palette:
```
--line               rgba(242, 240, 236, 0.14)   bone
--line-soft          rgba(242, 240, 236, 0.07)   bone
--line-strong        rgba(242, 240, 236, 0.30)   bone
--line-light         rgba(14, 16, 17, 0.14)      ink
--line-light-soft    rgba(14, 16, 17, 0.07)      ink
--line-light-strong  rgba(14, 16, 17, 0.32)      ink
--nav-bg             rgba(14, 16, 17, 0.72)      ink
--nav-bg-solid       rgba(14, 16, 17, 0.92)      ink
--hover-wash         rgba(242, 240, 236, 0.06)   bone
--scrim              ink at .86 / .62 / .90
```

---

## STEEL + SIGNAL ORANGE — the alternative, on branch `try/steel-orange`

Not a tweak. The ground goes from warm graphite to cool blue-black and the
accent from amber to a hi-vis safety orange, so the whole page changes
temperature rather than just its highlight colour.

| Token | Graphite + amber | Steel + orange |
|---|---|---|
| `--ink` | `#0E1011` | `#0B1219` |
| `--coal` | `#16191A` | `#121B24` |
| `--carbon` | `#1E2223` | `#1A2530` |
| `--bone` | `#F2F0EC` | `#EEF1F3` |
| `--linen` | `#E8E5DF` | `#DFE4E8` |
| `--on-dark` | `#F2F0EC` | `#EEF1F3` |
| `--on-dark-soft` | `#A8A9A5` | `#9AA7B2` |
| `--on-light` | `#0E1011` | `#0B1219` |
| `--on-light-soft` | `#575A57` | `#4E5A66` |
| `--amber` | `#F0A82C` | `#FF6A2B` |
| `--amber-deep` | `#8A5E04` | `#9A3D06` |
| `--red` | `#DF603A` | `#FF9DB0` |
| `--red-deep` | `#B13A16` | `#B3213A` |

Every pair was computed the same way and every one passes. The error red is a
pink rather than another warm orange on purpose: `#FF6B7F` was the obvious
choice and measured 1.04 against the accent, meaning the two separated by hue
alone and an error would have looked like a highlight to anyone with a colour
vision deficiency. `#FF9DB0` is 9.60 on the ground and 1.46 from the accent, so
it separates by brightness too.

---

## Switching

```bash
git checkout try/steel-orange      # see the alternative
git checkout rebuild/plans-table   # back to graphite + amber, byte for byte
```

The revert is a git checkout, not a retype, so "exactly how it was" is
guaranteed rather than remembered. The palette is one file: nothing else in the
site contains a hex.
