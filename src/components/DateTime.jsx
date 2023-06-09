import React, { useEffect, useState } from "react";

const DateTime = ({ timezone }) => {
	var [date, setDate] = useState(new Date());

	useEffect(() => {
		var timer = setInterval(() => setDate(new Date()), 1000);
		return function cleanup() {
			clearInterval(timer);
		};
	});

	return (
		<div>
			<div className="date" id="date">
				{date.toLocaleTimeString([], {
					timeZone: timezone,
					hour: "numeric",
					minute: "2-digit",
				})}
				,{" "}
				{date.toLocaleDateString([], {
					weekday: "long",
					month: "short",
					day: "numeric",
				})}
			</div>
		</div>
	);
};

export default DateTime;
