/* global gapi */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import store from "./store/index";
import ContactsPage from "./components/ContactsPage"
import DetailsPage from "./components/DetailsPage"
import { getContactList } from "./actions/index"
import { Provider, connect } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';

const CLIENT_ID = "30824722166-lj3l1u9831cvc9f75e35n9rkopemju5p.apps.googleusercontent.com";
const API_KEY = "AIzaSyBrFFdMDFo-susL3KY8vSMUUXGG5n5nOoM";
const DISCOVERY_DOCS = ["https://people.googleapis.com/$discovery/rest?version=v1"];
const SCOPES = "profile https://www.googleapis.com/auth/contacts.readonly";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.authenticateClick = this.authenticateClick.bind(this);
  }

  authenticateClick() {
    if (this.props.authenticated) {
      this.props.signOut();
    } else {
      this.props.signIn();
    }
  }

  render() {
    return (
      <div className="signin">
        <DefaultButton primary={ true } onClick={this.authenticateClick} text={ this.props.authenticated ? "Sign out" : "Sign in to Google"} />
      </div>
    );
  }
}



class ContactList extends React.Component {
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


class ConnectedContactApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      isLoaded: false,
      signedInUser: "",
    };
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.initClient = this.initClient.bind(this);
    this.changeKeywords = this.changeKeywords.bind(this);
  }

  componentDidMount() {
    gapi.load('client:auth2', this.initClient);
  }
  
  async initClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    });
  
    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
    // Handle the initial sign-in state.
    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    this.setState({
      isLoaded: true
    });
  }

  async updateSigninStatus(isSignedIn) {
    this.setState({
      authenticated: isSignedIn
    });

    if (isSignedIn) {
      let currentUserResponse = await gapi.client.people.people.get({
        'resourceName': 'people/me',
        'requestMask.includeField': 'person.names'
      });

      let contactsResponse = await gapi.client.people.people.get({
        'resourceName': 'people/me/connections',
        'requestMask.includeField': 'person.names,person.emailAddresses,person.photos'
      });
      var contacts = contactsResponse.result.connections.map(contact => {
        return {
          key: contact.resourceName.replace('/',''),
          name: contact.names[0].displayName,
          photo: contact.photos[0],
          emailAddresses: contact.emailAddresses
        }
      });
      this.setState({
        signedInUser: currentUserResponse.result.names[0].displayName,
      });

      this.props.getContactList(contacts);
    }
  }

  signIn(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  signOut(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  changeKeywords(event) {
    this.setState({
      keywords: event.target.value
    })
  }

  render() {
    let loginPage = null;
    if (this.state.isLoaded === true) {
      loginPage = <SignIn signIn={this.signIn} signOut={this.signOut} authenticated={this.state.authenticated} />;
    }

    return (
      <Router>
        <Fabric>
        <div className="contactApp">
          <Label>{this.state.signedInUser.length > 0 && `Hello ${this.state.signedInUser}`}</Label>
          {loginPage}
          <Switch>
            <Route exact path="/" render={ContactsPage} />
            <Route path="/details/:resourceName" component={DetailsPage} />
          </Switch>
        </div>
        </Fabric>
      </Router>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getContactList: contacts => dispatch(getContactList(contacts))
  };
};
const ContactApp = connect(null, mapDispatchToProps)(ConnectedContactApp);
// ========================================

ReactDOM.render(<Provider store={store}><ContactApp /></Provider>, document.getElementById("root"));


