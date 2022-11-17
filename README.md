# Überstack
### The Stackline clone powered by Übersicht

<hr/>

![a demo for uberstack](demo.gif)

## What is Überstack?

Überstack is an implementation of [Adam Wagner's](https://github.com/AdamWagner) tool [Stackline](https://github.com/AdamWagner/stackline). Stackline adds visual indicators to show the windows within a [Yabai](https://github.com/koekeishiya/yabai) stack. As Wagner mentions in his project, 

> "there's no built-in UI for stacks, which makes it easy to forget about stacked windows that aren't visible or get disoriented". 

The reason Überstack exists is because Stackline requires and is powered by Hammerspoon which, while an extremely powerful tool, I personally found too cumbersome to install on my device. Überstack is an alternative (well I say alternative, but it's pretty much a clone) to Stackline that uses the popular app Übersicht instead, an app much more straightforward to install and one many Yabai users already have (due to its popular use for custom Yabai-integrated menu bars).

Überstack contains many of the same features of Stackline, except there's (currently) no smart positioning (icons always appear on the left) and no settings modifications through shell commands (instructions on changing these settings are below).

It goes without saying, but if you want a mucher higher quality version of this tool, please use and support the original implementation by Adam Wagner [here](https://github.com/AdamWagner/stackline). While a bit more complicated to set up, it's far more robust and has had much more time and effort invested into it. This version is most likely more buggy and less performant than Stackline (which you can see in the current demo GIF).

## Installation

1. Ensure you've installed both [Yabai](https://github.com/koekeishiya/yabai) and [Übersicht](https://github.com/felixhageloh/uebersicht) on your device
2. You also need to install [jq](https://stedolan.github.io/jq/) as a command line dependency, which can be done with [Homebrew](https://brew.sh/) using the command `brew install jq`
3. Clone or download this repository into your Übersicht widget folder (when dowloading make sure to unzip to a folder)
4. Ensure the widget folder name is uberstack, as any other folder name will not work
5. Run `which yabai` and `which jq` in the terminal and check if the outputs match the values of the variables `yabai` and `jq` within `lib/settings.js` respectively. If not, change the variable values to match the output of the `which` command.
6. That's it!

## How to setup stacks

[Yabai](https://github.com/koekeishiya/yabai) is a window management tool for MacOS. One of it's more recent features are stacks, which allow multiple windows to take up the same space on top of each other. Combining Yabai with keybind tools like [skhd](https://github.com/koekeishiya/skhd), one could set up shortcuts to easily create stacks. 

Here are the skhd keybinds that I use that you can paste into your own skhdrc file:

```
# Navigation (stack)
alt - tab : yabai -m window --focus stack.prev || yabai -m window --focus stack.last
shift + alt - tab : yabai -m window --focus stack.next || yabai -m window --focus stack.first

# Create stacks by moving current window in certain direction
shift + lctrl + alt - h : yabai -m window --stack west
shift + lctrl + alt - j : yabai -m window --stack south
shift + lctrl + alt - k : yabai -m window --stack north
shift + lctrl + alt - l : yabai -m window --stack east
```

There are many other keybinds that can be made along with these to create a great workflow using Yabai. Checkout the Yabai and skhd wiki to find out more.

## Customization

- Inside `lib/settings.js` are constants which can be changed to alter the size and positioning of the Überstack tiles
- There are also additional settings for a more minimalist version with no icon
- The repo is currently set up so that the tiles only appear on spaces set to the "bsp" layout with Yabai. To disable this and display Uberstack on full single stack spaces, go into `lib/command.sh` and replace the last line with just `echo $yabai;`
- The repo is also currently set up to refresh the widget using event signals from Yabai, which causes updates to the widget to lag slightly. This was done for performance reasons so the widget doesn't have to constantly update when nothing is happening. If you're happy to sacrifice some performance to make Überstack react more quickly and responsivly to window changes, you can do so by commenting out all the event listeners in `lib/command.sh` (lines that start with `yabai_path -m signal`) and by changing the `refreshFrequency` variable in `index.jsx` from `false` to a number representing how often you want the widget to refresh in milliseconds (for example `export const refreshFrequency = 100;` will cause the widget to refresh every tenth of a second)