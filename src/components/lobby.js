import React, { Component } from 'react';
import { db } from '../firebase';
import { getRoomList, createRoom } from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Lobby extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roomName: ''
        }

        this.dbChatRef = db.ref('/chat-rooms');
    }

    componentDidMount(){
        this.dbChatRef.on('value', snapshot => {
            this.props.getRoomList(snapshot.val());
        })
    }

    componentWillUnmount(){
        this.dbChatRef.off();
    }

    handleCreateRoom(e) {
        e.preventDefault();
        console.log('Room name: ', this.state.roomName);

        this.props.createRoom(this.state.roomName);

        this.setState({roomName: ''})
    }
    render() {
        const { roomName } = this.state;
        const { roomList } = this.props; 
        let rooms = [];

        if(roomList){
            rooms = Object.keys(roomList).map( (key, index ) => {
                // console.log('key', key, 'name: ', roomList[key].name, ' roomId',roomList[key].chatLogId )
                return (
                    <li key={index} className = "collection-item">
                       <Link to={`/room/${key}/log/${roomList[key].chatLogId}`}> {roomList[key].name} </Link>
                    </li>

                )
            })
        } else {
            rooms.push(<li key='0' className='collection-item'> No rooms available</li>)
        }

        return (
            <div>
                <h3>Chat Lobby</h3>
                <form onSubmit={this.handleCreateRoom.bind(this)}>
                    <label >Chat Room Name</label>
                    <input type="text" value={roomName} onChange={e => this.setState({ roomName: e.target.value })} />
                    <button>Create Room</button>
                </form>
                <ul className="collection">
                    { rooms }
                </ul>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        roomList: state.chat.roomList
    }
}

export default connect(mapStateToProps, { getRoomList, createRoom })(Lobby);