import React, { useEffect, useState } from 'react';

function ProgressBar({ TIMER }) {
    const [remainTime, setRemainTime] = useState(TIMER)

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('interval');
            setRemainTime(prev => prev - 10)
        }, 10)
        return () => clearInterval(interval)
    }, [])

    return <progress value={remainTime} max={TIMER} />
}

export default ProgressBar;