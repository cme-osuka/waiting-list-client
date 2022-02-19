import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

/**
 * Returns a string indicating how much time has passed since a previous point in time
 * @param {Number} timestamp UNIX timestamp, in milliseconds, to compare current time to.
 * @param {Number} refreshInterval Time, in seconds, between each update of the component. Default is 30.
 * @returns {String}
 */
function useElapsedTime(timestamp, refreshInterval = 30) {
	const [start] = useState(
		dayjs(timestamp).isValid() ? dayjs(timestamp) : dayjs()
	);
	const [now, setNow] = useState(dayjs());
	useEffect(() => {
		const intervalID = setInterval(
			() => setNow(dayjs()),
			refreshInterval * 1000
		);
		return () => clearInterval(intervalID);
	}, [refreshInterval, now, setNow]);

	return start.diff(now) <= 0 ? start.from(now) : start.to(now);
}

export default useElapsedTime;
