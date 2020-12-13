import React, {Component} from 'react'

export class Dashboard extends Component {

  state = {teams: {}, matches: {}, classification: {}}

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/AntonioDiaz/deploy_s3/master/src/test.json')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const {teams, matches, classification} = data
            this.setState({teams, matches, classification})
        })
  }

  renderColumnTeams(teams) {
    return ""
  }

  renderMatches() {
    const {teams, matches} = this.state
    if (Array.isArray(teams)) {
      return (
        <div className="table-container">
          <table className="table is-striped is-bordered is-hoverable is-dark center  is-family-monospace is-size-7-mobile">
          <thead>
            <tr key={-1}>
              <th>-</th>
              {teams.map((e, index) => <th>{this.formatTeamName(e)}</th> )}
            </tr>
          </thead>
          <tbody>
              {matches.map((matchesSubArray, index) => <tr key={index}>
              <td key={-1}>{this.teamsName(index, teams)}</td>
                {matchesSubArray.map((match, subIndex)=>{ 
                  return <td key={subIndex}>{match}</td>
                })}
              </tr> )}
          </tbody>
          </table>
        </div>)
    } else {
      return null
    }
  }

  teamsName(teamId, teams) {
    return this.formatTeamName(teams[teamId])
  }

  formatTeamName(team) {
    return team.member01 + " - " + team.member02
  }

  renderClassificationItem(classification, teams) {
    let table = classification.map((e, index) =>
    <tr key={index}>
      <td>{this.teamsName(e.id, teams)}</td>
      <td>{e.played}</td>
      <td>{e.wins}</td>      
      <td>{e.lost}</td>            
      <td>{e.points_favor}</td>            
      <td>{e.points_again}</td>            
    </tr>
    )
    return table
  }

  renderClassification() {
    const {teams, classification } = this.state
    if (Array.isArray(classification)) {
      return (
        <div className="table-container">
        <table className="table is-striped is-bordered is-hoverable is-dark center  is-family-monospace is-size-7-mobile">
        <thead>
          <tr key={-1}>
            <th>Pareja</th>
            <th>Partidos Jugados</th>
            <th>Partidos Ganados</th>
            <th>Partidos Perdidos</th>
            <th>Puntos a favor</th>
            <th>Puntos en contra</th>
          </tr>
        </thead>
        <tbody>
          {this.renderClassificationItem(classification, teams)}
        </tbody>
        </table>
        </div>)
    } else {
      return <div></div>
    }
  }

  render() {
    return (
      <div className="container">
        <div className="notification is-dark">
          <h3 className='title'>Partidos</h3>
            {this.renderMatches()}
        </div>
          <br></br>
          <div className="notification is-dark">
            <h3 className='title'>Clasificación</h3>
            <div className="box has-text-centered">
              {this.renderClassification()}
              </div> 
          </div>
      </div>
    )
  }
}