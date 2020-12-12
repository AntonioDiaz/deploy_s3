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

  renderMatches() {
    const {teams, matches} = this.state
    return <div>Matches</div>
  }

  teamsName(teamId, teams) {
    return teams[teamId].member01 + " - " + teams[teamId].member02
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
      return <table className="table is-striped is-bordered is-hoverable is-dark center">
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