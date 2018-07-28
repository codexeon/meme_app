import React from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

class ConnectedDetailsPage extends React.Component {
  render() {
    const resourceName = this.props.match.params.resourceName;
    const contact = this.props.contacts.find(contact => {
      return contact.key === resourceName;
    });

    let contactDetails = null;
    if (contact)
    {
      contactDetails = (
        <div>
            <div><Link to='/'><DefaultButton text="Back to list" /></Link></div>
            <img src={contact.photo.url} />
            <div>Name: {contact.name}</div>
            <div>Emails:</div>
            {contact.emailAddresses && contact.emailAddresses.map(email => <div>{email.value}</div>)}
        </div>
      );
    }
    else
    {
      contactDetails = "Not found";
    }
    

    return (
      <div>
        {contactDetails}
      </div>
    );
  }
}

const mapStateToProps = state => {
    return { 
        contacts: state.contacts
    };
};

const DetailsPage = withRouter(connect(mapStateToProps)(ConnectedDetailsPage));

export default DetailsPage;
