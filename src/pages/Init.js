import React, {Component} from 'react'
import ButtonBackToHome from '../components/ButtonBackToHome'

class TeamsList extends Component {
    state = {num_teams: this.props.num_parejas}

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            num_teams: parseInt(nextProps.num_parejas)
        })
    }

    render() {
        console.log("render numero parejas" + this.state.num_teams);
        var myArray = Array.from(Array(this.state.num_teams).keys())
        console.log(myArray.length)
        return myArray.map((e, index) => {return <div key={index}>Pareja {index}</div>})
        
    }
}

export class Init extends Component {
    state = {
        num_parejas: 10,
        parejas: []
    }

    _handleChange = (e) => {
        console.log("handleChange -> " + e.target.value);
        this.setState({num_parejas: e.target.value})
    }

    _handleSubmit = (e) => {
        e.preventDefault()
        alert('submit')
    }

    render() {
        return (
        <div>
            <h2 className='title'>Inicializa Campeonato</h2>
            <div className='SearchForm-wrapper'>
            <form onSubmit={this._handleSubmit}>
                <div className="field">
                    <div className="control">
                        <input className="input is-primary" type="number" placeholder="Primary input"
                            onChange={this._handleChange} value={this.state.num_parejas}>
                            </input>
                    </div>
                </div>     
                <div className="field">
                    <TeamsList num_parejas={this.state.num_parejas}></TeamsList>
                </div>                   
                <div className="field is-grouped">
                    <div className="control">
                        <button className="button is-link">Crear</button>
                    </div>
                    <div className="control">
                        <ButtonBackToHome></ButtonBackToHome>   
                    </div>
                </div>                           
            </form>
            </div>
            <br></br>
            
        </div>)
    }
}