import React, {Component} from 'react'

export class Dashboard extends Component {

  state = {teams: {}, matches: {}, classification: {}}

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/AntonioDiaz/deploy_s3/master/src/pages/Init.js')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            this.setState({data})
        })
  }

  _renderMatches() {
    const {teams, classification, } = this.state
    console.log("matches " + this.state);
    console.log("matches" + this.state.teams);
    return <div>digo</div>
  }

  render() {
    return (
      <div>
        <h3 className='title'>marcador</h3>
        {this._renderMatches()}
        <br></br>
        <h3 className='title'>clasificacion</h3>
      </div>
    )
  }
}