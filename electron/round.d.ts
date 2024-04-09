interface MatchType {
    name: 'QuickMatch' | 'Ranked' | 'CustomGameLocal' | 'CustomGameOnline' | 'Standard',
    id: number
}

interface SiegeMap {
    name: 'ClubHouse' | 'KafeDostoyevsky' | 'Kanal' | 'Yacht' | 'PresidentialPlane' | 'BartlettU' | 'Coastline' | 'Tower' | 'Villa' | 'Fortress' | 'HerefordBase' | 'ThemePark' | 'Oregon' | 'House' | 'Chalet' | 'Skyscraper' | 'Border' | 'Favela' | 'Bank' | 'Outback' | 'EmeraldPlains' | 'StadiumBravo' | 'NighthavenLabs' | 'Consulate' | 'Lair';
    id: number;
}

interface GameMode {
    name: 'Bomb' | 'SecureArea' | 'Hostage',
    id: number;
}

type WinCondition = 'KilledOpponents' | 'SecuredArea' | 'DisabledDefuser' | 'DefusedBomb' | 'ExtractedHostage' | 'Time';
type TeamRole = 'Attack' | 'Defense';

interface Team {
    name: string;
    score: number;
    won: boolean;
    winCondition?: WinCondition;
    role?: TransformStreamDefaultController;
}

interface Operator {
    name: string;
    id: number;
}

interface Player {
    id: string;
    profileID?: string;
    username: string;
    teamIndex: number;
    heroName?: number;
    alliance: number;
    roleImage?: number;
    roleName?: string;
    rolePortrait?: number;
    operator: Operator;
    spawn?: string;
}

interface PlayerRoundStats {
    username: string;
    died: boolean;
    score: number;
    kills: number;
    assists: number;
    headshots: number;
    headshotPercentage: number;
    '1vX'?: number;
}

interface MatchUpdateType {
    name: string;
    id: number;
}

interface BaseActivity {
    type: MatchUpdateType;
    time: string;
    timeInSeconds: number;
    username: string;
}

interface LocateObjectiveActivity extends BaseActivity {
    type: {
        name: 'LocateObjective';
        id: 6;
    };
}

interface KillActivity extends BaseActivity {
    type: {
        name: 'Kill';
        id: 0;
    };
    target: string;
    headshot: boolean;
}

interface PlantStartActivity extends BaseActivity {
    type: {
        name: 'DefuserPlantStart';
        id: 2;
    };
}

interface PlantCompleteActivity extends BaseActivity {
    type: {
        name: 'DefuserPlantComplete';
        id: 3;
    };
}

interface DisableStartActivity extends BaseActivity {
    type: {
        name: 'DefuserDisableStart';
        id: 4;
    };
}

interface DisableCompleteActivity extends BaseActivity {
    type: {
        name: 'DefuserDisableComplete';
        id: 5;
    };
}

type MatchUpdate = LocateObjectiveActivity | KillActivity | PlantStartActivity | PlantCompleteActivity | DisableStartActivity | DisableCompleteActivity;
type MatchFeedback = MatchUpdate[];

interface Round {
    gameVersion: `Y${number}S${number}`;
    codeVersion: number;
    timestamp: string;
    matchType: MatchType;
    map: SiegeMap;
    site?: string;
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
    matchFeedback: MatchFeedback;
    stats: PlayerRoundStats[];
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
