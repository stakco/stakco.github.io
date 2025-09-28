class GameDataManager {
    constructor() {
        this.storageKey = 'stakco_game_data';
    }

    // Load all game data or initialize empty structure
    loadAllGameData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error loading game data:', e);
            return {};
        }
    }

    // Save all game data
    saveAllGameData(gameData) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(gameData));
            console.log('Game data saved successfully');
        } catch (e) {
            console.error('Error saving game data:', e);
        }
    }

    // Load attempts for a specific date
    loadAttempts(dateStr) {
        console.log(`Loading attempts for date: ${dateStr}`);
        const allData = this.loadAllGameData();
        const dayData = allData[dateStr];
        
        if (dayData && dayData.attempts && dayData.attempts.length > 0) {
            const latestAttempt = dayData.attempts[dayData.attempts.length - 1];
            if (latestAttempt.solved) {
                console.log(`Puzzle already solved today with time: ${latestAttempt.time}`);
                return {
                    solved: true,
                    time: latestAttempt.time,
                    attemptCount: dayData.attempts.length
                };
            }
        }
        
        return {
            solved: false,
            time: null,
            attemptCount: dayData ? dayData.attempts.length : 0
        };
    }

    // Save a new attempt
    saveAttempt(dateStr, solved, time) {
        const allData = this.loadAllGameData();
        
        // Initialize date if it doesn't exist
        if (!allData[dateStr]) {
            allData[dateStr] = {
                attempts: []
            };
        }
        
        const newAttempt = {
            timestamp: new Date().toISOString(),
            solved: solved,
            time: time,
            timeInSeconds: this.timeToSeconds(time)
        };
        
        allData[dateStr].attempts.push(newAttempt);
        
        this.saveAllGameData(allData);
        console.log('New attempt saved:', newAttempt);
    }

    // Convert time string (MM:SS) to seconds for easy comparison
    timeToSeconds(timeStr) {
        if (!timeStr || timeStr === "00:00") return 0;
        const [minutes, seconds] = timeStr.split(':').map(Number);
        return minutes * 60 + seconds;
    }

    // Convert seconds back to MM:SS format
    secondsToTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Get previous day's data (finds the most recent day with data)
    getPreviousDayData(currentDateStr) {
        const allData = this.loadAllGameData();
        const dates = Object.keys(allData).sort().reverse();
        
        for (const date of dates) {
            if (date < currentDateStr && allData[date].attempts.length > 0) {
                return {
                    date: date,
                    attempts: allData[date].attempts
                };
            }
        }
        return null;
    }

    // Get the best (fastest) solved attempt for a specific date
    getBestAttemptForDate(dateStr) {
        const allData = this.loadAllGameData();
        const dayData = allData[dateStr];
        
        if (!dayData || !dayData.attempts) return null;
        
        const solvedAttempts = dayData.attempts.filter(attempt => attempt.solved);
        if (solvedAttempts.length === 0) return null;
        
        return solvedAttempts.reduce((best, current) => {
            return current.timeInSeconds < best.timeInSeconds ? current : best;
        });
    }

    // Generate performance comparison text
    generatePerformanceText(dateStr, currentTime) {
        const allData = this.loadAllGameData();
        const todayData = allData[dateStr];
        const currentTimeInSeconds = this.timeToSeconds(currentTime);
        
        if (todayData && todayData.attempts.length === 1) { // ensures it's the first attempt
            return "1st attempt today";
        }
        
        const attemptNumber = todayData.attempts.length;
        let performanceText = `${this.getOrdinal(attemptNumber)} attempt today`;
        
        // Compare with previous attempt today
        if (todayData.attempts.length > 1) { // ensure there's a previous attempt
            const lastAttempt = todayData.attempts[todayData.attempts.length - 2];
            if (lastAttempt.solved) {
                const timeDiff = currentTimeInSeconds - lastAttempt.timeInSeconds;
                if (timeDiff > 0) {
                    performanceText += `, ${timeDiff} seconds slower than last attempt today`;
                } else if (timeDiff < 0) {
                    performanceText += `, ${Math.abs(timeDiff)} seconds faster than last attempt today`;
                } else {
                    performanceText += `, same time as last attempt`;
                }
                return performanceText;
            }
        }
        
        // Compare with previous day if no solved attempts today yet
        const previousDay = this.getPreviousDayData(dateStr);
        if (previousDay) {
            const previousBest = this.getBestAttemptForDate(previousDay.date);
            if (previousBest) {
                const timeDiff = currentTimeInSeconds - previousBest.timeInSeconds;
                if (timeDiff > 0) {
                    performanceText += `, ${timeDiff} seconds slower than best from ${previousDay.date}`;
                } else if (timeDiff < 0) {
                    performanceText += `, ${Math.abs(timeDiff)} seconds faster than best from ${previousDay.date}`;
                } else {
                    performanceText += `, same time as best from ${previousDay.date}`;
                }
            }
        }
        
        return performanceText;
    }

    // Helper method to get ordinal numbers (1st, 2nd, 3rd, etc.)
    getOrdinal(n) {
        const suffixes = ["th", "st", "nd", "rd"];
        const value = n % 100;
        return n + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
    }

    // Get statistics for a specific date
    getDateStats(dateStr) {
        const allData = this.loadAllGameData();
        const dayData = allData[dateStr];
        
        if (!dayData || !dayData.attempts) {
            return {
                totalAttempts: 0,
                solvedAttempts: 0,
                bestTime: null,
                averageTime: null
            };
        }
        
        const attempts = dayData.attempts;
        const solvedAttempts = attempts.filter(a => a.solved);
        
        let bestTime = null;
        let averageTime = null;
        
        if (solvedAttempts.length > 0) {
            const times = solvedAttempts.map(a => a.timeInSeconds);
            bestTime = Math.min(...times);
            averageTime = Math.round(times.reduce((sum, time) => sum + time, 0) / times.length);
        }
        
        return {
            totalAttempts: attempts.length,
            solvedAttempts: solvedAttempts.length,
            bestTime: bestTime ? this.secondsToTime(bestTime) : null,
            averageTime: averageTime ? this.secondsToTime(averageTime) : null
        };
    }

    // Get overall statistics across all dates
    getOverallStats() {
        const allData = this.loadAllGameData();
        const dates = Object.keys(allData);
        
        let totalAttempts = 0;
        let totalSolved = 0;
        let allSolvedTimes = [];
        
        dates.forEach(date => {
            const dayData = allData[date];
            if (dayData && dayData.attempts) {
                totalAttempts += dayData.attempts.length;
                const solvedAttempts = dayData.attempts.filter(a => a.solved);
                totalSolved += solvedAttempts.length;
                allSolvedTimes.push(...solvedAttempts.map(a => a.timeInSeconds));
            }
        });
        
        let bestOverallTime = null;
        let averageOverallTime = null;
        
        if (allSolvedTimes.length > 0) {
            bestOverallTime = Math.min(...allSolvedTimes);
            averageOverallTime = Math.round(allSolvedTimes.reduce((sum, time) => sum + time, 0) / allSolvedTimes.length);
        }
        
        return {
            totalDays: dates.length,
            totalAttempts: totalAttempts,
            totalSolved: totalSolved,
            successRate: totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 0,
            bestTime: bestOverallTime ? this.secondsToTime(bestOverallTime) : null,
            averageTime: averageOverallTime ? this.secondsToTime(averageOverallTime) : null
        };
    }
}

// Export for ES6 modules and CommonJS
if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = GameDataManager;
} else if (typeof exports !== 'undefined') {
    // ES6 modules fallback
    exports.GameDataManager = GameDataManager;
}