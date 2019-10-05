import React, { PureComponent } from 'react';
import _ from 'lodash';
import {
  ErrorMessage, Field, Form, Formik,
} from 'formik';

import Modal from '../Modal';
import FormRow from '../../views/FormRow';
import Errors from '../../views/Errors';
import Pinny from '../../views/Pinny';
import { lib, login } from '../../store';

export default class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { ...login.state, showPinny: false };
  }

  componentDidMount() {
    this._sub = login.subscribe(({ state }) => this.setState(state),
      (err) => {
        console.log('login store error: ', err);
      });
  }

  componentWillUnmount() {
    if (this._sub) this._sub.unsubscribe();
  }

  render() {
    const { loginError, showPinny } = this.state;

    return (
      <>
        <Modal>
          <div className="modal-back" />
          <div className="modal-inner modal-inner-login">
            <article>
              <div className="control-wrapper">
                <header>
                  <h1>Log In</h1>
                </header>
              </div>
              <div className="modal-main">
                <Formik
                  initialValues={lib.newRecord(login)}
                  validate={(record) => {
                    let errors;
                    try {
                      errors = login.validateRecord(record)
                        .formikErrors();
                    } catch (err) {
                      console.log('error in validation: ', err);
                      login.actions.setLoginError(err);
                      this.setState({ showPinny: true });
                    }
                    return errors;
                  }}
                  onSubmit={async (record, { setSubmitting }) => {
                    await login.actions.logIn(record);
                    this.setState({ showPinny: login.state.loginError });
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <FormRow label="Username">
                        <Field type="text" name="userName" className="input-field" />
                        <ErrorMessage name="userName" className="form-error" component="div" />
                      </FormRow>
                      <FormRow label="Password">
                        <Field type="password" name="password" className="input-field" />
                        <ErrorMessage name="password" className="form-error" component="div" />
                      </FormRow>
                      <FormRow label="">
                        <button type="submit" className="main" disabled={isSubmitting}>
                        Log In
                        </button>
                      </FormRow>
                      {loginError ? <Errors errors={[_.get(loginError, 'message', '')]} /> : ''}
                    </Form>
                  )}
                </Formik>
              </div>
            </article>
          </div>
          {showPinny
            ? (
              <Pinny
                comment={_.get(loginError, 'message') || 'no message'}
                onClick={() => {
                  this.setState({ showPinny: false });
                }}
              />
            ) : ''}
        </Modal>
      </>
    );
  }
}
