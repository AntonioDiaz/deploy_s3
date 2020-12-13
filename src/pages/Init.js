import React, {Component} from 'react'
import ButtonBackToHome from '../components/ButtonBackToHome'

class TeamsList extends Component {
    state = {num_teams: this.props.num_parejas}

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            num_teams: parseInt(nextProps.num_parejas===""?0:nextProps.num_parejas)
        })
    }

    render() {
        console.log("render numero parejas" + this.state.num_teams);
        if (this.state.num_teams==null || this.state.num_teams===0)
            return ""
        var myArray = Array.from(Array(this.state.num_teams).keys())
        return myArray.map((e, index) => {
            return (
                <div key={index}>
                    Pareja {index +1} 
                    <div className="control">
                        <input className="input is-primary" type="text" placeholder="componente01"
                            value={this.state.num_parejas} name="member">
                            </input>
                        <input className="input is-primary" type="text" placeholder="componente02"
                            value={this.state.num_parejas} name="member">
                            </input>                            
                    </div>
                </div>)
        })
        
    }
}

export class Init extends Component {
    state = {
        num_parejas: 5,
        parejas: []
    }

    _handleChange = (e) => {
        console.log("handleChange -> " + e.target.value);
        this.setState({num_parejas: e.target.value})
    }

    _handleSubmit = (e) => {
        e.preventDefault()
        let namesList = Array.from(document.getElementsByName("member")).map(x => x.value).filter(x=>x!=="")
        if (namesList.length!==this.state.num_parejas*2) {
            alert ("faltan nombres")
            return
        }

        alert('submit ')
    }

    render() {
        return (
        <div>
            <h2 className='title'>Crear Campeonato</h2>
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