// style settings
const tileGap = 10 // spacing between window and uberstack tiles (in px)
export const tileSize = 50 // size of individual tiles (in px)
export const tileSpacing = 15 // spacing between tiles (in px)
export const borderRadius = 10 // border radius of tiles (in px)
export const iconSize = 45 // size of icon (in px, must be less than tileSize)
export const pillSize = 7 // for non-icon mode, with of pill tile (in px)
export const hideIcon = false // hides icons for a more minimalistic mode
export const onlyShowOnBSP = true // only shows tiles on spaces with BSP layout

// command running settings
export const yabai = "/opt/homebrew/bin/yabai" // path to yabai executable
export const jq = "/opt/homebrew/bin/jq" // path to jq executable
export const shell = "bash" // shell of choice for running commands

// how often to refresh widget in ms
// if false the widget will instead use event signals from yabai to refresh
// setting to false will cause slight lag in updates but better performance
export const refreshRate = false

// helper constant (do not need to change)
export const containerMargin = -(hideIcon ? pillSize : tileSize) - tileGap