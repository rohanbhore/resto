import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './table.css';
import Axios from 'axios';
import { subscribeToTimer } from './api';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.bindData = this.bindData.bind(this);
        this.onDone = this.onDone.bind(this);
        this.state = {
            orders: {
                name: '',
                quantity: '',
                created: '',
                predicted: '',
                status: '',
            },
            data:[],
        }
        subscribeToTimer((err, data) => this.setState({ 
            data 
          }));
    }

    componentDidMount() {
        this.bindData();
    }

    bindData() {
        Axios({
            method: "get",
            url: '/getData',
            responseType: "json"

        }).then((response) => {
            console.log(response.data)

            this.setState({
                data:response.data
            })
        })
    }

    onDone(id){
        let data =this.state.data;
        let data1=data.filter((element)=>{
            return element.id === id;
        })
        Axios({
            method:"post",
            url:'/doneData',
            data:data1,
            responseType:"json"
        }).then((z)=>{
            console.log(z);
            this.setState({
                data:z.data
            })
        })
    }

    render() {

            let tableValue = this.state.data.map((element)=>{
                return (
                    <tr>
                    <td>{element.name}</td>
                    <td>{element.quantity}</td>
                    <td>{element.created}</td>
                    <td>{element.predicted}</td>
                    <td><input name={element.quantity} type="button" value="Done" onClick={this.onDone.bind(this,element.id)}/></td>
                  </tr>
                )
            })


        return (
            <React.Fragment>
                 <Link to='/report'>Report</Link>
                <h2>Orders</h2>

                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Created</th>
                        <th>Predicted</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                            {tableValue}
                    </tbody>
                </table>
            </React.Fragment>
        )
    }

}