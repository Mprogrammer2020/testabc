import clsx from 'clsx'
import React from 'react'

export const Spinner = (props: React.SVGProps<SVGSVGElement>) => {
	const { className, ...rest } = props

	return (
		<svg
			className={clsx(className, 'animate-spin')}
			{...rest}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24">
			<circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
			<path
				className="opacity-70"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
	)
}
