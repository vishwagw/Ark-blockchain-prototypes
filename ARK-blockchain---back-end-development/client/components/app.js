import { json } from "body-parser";
import React, { Component }from "react";
import Block from "./block";

class App extends Component {
    state = { walletInfo: { address: 'ARKv1', balance: 999 } };

    componentDidMount() {
        fetch('http://localhost:3000/api/wallet-info').then(response => response.json()).then(json => this.setState({ walletInfo: json }));

    }

    render() {
        const { address, balance } =this.state.walletInfo;
        return(
            <div>
                <div> Welcome To ARK Blockchain</div>
                <div>Address: {address}</div>
                <div>Balance: {balance}</div>
                <br/>
                <Blocks /> 

            
                
            </div>
        );
    }
}

export default App;