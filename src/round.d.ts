interface MatchType {
    name: 'QUICK_MATCH' | 'MATCHMAKING_PVP_RANKED' | 'MATCHMAKING_PVE' | 'MATCHMAKING_PVE_PARTY' | 'MATCHMAKING_PVE_LONEWOLF' | 'OPERATIONS' | 'CUSTOMGAME_PVP' | 'CUSTOMGAME_PVP_DEDICATED' | 'DEV' | 'MATCHMAKING_PVP_EVENT' | 'MATCHMAKING_PVP_NEWCOMER' | 'MATCHMAKING_PVP_UNRANKED' | 'MATCHREPLAY' | 'PLATFORM_TOURNAMENT',
    id: number
}

interface SiegeMap {
    name: 'CLUBHOUSE' | 'BORDER' | 'KANAL' | 'SKYSCRAPER' | 'TOWER' | 'CHALET' | 'BANK' | 'OREGON' | 'KAFE_DOSTOYEVSKY' | 'VILLA' | 'COASTLINE' | 'STADIUM_BRAVO';
    id: number;
}

interface GameMode {
    name: 'BOMB',
    id: number;
}

interface Team {
    name: string;
    score: number;
}

interface Player {
    id: string;
    profileID: string;
    username: string;
    teamIndex: number;
    heroName: number;
    alliance: number;
    roleImage: number;
    roleName: 'AZAMI';
    rolePortrait: number;
}

interface Header {
    gameVersion: `Y${number}S${number}`;
    codeVersion: number;
    timestamp: string;
    matchType: MatchType;
    map: SiegeMap;
    recordingPlayerID: string;
    recordingProfileID: string;
    additionalTags: string;
    gamemode: GameMode;
    roundsPerMatch: number;
    overtimeRoundNumber: number;
    teams: Team[];
    players: Player[];
    gmSettings: number[];
    playlistCategory: number;
    matchID: string;
}

interface LocateObjectiveActivity {
    type: 'LOCATE_OBJECTIVE';
    username: string
}

interface KillActivity {
    type: 'KILL';
    username: string;
    target: string;
    headshot: boolean;
}

type Activity = LocateObjectiveActivity | KillActivity;

interface Round {
    header: Header;
    activityFeed: ActivityFeed;
}