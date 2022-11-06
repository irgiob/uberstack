# query windows for current space data
yabai=$(yabai -m query --windows --space);

# query type of space
type=$(yabai -m query --spaces --space | jq .type);

# generate cached app icon if doesn't exist yet
jq -r '.[] | (.pid|tostring) + " " + .app' <<< "$yabai" |
while IFS=" " read -r pid appName; do
	# identify the process name and its cached icon
	iconPath="euberstack/cache/$appName.png"

	# if the app does not yet have a cached icon
	if [ ! -f "$iconPath" ]; then
		# locate icon within app package contents
		iconDir=$(ps -o comm= -p "$pid" | sed "s/MacOS.*/Resources/g");
		plist=$(ps -o comm= -p "$pid" | sed "s/MacOS.*/Info.plist/g");
		icon=$(defaults read "$plist" CFBundleIconFile);
		if [[ "$icon" != *.icns ]]; then
			icon="$icon".icns;
		fi;

		# generate png version of icon and save to cache folder
	  sips -s format png "$iconDir"/"$icon" --out "$iconPath";
	fi;
done;

# add event listeners
yabai -m signal --add event=space_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"euberstack-index-jsx\"'" label="Refresh euberstack on space change"
yabai -m signal --add event=display_changed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"euberstack-index-jsx\"'" label="Refresh euberstack on display focus change"
yabai -m signal --add event=window_focused action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"euberstack-index-jsx\"'" label="Refresh euberstack when focused application changes"
yabai -m signal --add event=application_front_switched action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"euberstack-index-jsx\"'" label="Refresh euberstack when front application switched application changes"
yabai -m signal --add event=window_destroyed action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"euberstack-index-jsx\"'" label="Refresh euberstack when an application window is closed"
yabai -m signal --add event=window_resized action="osascript -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"euberstack-index-jsx\"'" label="Refresh euberstack when a window is resized"

# return space data
type=$(yabai -m query --spaces --space | jq .type) && [ $type = '"bsp"' ] && echo $yabai;