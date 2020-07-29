import React, { Component } from 'react'

import UserService from '../../../service/UserService'

import EditProfile from './profile-edit'

import './profile.css'

import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import { Link } from 'react-router-dom'


class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.loggedInUser._id || '',
            name: this.props.loggedInUser.name || '',
            username: this.props.loggedInUser.username || '',
            email: this.props.loggedInUser.email || '',
            avatar: this.props.loggedInUser.avatar || '',
            location: this.props.loggedInUser.location || '',
            contact: this.props.loggedInUser.contact || '',
            showModal: false,
           
        }
        this.userService = new UserService()
    }
    componentDidMount = () => this.updateProfile()

    updateProfile = () => {
        this.userService
            .getOneProfile(this.state.id)
            .then(response => this.setState({ user: response.data }))
            .catch(err => console.log(err))
    }

    handleModal = (status, id) => this.setState({ showModal: status, user: id }) 

    handleProfileSubmit = () => {
        this.handleModal(false)
        this.updateProfile()
    }

    render() {
     
        return (
            <>

                <Container as="main" className="profile-page">
                    
                    <h1>Bienvenid@ {this.props.loggedInUser.username}</h1>
                    
                    {
                        this.props.loggedInUser && <Button onClick={() => this.handleModal(true)} variant="info" size="sm" style={{ marginBottom: '20px' }}>Editar perfil</Button>
                    }
                    <Row>
                        <Image className="avatarDefault" src={this.props.loggedInUser.avatar}></Image>
                    </Row>
                    
                    <Card style={{ width: '45rem' }}>
                        <ListGroup variant="flush">
                            <ListGroup.Item><h2>{this.props.loggedInUser.name}</h2></ListGroup.Item>
                            <ListGroup.Item><h5>Nombre: {this.props.loggedInUser.username}</h5></ListGroup.Item>
                            <ListGroup.Item><h5>Email: {this.props.loggedInUser.email}</h5></ListGroup.Item>
                            <ListGroup.Item><h5>Localización: {this.props.loggedInUser.location}</h5></ListGroup.Item>
                            <ListGroup.Item><h5>Contacto: {this.props.loggedInUser.contact}</h5></ListGroup.Item>
                        </ListGroup>
                    </Card>

                    <Link className="btn btn-info btn-md" to='/chefs'>Volver</Link>
                    
                </Container>

                <Modal size="lg" show={this.state.showModal} onHide={() => this.handleModal(false)}>
                    <Modal.Body>
                        {this.state.showModal ? 
                            <EditProfile {...this.state} loggedInUser={this.props.loggedInUser} setTheUser={this.props.setTheUser} handleProfileSubmit={this.handleProfileSubmit} onHide={this.onHide} />
                        : null}
                    </Modal.Body>
                </Modal>

            </>

        )
    }

}

export default Profile