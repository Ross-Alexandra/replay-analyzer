interface MatchType {
    name: 'QUICK_MATCH' | 'MATCHMAKING_PVP_RANKED' | 'MATCHMAKING_PVE' | 'MATCHMAKING_PVE_PARTY' | 'MATCHMAKING_PVE_LONEWOLF' | 'OPERATIONS' | 'CUSTOMGAME_PVP' | 'CUSTOMGAME_PVP_DEDICATED' | 'DEV' | 'MATCHMAKING_PVP_EVENT' | 'MATCHMAKING_PVP_NEWCOMER' | 'MATCHMAKING_PVP_UNRANKED' | 'MATCHREPLAY' | 'PLATFORM_TOURNAMENT',
    id: number
}

interface SiegeMap {
    name: 'CLUB_HOUSE' | 'BORDER' | 'KANAL' | 'SKYSCRAPER' | 'TOWER' | 'CHALET' | 'BANK' | 'OREGON' | 'KAFE_DOSTOYEVSKY' | 'VILLA' | 'COASTLINE' | 'STADIUM_BRAVO';
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
    roleName: string;
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
    roundNumber: number;
    overtimeRoundNumber: number;
    teams: Team[];
    players: Player[];
    gmSettings: number[];
    playlistCategory: number;
    matchID: string;
}

interface BaseActivity {
    type: string;
    time: string;
    timeInSeconds: number;
    username: string;
}

interface LocateObjectiveActivity extends BaseActivity {
    type: 'LOCATE_OBJECTIVE';
}

interface KillActivity extends BaseActivity {
    type: 'KILL';
    target: string;
    headshot: boolean;
}

interface PlantStartActivity extends BaseActivity {
    type: 'DEFUSER_PLANT_START';
}

interface PlantCompleteActivity extends BaseActivity {
    type: 'DEFUSER_PLANT_COMPLETE';
}

interface DisableStartActivity extends BaseActivity {
    type: 'DEFUSER_DISABLE_START';
}

interface DisableCompleteActivity extends BaseActivity {
    type: 'DEFUSER_DISABLE_COMPLETE';
}

type Activity = LocateObjectiveActivity | KillActivity | PlantStartActivity | PlantCompleteActivity | DisableStartActivity | DisableCompleteActivity;
type ActivityFeed = Activity[];

interface Round {
    header: Header;
    activityFeed: ActivityFeed;
}

interface RoundMeta {
    _id: string; // An internally used ID.
    tags: string[];
    map: string;
    matchID: string;
    roundNumber: number;
    timestamp: string;
    originalFilename: string;
}

interface MetaData {
    version: `${number}.${number}.${number}`;
    rounds: Record<string, RoundMeta>;
}

interface RoundWithMeta {
    meta: RoundMeta;
    data: Round;
}
