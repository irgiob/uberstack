import { css, run, React } from "uebersicht"
import { hideIcon, tileSize, tileSpacing, borderRadius, iconSize, pillSize } from "./settings"

const StackItem = ({key, win}) => {
	const [hovered, setHovered] = React.useState(false)

	const stackItemStyle = `
		${css({ 
			width: (hideIcon ? pillSize : tileSize) + "px",
			height: tileSize + "px",
			marginBottom: tileSpacing + "px",
			borderRadius: borderRadius + "px",
			background: 'white',
		})} 
		${win['has-focus'] ? css({ opacity: 1 }) : css({ opacity: 0.25 })}
		${hovered && !win['has-focus'] ? css({opacity: 0.5}) : css({})}
	`

	const stackItemImageStyle = `${css({ 
		width: iconSize + "px",
		height: iconSize + "px",
		marginLeft: `calc((${tileSize}px - ${iconSize}px)/2)`,
		marginTop: `calc((${tileSize}px - ${iconSize}px)/2)`,
	})}`
	
	return (
		<div 
			key={key}
			onClick={() => run(`yabai -m window --focus ${win.id}`)}
			onMouseLeave={() => setHovered(false)} 
			onMouseEnter={() => setHovered(true)}
			className={stackItemStyle}
		>	
			{!hideIcon && <img 
				src={`euberstack/cache/${win.app}.png`} 
				className={stackItemImageStyle}
			/>}
		</div>
	)
}

export default StackItem