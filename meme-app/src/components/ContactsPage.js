import React from "react";
import { connect } from "react-redux";
import { changeKeyword } from "../actions/index"
import ContactsList from './ContactsList'
import {bindActionCreators} from 'redux';
import { withRouter } from 'react-router'
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';

class ConnectedContactsPage extends React.Component {
  constructor(props) {
    super(props);
    this.changeKeyword = this.changeKeyword.bind(this);
  }

  changeKeyword(value) {
    this.props.changeKeyword(value);
  }

  render() {
      return (
        <div>
          <TextField label="Search contacts" onChanged={this.changeKeyword}/>
          <ContactsList />
        </div>
      );
    }
  }
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        changeKeyword: changeKeyword
    }, dispatch);
};

const ContactsPage = withRouter(connect(null, mapDispatchToProps)(ConnectedContactsPage));

export default ContactsPage;