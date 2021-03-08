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
            { id: "id", title: "ID" },
            { id: "name", title: "Name" },
            { id: "logo", title: "Logo" },
            { id: "national", title: "National" },
            { id: "country", title: "Country" },
            { id: "founded", title: "Founded" },
        ]
    })
}

const teams = [
    "Napoli"
]

request(`/teams`, {
    params: {
        search: "napoli"
    }
})
.then(data => data.response[0].team)
.then(team => writers.teams.writeRecords([team]))

request('/fixtures', {
    params: {
        team: 492,
        last: 30
    }
})
.then(data => console.log(data))

const fetch = async () => {
    const {current, limit_day} = await request("/status").response.requests


}