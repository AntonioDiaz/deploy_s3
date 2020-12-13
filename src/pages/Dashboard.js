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

  updateMatchScore(row, column, teams) {
    //validations
    if (row<column) {
      let team01Str = this.teamsName(row, teams)
      let team02Str = this.teamsName(column, teams)
      let msg = `Resultado del partido entre \n[${team01Str} y ${team02Str}]`
      var newScore = prompt(msg, "-")
      console.log("newScore " + newScore)
      if (newScore==null || !newScore.match(/^\d-\d$/)) {
        alert("formato incorrercto")
      } else {
        let score01 = newScore.split("-")[0]
        let score02 = newScore.split("-")[1]
        let url = `https://zmq6ovxgw7.execute-api.eu-west-3.amazonaws.com/2020/score?team01=${row}&team02=${column}&score01=${score01}&score02=${score02}`
        fetch(url, {
          method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          alert("Resultado actualizado")
        })
        .catch((error) => {
          console.error('Error:', error);
        });        
      }
    }
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
              {teams.map((e, index) => <th key={index}>{this.formatTeamName(e)}</th> )}
            </tr>
          </thead>
          <tbody>
              {matches.map((matchesSubArray, index) => <tr key={index}>
              <td key={-1}>{this.teamsName(index, teams)}</td>
                {matchesSubArray.map((match, subIndex)=>{ 
                  return (
                    <td key={subIndex} onDoubleClick={()=>this.updateMatchScore(index, subIndex, teams)}>
                      {match}
                    </td>)
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