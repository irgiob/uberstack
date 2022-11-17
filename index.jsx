import { css } from "uebersicht"
import { containerMargin, shell, yabai, jq } from "./lib/settings.js"
import parseStacks from "./lib/parseStacks.js"
import StackItem from "./lib/StackItem.jsx"

export const command = `${shell} uberstack/lib/command.sh ${yabai} ${jq}`;

export const refreshFrequency = false; 

export const render = ({output, error}) => {
	if (!output) return null;
	try {
		const stacks = parseStacks(output)

		return error ? (
			<div>Something went wrong: <strong>{String(error)}</strong></div>
		) : (
			<div>
		     	{Object.keys(stacks).map((key, index) => {
		     		const stackData = JSON.parse(key)
		     		const stackContainerStyle = `${css({ 
						marginLeft: `calc(${stackData.x}px + ${containerMargin}px)`,
						marginTop: stackData.y,
						position: "absolute",
					})}`

		     		return (
		     			<div key={index} className={stackContainerStyle}>
		     				{stacks[key].sort((a,b) => a.id > b.id).map((win, index) => (
		     					<StackItem key={index} win={win}/>
		     				))}
		     			</div>
		     		)
		     	})}
	    	</div>
		)
	} catch (e) {
		return <div>Something went wrong: <strong>{String(e)}</strong></div>
	}
}