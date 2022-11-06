# Überstack
### The Stackline clone powered by Übersicht

<hr/>

![a demo for uberstack](demo.gif)

## What is Überstack?

Überstack is an implementation of [Adam Wagner's](https://github.com/AdamWagner) tool [Stackline](https://github.com/AdamWagner/stackline). Stackline adds visual indicators to show the windows within a [Yabai](https://github.com/koekeishiya/yabai) stack. As Wagner mentions in his project, 

> "there's no built-in UI for stacks, which makes it easy to forget about stacked windows that aren't visible or get disoriented". 

The reason Überstack exists is because Stackline requires and is powered by Hammerspoon which, while an extremely powerful tool, I personally found too cumbersome to install on my device. Überstack is an alternative (well I say alternative, but it's pretty much a clone) to Stackline that uses the popular app Übersicht instead, an app much more straightforward to install and one many Yabai users already have (due to its popular use for custom Yabai-integrated menu bars).

Überstack contains many of the same features of Stackline, except there's (currently) no smart positioning (icons always appear on the left) and no settings modifications through shell commands (instructions on changing these settings are below).

It goes without saying, but if you want a mucher higher quality version of this tool, please use and support the original implementation by Adam Wagner [here](https://github.com/AdamWagner/stackline). While a bit more complicated to set up, it's far more robust and has had much more time and effort invested into it. This version is most likely more buggy and less performant than Stackline.

## Installation

1. Ensure you've installed both [Yabai](https://github.com/koekeishiya/yabai) and [Übersicht](https://github.com/felixhageloh/uebersicht) on your device
2. Clone or download this repository into your Übersicht widget folder (when dowloading make sure to unzip to a folder)
3. Ensure the widget folder name is uberstack, as any other folder name will not work
4. That's it!

## How to setup stacks

[Yabai](https://github.com/koekeishiya/yabai) is a window management tool for MacOS. One of it's more recent features are stacks, which allow multiple windows to take up the same space on top of each other. Combining Yabai with keybind tools like [skhd](https://github.com/koekeishiya/skhd), one could set up shortcuts to easily create stacks. 

Here are the keybinds (made with skhd) that I use:

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

## Settings

Inside `lib/settings.js` are constants which can be changed to change the size and positioning of the Überstack tiles. There are also additional settings for a more minimalist version with no icon.