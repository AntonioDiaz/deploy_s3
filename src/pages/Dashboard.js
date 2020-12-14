import React, {Component} from 'react'

export class Dashboard extends Component {

  state = {teams: {}, matches: {}, classification: {}}

  componentDidMount() {
    fetch('https://campeonato-mus-json.s3.eu-west-3.amazonaws.com/mus.json')
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
      if (newScore==null || (newScore!=="-" && !newScore.match(/^\d-\d$/))) {
        alert("formato incorrecto")
      } else {
        let score01 = ""
        let score02 = ""
        if (newScore !== "-") {
          score01 = newScore.split("-")[0]
          score02 = newScore.split("-")[1]
        }
        let url = `https://zmq6ovxgw7.execute-api.eu-west-3.amazonaws.com/2020/score?team01=${row}&team02=${column}&score01=${score01}&score02=${score02}`
        fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data)
          alert("Resultado actualizado")
          window.location.reload()
        })
        .catch((error) => {
          console.error('Error:', error)
        });        
      }
    }
  }

  renderMatches() {
    const {teams, matches} = this.state
    console.log("teams -->" + teams);
    if (Array.isArray(teams)) {
      return (
        <div className="table-container">
          <table className="table is-striped is-bordered is-hoverable is-dark center is-family-monospace is-size-7-mobile">
          <thead>
            <tr key={-1}>
              <th>&nbsp;</th>
              {teams.map((e, index) => <th key={index}>{this.formatTeamName(e)}</th> )}
            </tr>
          </thead>
          <tbody>
              {matches.map((matchesSubArray, index) => <tr key={index}>
              <td key={-1} className="has-text-weight-bold">{this.teamsName(index, teams)}</td>
                {matchesSubArray.map((match, subIndex)=>{ 
                  if (index<subIndex)
                    return (
                      <td className="is-warning" key={subIndex} onDoubleClick={()=>this.updateMatchScore(index, subIndex, teams)}>
                        {match}
                      </td>)
                  return (
                    <td key={subIndex}>
                      -
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
      <td className="has-text-weight-bold">{this.teamsName(e.id, teams)}</td>
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
            <th>&nbsp;</th>
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
         <div className="notification is-warning">
            <h2 className="title is-3">XXI Campeonato de Mus - Memorial "Los Sordos"</h2>
         </div>
        <div className="notification is-dark">
          <h2 className='subtitle is-3'>Partidos</h2>
            {this.renderMatches()}
        </div>
          <div className="notification is-dark">
            <h2 className='subtitle is-3'>Clasificación</h2>
            <div className="box has-text-centered">
              {this.renderClassification()}
              </div> 
          </div>
      </div>
    )
  }
}