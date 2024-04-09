import _ from 'lodash';

const TIME_FOR_TRADE = 10; // seconds

function getPlayerKills(activities: MatchUpdate[], username: string) {
    return activities.filter(activity => activity.type.name === 'Kill' && activity.username === username).length;
}

function getPlayerHeadshots(activities: MatchUpdate[], username: string) {
    // @ts-expect-error - this type does not work any longer with the new MatchUpdate type object
    return activities.filter(activity => activity.type.name === 'Kill' && activity.username === username && activity.headshot).length;
}

function getPlayerDeaths(activities: MatchUpdate[], username: string) {
    // @ts-expect-error - this type does not work any longer with the new MatchUpdate type objec
    return activities.filter(activity => activity.type.name === 'Kill' && activity.target === username).length;
}

function getPlayerPlants(activities: MatchUpdate[], username: string) {
    return activities.filter(activity => activity.type.name === 'DefuserPlantComplete' && activity.username === username).length;
}

function getPlayerDefuses(activities: MatchUpdate[], username: string) {
    return activities.filter(activity => activity.type.name === 'DefuserDisableComplete' && activity.username === username).length;
}

function getPlayerTrades(activities: MatchUpdate[], username: string) {
    const killActivities = activities.filter(activity => activity.type.name === 'Kill');
    
    return _.chain(killActivities)
        .orderBy('timeInSeconds', 'desc')
        .reduce((acc, activity, index) => {
            // First kill can't be a trade
            if (index === 0) {
                return acc;
            }

            const previousActivity = killActivities[index - 1];
            const timeBetween = previousActivity.timeInSeconds - activity.timeInSeconds;

            // If the time between is less than 10 seconds, it's a trade
            // kill, so add it to the accumulator
            if (timeBetween <= TIME_FOR_TRADE) {
                return [...acc, activity];
            } else {
                return acc;
            }
        }, [] as MatchUpdate[])
        .filter(activity => activity.username === username)
        .value()
        .length;
}

function getPlayerWasOpeningDeath(activities: MatchUpdate[], username: string) {
    const firstKill = _.chain(activities)
        .filter(activity => activity.type.name === 'Kill')
        .first()
        .value() as KillActivity | undefined;

    return firstKill && firstKill.target === username;
}

function getPlayerGotOpeningKill(activities: MatchUpdate[], username: string) {
    const firstKill = _.chain(activities)
        .filter(activity => activity.type.name === 'Kill')
        .first()
        .value() as KillActivity | undefined;

    return firstKill && firstKill.username === username;
}

function getPlayerStatisticsForRound(round: RoundWithMeta, username: string) {
    const activityFeed = round.data.matchFeedback;

    // Get the player stats related to 
    // kills & deaths
    const kills = getPlayerKills(activityFeed, username);
    const headshots = getPlayerHeadshots(activityFeed, username);
    const trades = getPlayerTrades(activityFeed, username);
    const deaths = getPlayerDeaths(activityFeed, username);
    const survived = deaths === 0;
    const wasOpeningKill = getPlayerGotOpeningKill(activityFeed, username);
    const wasOpeningDeath = getPlayerWasOpeningDeath(activityFeed, username);

    // Get the players stats related to
    // objectives.
    const plants = getPlayerPlants(activityFeed, username);
    const defuses = getPlayerDefuses(activityFeed, username);

    // Player gets a KOST point if they
    //  - (K) Got a Kill
    //  - (O) Performed an objective
    //  - (S) Survived the round
    //  - (T) Got a trade kill
    const KOSTPointOnRound = kills > 0 || plants > 0 || defuses > 0 || survived || trades > 0;

    return {
        kills,
        deaths,
        headshots,
        defuses,
        plants,
        survived,
        trades,
        KOSTPointOnRound,
        wasOpeningKill,
        wasOpeningDeath,
    };
}

function getRoundsPlayerWasIn(rounds: RoundWithMeta[], username: string) {
    return rounds.filter(round => {
        const players = round.data.players;

        return Boolean(_.find(players, { username }));
    });
}

function getMatchesPlayerWasIn(rounds: RoundWithMeta[], username: string) {
    const playerRounds = getRoundsPlayerWasIn(rounds, username);

    return _.uniq(playerRounds.map(round => round.data.matchID));
}

export function getPlayerStatistics(rounds: RoundWithMeta[], username: string) {
    const playerStats = rounds.map(round => getPlayerStatisticsForRound(round, username));

    const totalKills = playerStats.reduce((acc, stats) => acc + stats.kills, 0);
    const totalDeaths = playerStats.reduce((acc, stats) => acc + stats.deaths, 0);
    const totalHeadshots = playerStats.reduce((acc, stats) => acc + stats.headshots, 0);
    const totalDefuses = playerStats.reduce((acc, stats) => acc + stats.defuses, 0);
    const totalPlants = playerStats.reduce((acc, stats) => acc + stats.plants, 0);
    const totalTrades = playerStats.reduce((acc, stats) => acc + stats.trades, 0);
    const totalKOSTPoints = playerStats.reduce((acc, stats) => acc + (stats.KOSTPointOnRound ? 1 : 0), 0);
    const totalOpeningKills = playerStats.reduce((acc, stats) => acc + (stats.wasOpeningKill ? 1 : 0), 0);
    const totalOpeningDeaths = playerStats.reduce((acc, stats) => acc + (stats.wasOpeningDeath ? 1 : 0), 0);

    const roundsPlayerWasIn = getRoundsPlayerWasIn(rounds, username);
    const matchesPlayerWasIn = getMatchesPlayerWasIn(roundsPlayerWasIn, username);

    const KOST = ((totalKOSTPoints / rounds.length) * 100).toFixed(1);
    const headshotPercentage = totalKills > 0 ? ((totalHeadshots / totalKills) * 100).toFixed(1) : '0';

    return {
        totalRounds: roundsPlayerWasIn.length,
        totalMatches: matchesPlayerWasIn.length,
        kills: totalKills,
        deaths: totalDeaths,
        KDRatio: totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : '∞',
        headshots: totalHeadshots,
        defuses: totalDefuses,
        plants: totalPlants,
        trades: totalTrades,
        openingKills: totalOpeningKills,
        openingDeaths: totalOpeningDeaths,
        entry: totalOpeningKills - totalOpeningDeaths,
        headshotPercentage: `${headshotPercentage}%`,
        KOST: `${KOST}%`,
    };
}
