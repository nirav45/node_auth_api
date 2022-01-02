import React from "react";
import axios from 'axios';

class DashboardPage extends React.Component {
    constructor(props) {
        const user = JSON.parse(localStorage.getItem('user'));
        const isLoggedIn = localStorage.getItem('isLogin');

        if (!isLoggedIn) {
            window.location.assign('/');
        }

        super(props);
        this.state = {
            userType: user.type,
            userData: []
        }
    }

    componentDidMount() {
        const authToken = localStorage.getItem('authToken');
        axios.get('http://127.0.0.1:5000/api/get-dashboard-data', {
            headers: {
                "x-access-token": authToken
            }
        }).then(res => {
            if (res.status === 200) {
                let userDataRes = res.data;
                this.setState({ userData: userDataRes.data });
            } else {
                localStorage.clear();
                window.location.assign('/');
            }
        })
    }

    handleLogoutClick = () => {
        localStorage.clear();
        window.location.assign('/');
    }

    render() {
        return (<div>
            <h1> User Info ({this.state.userType})</h1><button onClick={this.handleLogoutClick}>Logout</button>
            {this.state.userType === 'User' ?
                (<div>
                    <h1>Welcome this is home page.</h1>
                    <label>{this.state.userData.email}</label>
                </div>) :
                (<div>
                    <h1>Welcome, this is home page</h1>
                    <label>here is all user's list</label>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.userData.map((user) => {
                                    return (<tr>
                                        <td>{user.email}</td>
                                    </tr>)
                                })}

                            </tbody>
                        </table>
                    </div>
                </div>)
            }
        </div>)
    }
}

export default DashboardPage;