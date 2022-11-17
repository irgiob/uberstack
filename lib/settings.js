// style settings
const tileGap = 10 // spacing between window and uberstack tiles (in px)
export const tileSize = 50 // size of individual tiles (in px)
export const tileSpacing = 15 // spacing between tiles (in px)
export const borderRadius = 10 // border radius of tiles (in px)
export const iconSize = 45 // size of icon (in px, must be less than tileSize)
export const pillSize = 7 // for non-icon mode, with of pill tile (in px)
export const hideIcon = false // hides icons for a more minimalistic mode

// command running settings
export const yabai = "/opt/homebrew/bin/yabai" // path to yabai executable
export const jq = "/opt/homebrew/bin/jq" // path to jq executable
export const shell = "bash" // shell of choice for running commands

// helper constant
export const containerMargin = -(hideIcon ? pillSize : tileSize) - tileGap