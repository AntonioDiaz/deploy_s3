import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ButtonBackToHome extends Component {
    render() {
        return (                
        <Link 
            className='button is-warning'
            to="/">
                volver a la portada
        </Link>      
        )
    }
}