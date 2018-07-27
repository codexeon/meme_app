import React from "react";
import { connect } from "react-redux";
import { changeKeywords } from "../actions/index"
import { Link } from 'react-router-dom'

class ConnectedContactsList extends React.Component {
    render() {
        return (
        <ul className="contactList">
        {this.props.contacts.map(contact => {
            if (contact.name.toLowerCase().indexOf(this.props.keywords.toLowerCase()) >= 0) {
                return (<li key={contact.key}><Link to={`/details/${contact.key}`}>{contact.name}</Link></li>);
            }
            else {
                return null;
            }
            })}
        </ul>
        );
    }
}

const mapStateToProps = state => {
    return { 
        keywords: state.keywords,
        contacts: state.contacts
    };
};

const ContactsList = connect(mapStateToProps)(ConnectedContactsList);

export default ContactsList;