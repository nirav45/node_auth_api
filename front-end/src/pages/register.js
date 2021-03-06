import React from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

class RegisterPage extends React.Component {
    constructor(props) {
        const isLoggedIn = localStorage.getItem('isLogin');

        super(props);
        this.state = {
            formData: {
                email: '',
                password: ''
            },
            emailError: '',
            passwordError: ''
        };
    }
    
    regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    regexPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    handleChange = (event) => {
        let formData = { ...this.state.formData };
        let element = event.target.name;
        let value = event.target.value;
        formData[element] = value;
        this.setState({ formData });
        if (element === "email") {
            if (!value) {
                this.setState({ emailError: "Email is require" });
            } else {
                if (!this.regexEmail.test(value)) {
                    this.setState({ emailError: "Enter a valid email" });
                } else {
                    this.setState({emailError: ''});
                }
            }
        } else if (element === 'password') {
            if (!value) {
                this.setState({ passwordError: "Password is require" });
            } else {
                if (!this.regexPassword.test(value)) {
                    this.setState({ passwordError: "Password length must be 8 and contain at least one small and capital alphabet, numbers and special characters" });
                } else {
                    this.setState({passwordError: ''});
                }
            }
        }
    }

    handleSubmit = (event) => {
        axios.post(`http://127.0.0.1:5000/api/register`, this.state.formData)
            .then(res => {
                console.log("res", res);
                if (res.status === 200) {
                    res = res.data;
                    localStorage.setItem('authToken', res.data.authToken);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    localStorage.setItem('isLogin', true);
                    window.location.assign('/dashboard');
                }

            }).catch(err =>  {
                alert(err.response.data.data.message);
            })
        event.preventDefault();
    }

    render() {
        return (<form onSubmit={this.handleSubmit}>
            <div>
                <input type="text" required name="email" placeholder="Your Email" onChange={this.handleChange} />
            </div>
            <div style={{ color: "red" }}>{this.state.emailError}</div>
            <div>
                <input required type="password" name="password" placeholder="Password" onChange={this.handleChange} />
            </div>
            <div style={{ color: "red" }}>{this.state.passwordError}</div>
            <div>
                <button type="submit" name="login">Signup</button>
            </div>
            <div>
                Allready have an account? <Link to="/"><button name="signup">Login</button></Link>
            </div>
        </form>)
    }
}

export default RegisterPage;