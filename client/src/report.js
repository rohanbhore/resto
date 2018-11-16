import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Axios from 'axios';

export default class Report extends Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.bindddlData = this.bindddlData.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.downloadReports = this.downloadReports.bind(this);
        this.state = {
            PredictedData: {
                id: '',
                predictedValue: ''
            },
            data: [],
        }
    }

    componentDidMount() {
        this.bindddlData();
    }
    onChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            PredictedData: {
                ...this.state.PredictedData,
                [name]: value,
            }
        })
    }
    bindddlData() {
        Axios({
            method: "get",
            url: '/getData',
            responseType: 'json'
        }).then((responce) => {
            console.log(responce);
            this.setState({
                data: responce.data
            })
        }).catch((err) => {
            console.log(err);
        })
    }

    onSubmit() {
        this.insertPredictedValue(this.state.PredictedData);
    }

    downloadReports() {
        Axios({
            method: "post",
            url: '/createReport',
            responseType: 'blob'
        }).then((a) => {
            const url = window.URL.createObjectURL(new Blob([a.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download',"Reports.pdf");
            document.body.appendChild(link);
            link.click();
            alert("pdf is downloaded");
        })

    }

    insertPredictedValue(data) {
        Axios({
            method: "post",
            url: '/insertPredictedValue',
            data: data,
            responseType: 'json'
        }).then((x) => {
            console.log(x);
            this.props.history.push('/')

        })
    }

    render() {
        let ddlValue = this.state.data.map((element) => {
            return (
                <option value={element.id}>{element.name}</option>
            )
        })
         ddlValue.unshift(<option value=''>--select--</option>);
        return (
            <React.Fragment>
                <Link to='/'>Orders</Link>
                <h1>This is Report Page</h1>
                <select name='id' onChange={this.onChange}>{ddlValue}</select>
                <input type="text" placeholder='Enter Predicted Value' name='predictedValue' onChange={this.onChange} autoComplete='off' />
                <input type="button" name="submitPredictedValue" value='submit' onClick={this.onSubmit} />
                <input type="button" name="downloadReports" value="Download" onClick={this.downloadReports} />
            </React.Fragment>
        )
    }
}