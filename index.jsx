import { css } from "uebersicht"

const tileSize = "50px"
const tileSpacing = "15px"
const tileGap = "10px"
const borderRadius = "10px"
const iconSize = "45px"

const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};


export const command = `
	# query windows for current space and return them
	yabai=$(yabai -m query --windows --space);
	
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

	# return space data
	echo $yabai;
`;

export const refreshFrequency = 1000; 

export const render = ({output, error}) => {
	//return <p>{output}</p>

	// get all windows in current space grouped by stack
	const data = groupBy(JSON.parse(output).map(x => ({ ...x, stack: JSON.stringify(x.frame) })), 'stack')
	
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
	     				marginLeft: stackData.x, //`calc(${stackData.x}px - ${tileSize} - ${tileGap})`,
	     				marginTop: stackData.y
	     			})}`}
	     		>
	     			{stacks[key].sort((a,b) => a.id > b.id).map((win, index) => {
	     				return <div 
	     					key={index}
	     					className={`${css({ 
			     				width: tileSize,
			     				height: tileSize,
			     				marginBottom: tileSpacing,
			     				borderRadius: borderRadius,
			     				background: 'white',
			     			})} ${win['has-focus'] ? css({ opacity: 1 }) : css({ opacity: 0.25 })}`}
	     				>	
	     					<img 
	     						src={`euberstack/cache/${win.app}.png`} 
	     						className={`${css({ 
				     				width: iconSize,
				     				height: iconSize,
				     				marginLeft: `calc((${tileSize} - ${iconSize})/2)`,
				     				marginTop: `calc((${tileSize} - ${iconSize})/2)`,
				     			})}`}
	     					/>
	     				</div>
	     			})}
	     		</div>
	     	})}
	    </div>
	)
}