import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRoomData, getChatLog, sendNewMessage } from '../actions';
import { db } from '../firebase';

class ChatRoom extends Component{
    constructor(props){
        super(props);

        this.state = {
            msg: ''
        }
    }
    componentDidMount(){
        const { name, logId } = this.props.match.params;
        
        this.props.getRoomData(name, logId);

        db.ref(`/chat-logs/${logId}`).on('value', snapshot => {
            this.props.getChatLog(snapshot.val());
        })
    }

    componentWillUnmount(){
        db.ref(`/chat-logs/${this.props.match.params.logId}`).off();
    }

    sendMessage(e){
        e.preventDefault();
        this.props.sendNewMessage(this.props.roomInfo.chatLogId, this.state.msg);
        this.setState({
            msg: ''
        })
    }

    render(){
        console.log(this.props);
        const { name } = this.props.roomInfo;
        const { chatLog } = this.props;

        const messages = Object.keys(chatLog).map( key => {
            return <li key={key} className="collection-item">{chatLog[key]}</li>
        })

        console.log(chatLog)


        return (
            <div>
                <h3>{ name ? name : 'Loading...'}</h3>
                <form onSubmit={this.sendMessage.bind(this)}>
                    <label>Enter Message</label>
                    <input type="text" values={this.state.msg} onChange={e => {this.setState({msg: e.target.value})}}/>
                    <button>Send Message</button>
                </form>
                <ul className="collection">
                    { messages }
                </ul>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        roomInfo: state.chat.currentRoom,
        chatLog: state.chat.chatLog
    }
}

export default connect(mapStateToProps, {getRoomData, getChatLog, sendNewMessage})(ChatRoom); 