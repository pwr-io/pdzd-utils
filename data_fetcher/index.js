const axios = require('axios')
const csvWriter = require('csv-writer')

const BASE_URL = 'https://v3.football.api-sports.io'
const API_KEY = 'e7b688ca50e00ec74d5c22ec9e6aca79'

const request = (path, params) => {
    return axios.get(`${BASE_URL}${path}`, {
        headers: {
            'X-RapidAPI-Key': API_KEY
        },
        ...params
    }).then(res => res.data)
}

const writers = {
    teams: csvWriter.createObjectCsvWriter({
        path: 'teams.csv',
        header: [
            { id: "id", title: "id" },
            { id: "name", title: "name" },
            { id: "logo", title: "logo" },
            { id: "national", title: "national" },
            { id: "country", title: "country" },
            { id: "founded", title: "founded" },
        ]
    }),
    fixtures: csvWriter.createObjectCsvWriter({
        path: 'fixtures.csv',
        header: [
            { id: "fixture_id", title: "fixture_id" },
            { id: "referee", title: "referee" },
            { id: "timezone", title: "timezone" },
            { id: "date", title: "date" },
            { id: "timestamp", title: "timestamp" },
            { id: "league_id", title: "league_id" },
            { id: "league_name", title: "league_name" },
            { id: "venue_city", title: "venue_city" },
            { id: "home_team_id", title: "home_team_id" },
            { id: "home_team_name", title: "home_team_name" },
            { id: "home_team_goals_halftime", title: "home_team_goals_halftime" },
            { id: "home_team_goals_fulltime", title: "home_team_goals_fulltime" },
            { id: "away_team_id", title: "away_team_id" },
            { id: "away_team_name", title: "away_team_name" },
            { id: "away_team_goals_halftime", title: "away_team_goals_halftime" },
            { id: "away_team_goals_fulltime", title: "away_team_goals_fulltime" },
        ]
    }),
    player_stats: csvWriter.createObjectCsvWriter({
        path: 'player_stats.csv',
        header: [
            { id: "fixture_id", title: "fixture_id" },
            { id: "team_id", title: "team_id" },
            { id: "team_name", title: "team_name" },
            { id: "player_id", title: "player_id" },
            { id: "player_name", title: "player_name" },
            { id: "minutes", title: "minutes" },
            { id: "number", title: "number" },
            { id: "position", title: "position" },
            { id: "rating", title: "rating" },
            { id: "captain", title: "captain" },
            { id: "substitute", title: "substitute" },
            { id: "offsides", title: "offsides" },
            { id: "shots_total", title: "shots_total" },
            { id: "shots_on", title: "shots_on" },
            { id: "goals", title: "goals" },
            { id: "goals_conceded", title: "goals_conceded" },
            { id: "assists", title: "assists" },
            { id: "saves", title: "saves" },
            { id: "passes_total", title: "passes_total" },
            { id: "passes_key", title: "passes_key" },
            { id: "passes_accuracy", title: "passes_accuracy" },
            { id: "tackles_total", title: "tackles_total" },
            { id: "blocks", title: "blocks" },
            { id: "interceptions", title: "interceptions" },
            { id: "duels_total", title: "duels_total" },
            { id: "duels_won", title: "duels_won" },
            { id: "dribbles_attempts", title: "dribbles_attempts" },
            { id: "dribbles_success", title: "dribbles_success" },
            { id: "dribbles_past", title: "dribbles_past" },
            { id: "fouls_drawn", title: "fouls_drawn" },
            { id: "fouls_committed", title: "fouls_committed" },
            { id: "cards_yellow", title: "cards_yellow" },
            { id: "cards_red", title: "cards_red" },
            { id: "penalty_won", title: "penalty_won" },
            { id: "penalty_committed", title: "penalty_committed" },
            { id: "penalty_scored", title: "penalty_scored" },
            { id: "penalty_missed", title: "penalty_missed" },
            { id: "penalty_saved", title: "penalty_saved" },
        ]
    }),
    formations: csvWriter.createObjectCsvWriter({
        path: 'formations.csv',
        header: [
            { id: "fixture_id", title: "fixture_id" },
            { id: "home_team_id", title: "home_team_id" },
            { id: "home_team_name", title: "home_team_name" },
            { id: "home_team_formation", title: "home_team_formation" },
            { id: "away_team_id", title: "away_team_id" },
            { id: "away_team_name", title: "away_team_name" },
            { id: "away_team_formation", title: "away_team_formation" },
        ]
    })
}

