import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {CSSTransition} from "react-transition-group";
import contactsActions from "../../redux/contacts/contactsActions";
import contactsOperations from "../../redux/contacts/contactsOperations";
import contactsSelectors from "../../redux/contacts/contactsSelectors";
import styles from "./ContactForm.module.scss";
import "./ContactFormAnimation.css";


class ContactForm extends Component {
  state = {
    name: "",
    number: "",
  }
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  }
  handleSubmit = event => {
    event.preventDefault();
    const {name, number} = this.state;
    const {onSubmit, onShowNotify, contacts} = this.props;

    if (name === "" || number === "")
      return;
    if (contacts.findIndex(contact => contact.name === name) !== -1) {
      onShowNotify();
      this.clearInputClearState();
      return;
    }
    onSubmit({name, number});
    this.clearInputClearState();
  }

  clearInputClearState = () => {
    this.setState({name: "", number: ""});
    this.clearInputContactsData();
  }

  clearInputContactsData = () => {
    const inputRefs = document.querySelectorAll(".js-form-input");
    inputRefs.forEach(inputItem => inputItem.value = "");
  }

  handleChange = event => {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  render() {
    const inputStyles = [styles.formElement, styles.formInput, "js-form-input"].join(" ");
    return (
      <section className={styles.sectionContacts}>
        <CSSTransition in={true} appear={true} timeout={500} classNames="ContactFormTitle" unmountOnExit>
          <h2 className={styles.title}>Phonebook</h2>
        </CSSTransition>
        <form className={styles.formContacts} onSubmit={this.handleSubmit}>
          <label className={styles.formElement} htmlFor="name">Name</label>
          <input className={inputStyles} type="text" name="name" onChange={this.handleChange}/>
          <label className={styles.formElement} htmlFor="number">Number</label>
          <input className={inputStyles} type="text" name="number" onChange={this.handleChange}/>
          <br/>
          <button className={styles.btn} type="submit">Add contact</button>
        </form>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  contacts: contactsSelectors.getContacts(state),
})

const mapDispatchToProps = {
  onSubmit: contactsOperations.addContact,
  onShowNotify: contactsActions.toggleNotify
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);