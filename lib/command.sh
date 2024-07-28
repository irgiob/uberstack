# let locale to properly parse special characters
export LC_ALL=en_US.UTF-8

# set paths to yabai and jq
yabai_path=$1;
jq_path=$2;
refresh_rate=$3;
only_show_on_bsp=$4;

# query windows for current space data
yabai=$($yabai_path -m query --windows --space);

# query type of space
type=$($yabai_path -m query --spaces --space | $jq_path .type);

# generate cached app icon if doesn't exist yet
$jq_path -r '.[] | (.pid|tostring) + " " + .app' <<< "$yabai" |
while IFS=" " read -r pid appName; do
	# identify the process name and its cached icon
	iconPath="uberstack/cache/$appName.png"

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
if [ $refresh_rate = 'false' ]; then
	$yabai_path -m signal --add event=space_changed action="osascript -e 'if application id \"tracesOf.Uebersicht\" is running then' -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"uberstack-index-jsx\"' -e 'end if'" label="Refresh uberstack on space change"
	$yabai_path -m signal --add event=display_changed action="osascript -e 'if application id \"tracesOf.Uebersicht\" is running then' -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"uberstack-index-jsx\"' -e 'end if'" label="Refresh uberstack on display focus change"
	$yabai_path -m signal --add event=window_focused action="osascript -e 'if application id \"tracesOf.Uebersicht\" is running then' -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"uberstack-index-jsx\"' -e 'end if'" label="Refresh uberstack when focused application changes"
	$yabai_path -m signal --add event=application_front_switched action="osascript -e 'if application id \"tracesOf.Uebersicht\" is running then' -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"uberstack-index-jsx\"' -e 'end if'" label="Refresh uberstack when front application switched application changes"
	$yabai_path -m signal --add event=window_destroyed action="osascript -e 'if application id \"tracesOf.Uebersicht\" is running then' -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"uberstack-index-jsx\"' -e 'end if'" label="Refresh uberstack when an application window is closed"
	$yabai_path -m signal --add event=window_resized action="osascript -e 'if application id \"tracesOf.Uebersicht\" is running then' -e 'tell application id \"tracesOf.Uebersicht\" to refresh widget id \"uberstack-index-jsx\"' -e 'end if'" label="Refresh uberstack when a window is resized"
fi;

# return space data
[[ $type = '"bsp"' || $only_show_on_bsp = 'false' ]] && echo $yabai;