const mappers = {
    fixtures: data => data.response.map(entry => {
        const { fixture, league, teams, score } = entry
        return {
            fixture_id: fixture.id,
            referee: fixture.referee,
            timezone: fixture.timezone,
            date: fixture.date,
            timestamp: fixture.timestamp,
            league_id: league.id,
            league_name: league.name,
            venue_city: fixture.venue.city,
            home_team_id: teams.home.id,
            home_team_name: teams.home.name,
            home_team_goals_halftime: score.halftime.home,
            home_team_goals_fulltime: score.fulltime.home,
            away_team_id: teams.away.id,
            away_team_name: teams.away.name,
            away_team_goals_halftime: score.halftime.away,
            away_team_goals_fulltime: score.fulltime.away,
        }
    }),
    player_stats: data => {
        const { parameters, response } = data
        return response.flatMap(team_stats => {
            const { team, players } = team_stats
            return players.map(entry => {
                const { player, statistics } = entry
                const statistic = statistics[0]
                return {
                    fixture_id: parameters.fixture,
                    team_id: team.id,
                    team_name: team.name,
                    player_id: player.id,
                    player_name: player.name,
                    minutes: statistic.games.minutes,
                    number: statistic.games.number,
                    position: statistic.games.position,
                    rating: statistic.games.rating,
                    captain: statistic.games.captain,
                    substitute: statistic.games.substitute,
                    offsides: statistic.offsides,
                    shots_total: statistic.shots.total,
                    shots_on: statistic.shots.on,
                    goals: statistic.goals.total,
                    goals_conceded: statistic.goals.conceded,
                    assists: statistic.goals.assists,
                    saves: statistic.goals.saves,
                    passes_total: statistic.passes.total,
                    passes_key: statistic.passes.key,
                    passes_accuracy: statistic.passes.accuracy,
                    tackles_total: statistic.tackles.total,
                    blocks: statistic.tackles.blocks,
                    interceptions: statistic.tackles.interceptions,
                    duels_total: statistic.duels.total,
                    duels_won: statistic.duels.won,
                    dribbles_attempts: statistic.dribbles.attempts,
                    dribbles_success: statistic.dribbles.success,
                    dribbles_past: statistic.dribbles.past,
                    fouls_drawn: statistic.fouls.drawn,
                    fouls_committed: statistic.fouls.committed,
                    cards_yellow: statistic.cards.yellow,
                    cards_red: statistic.cards.red,
                    penalty_won: statistic.penalty.won,
                    penalty_committed: statistic.penalty.committed,
                    penalty_scored: statistic.penalty.scored,
                    penalty_missed: statistic.penalty.missed,
                    penalty_saved: statistic.penalty.saved
                }
            })
        })
    },
    formations: data => {
        const { parameters, response } = data
        console.log(data)
        const [first_team, second_team] = response
        console.log(first_team, second_team)
        return {
            fixture_id: parameters.fixture,
            home_team_id: first_team.team.id,
            home_team_name: first_team.team.name,
            home_team_formation: first_team.formation,
            away_team_id: second_team.team.id,
            away_team_name: second_team.team.name,
            away_team_formation: second_team.formation,
        }
    }
}

const leagues = [
    {
        id: 78,
        name: 'Bundesliga 1'
    }
]

const season = 2020
const fixtures_to_fetch = 1

const main = () => {
    leagues.forEach(async league => {
        const { id, name } = league
        console.log(`Fetching last ${fixtures_to_fetch} from ${name}`)
    
        console.log('Fetching fixtures')
        const fixtureResponse = await request('/fixtures', {
            params: {
                league: id,
                season: season,
                last: fixtures_to_fetch
            }
        })
        const fixtureMapped = mappers.fixtures(fixtureResponse)
        writers.fixtures.writeRecords(fixtureMapped)
    
        fixtureMapped.forEach(async ({ fixture_id }) => {
            console.log(`Fetching player_stats for fixture ${fixture_id}`)
            const playerStatsResponse = await request('/fixtures/players', {
                params: {
                    fixture: fixture_id
                }
            })
            const playerStatsMapped = mappers.player_stats(playerStatsResponse)
            writers.player_stats.writeRecords(playerStatsMapped)
    
            console.log(`Fetching formations for fixture ${fixture_id}`)
            const formationsResponse = await request('/fixtures/lineups', {
                params: {
                    fixture: fixture_id
                }
            })
            const formationsMapped = mappers.formations(formationsResponse)
            writers.formations.writeRecords(formationsMapped)
        })
    
    })
}

const formationsWriterTest = () => {
    const formationMapped = {
        fixture_id: '587391',
        home_team_id: 188,
        home_team_name: 'Arminia Bielefeld',
        home_team_formation: '4-2-3-1',
        away_team_id: 182,
        away_team_name: 'Union Berlin',
        away_team_formation: '4-4-2'
      }
    writers.formations.writeRecords(formationMapped)
}

formationsWriterTest()