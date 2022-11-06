import { css, run, React } from "uebersicht"

const hideIcon = false
const tileSize = "50px"
const tileSpacing = "15px"
const tileGap = "10px"
const borderRadius = "10px"
const iconSize = "45px"
const pillSize = "7px"

const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};


export const command = `
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
	yabai -m signal --add event=space_changed action="osascript -e 'tell application id \\\"tracesOf.Uebersicht\\\" to refresh widget id \\\"euberstack-index-jsx\\\"'" label="Refresh euberstack on space change"
	yabai -m signal --add event=display_changed action="osascript -e 'tell application id \\\"tracesOf.Uebersicht\\\" to refresh widget id \\\"euberstack-index-jsx\\\"'" label="Refresh euberstack on display focus change"
	yabai -m signal --add event=window_focused action="osascript -e 'tell application id \\\"tracesOf.Uebersicht\\\" to refresh widget id \\\"euberstack-index-jsx\\\"'" label="Refresh euberstack when focused application changes"
	yabai -m signal --add event=application_front_switched action="osascript -e 'tell application id \\\"tracesOf.Uebersicht\\\" to refresh widget id \\\"euberstack-index-jsx\\\"'" label="Refresh euberstack when front application switched application changes"
	yabai -m signal --add event=window_destroyed action="osascript -e 'tell application id \\\"tracesOf.Uebersicht\\\" to refresh widget id \\\"euberstack-index-jsx\\\"'" label="Refresh euberstack when an application window is closed"
	yabai -m signal --add event=window_resized action="osascript -e 'tell application id \\\"tracesOf.Uebersicht\\\" to refresh widget id \\\"euberstack-index-jsx\\\"'" label="Refresh euberstack when a window is resized"

	# return space data
	type=\$(yabai -m query --spaces --space | jq .type) && [ \$type = '\"bsp\"' ] && echo $yabai;
`;

export const refreshFrequency = false; 

const StackItem = ({key, win, hideIcon}) => {
	const [hovered, setHovered] = React.useState(false)
	return (
		<div 
			key={key}
			onClick={() => run(`yabai -m window --focus ${win.id}`)}
			onMouseLeave={() => setHovered(false)} 
			onMouseEnter={() => setHovered(true)}
			className={`
				${css({ 
					width: hideIcon ? pillSize : tileSize,
					height: tileSize,
					marginBottom: tileSpacing,
					borderRadius: borderRadius,
					background: 'white',
				})} 
				${win['has-focus'] ? css({ opacity: 1 }) : css({ opacity: 0.25 })}
				${hovered && !win['has-focus'] ? css({opacity: 0.5}) : css({})}
			`}
		>	
			{!hideIcon && <img 
				src={`euberstack/cache/${win.app}.png`} 
				className={`${css({ 
					width: iconSize,
					height: iconSize,
					marginLeft: `calc((${tileSize} - ${iconSize})/2)`,
					marginTop: `calc((${tileSize} - ${iconSize})/2)`,
				})}`}
			/>}
		</div>
	)
}

export const render = ({output, error}) => {
	if (!output) return null;
	try {
		// get all windows in current space grouped by stack
		const data = groupBy(
			JSON.parse(output)
				.filter(x => x['is-minimized'] == false && x.frame.w != 1)
				.map(x => ({ ...x, stack: JSON.stringify(x.frame) })),
			'stack'
		)
		
		// filter out all stacks of one
		const stacks = Object.keys(data)
	    .filter((key) => data[key].length > 1)
	    .reduce((obj, key) => {
	        return Object.assign(obj, {
	          [key]: data[key]
	        })
  	}, {})

		return error ? (
			<div>Something went wrong: <strong>{String(error)}</strong></div>
		) : (
			<div>
	     	{Object.keys(stacks).map((key, index) => {
	     		const stackData = JSON.parse(key)
	     		return <div
	     			key={index}
	     			className={`${css({ 
	     				marginLeft: `calc(${stackData.x}px - ${hideIcon ? pillSize : tileSize} - ${tileGap})`,
	     				marginTop: stackData.y,
	     				position: "absolute",
	     			})}`}
	     		>
	     			{stacks[key]
	     				.filter((x) => x['is-visible'])
	     				.sort((a,b) => a.id > b.id)
	     				.map((win, index) => <StackItem key={index} win={win} hideIcon={hideIcon}/>)
	     			}
	     		</div>
	     	})}
	    </div>
		)
	} catch (e) {
		return null
	}
}