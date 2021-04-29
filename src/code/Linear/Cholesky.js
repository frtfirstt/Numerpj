import React, { Component } from 'react'

import { Menu, Input, Row, Col, Button, Card, Table } from 'antd';
import { Carousel } from 'antd';
import { Layout, Breadcrumb } from 'antd';
import { range, compile, lusolve, format ,det} from 'mathjs';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';
const { Header, Content, Footer, Sider } = Layout;
const InputColor = {
    background: "",
    color: "#003a8c", 
    fontWeight: "bold", 
    fontSize: "24px",
    width: 300 ,
    height:50
    

};
var A = [], B = [], matrixA = [], matrixB = [], output = [], decompose;
class Cholesky extends Component {
    constructor() {
        super();
        this.state = {
            row: 0,
            column: 0,
            showDimentionForm : true,
            showDimentionButton: true,
            showMatrixForm: false,
            showMatrixButton: false,
            showOutputCard: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.Lu = this.Lu.bind(this);
    
    }

    Lu(n) {
        this.initMatrix();
        decompose = lusolve(A, B)
        for (var i=0 ; i<decompose.length ; i++) {
            output.push(Math.round(decompose[i]));
            output.push(<br/>)
        }
        this.setState({
            showOutputCard: true
        });
    }
    
    printFraction (value) {
        return format(value, { fraction: 'ratio' })
    }
    Lu2(n) {
        decompose = lusolve(A, B)
        for (var i=0 ; i<decompose.length ; i++) {
            output.push(Math.round(decompose[i]));
            output.push(<br/>)
        }
        this.setState({
            showOutputCard: true
        });
    }
    
    printFraction (value) {
        return format(value, { fraction: 'ratio' })
    }

    createMatrix(row, column) {
        for (var i=1 ; i<=row ; i++) {
            for (var j=1 ; j<=column ; j++) {
                matrixA.push(<Input style={{
                    width: "18%",
                    height: "50%", 
                    marginInlineEnd: "5%", 
                    marginBlockEnd: "5%",
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold"
                }} 
                id={"a"+i+""+j} key={"a"+i+""+j} placeholder={"a"+i+""+j} />)  
            }
            matrixA.push(<br/>)
            matrixB.push(<Input style={{
                width: "18%",
                height: "50%", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"b"+i} key={"b"+i} placeholder={"b"+i} />)
                
            
        }

        this.setState({
            showDimentionForm: false,
            showDimentionButton: false,
            showMatrixForm: true,
            showMatrixButton: true
        })
        

    }
    initMatrix() {
        for(var i=0 ; i<this.state.row ; i++) {
            A[i] = []
            for(var j=0 ; j<this.state.column ; j++) {
                A[i][j] = (parseFloat(document.getElementById("a"+(i+1)+""+(j+1)).value));
            }
            B.push(parseFloat(document.getElementById("b"+(i+1)).value));
        }
    }

    dataapi = async()=>{
        var response = await axios.get('http://localhost:3000/GuassElimination').then(res => {return res.data});
        console.log(response)
        this.setState({
            A:response['A'],
            B:response['B'],
            row:response['row']
        })
        A = this.state.A;
        B = this.state.B;
        this.Lu2(this.state.row);
        
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <Router>
                <Layout>
                <body
                        style={{ background: "#ebe18d", padding: "90px" , float:"left" }}
                        onChange={this.handleChange}
                    >
                        {/*-----------------------------------------ปุ่มINPUTสมการ----------------------------------------------------*/}
                        <Row gutter={[40, 40]}
                            bordered={true}
                            onChange={this.handleChange}
                        >
                            <Col span={10} offset={7}>

                                <div>
                                    <h2>Row</h2><Input size="large" name="row" ></Input>
                                    <h2>Column</h2><Input size="large" name="column" ></Input>
                                </div>
                                <br></br>
                                {this.state.showDimentionButton &&
                                    <Button id="dimention_button" onClick={
                                        ()=>this.createMatrix(this.state.row, this.state.column)
                                    } style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}
                                    >
                                        Submit<br></br>
                                    </Button>
                                }
                                <Button id="submit_button" onClick= {
                                
                                ()=>this.dataapi()
                                 }  
                                 style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}>API</Button>

                                {this.state.showMatrixButton &&
                                    <Button
                                        id="matrix_button"
                                        onClick={()=>this.Lu(this.state.row)} style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}>
                                        Submit
                                    </Button>
                                }
                            </Col>
                        </Row>
                        <br></br>
                        <Row gutter={[40, 40]}>
                            <Col span={8} offset={4}>
                                <Card
                                    title={<h3>Matrix</h3>}
                                >
                                    {this.state.showMatrixForm && <div>{matrixA}</div>}
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title={<h3>Vector</h3>}
                                >
                                    {this.state.showMatrixForm && <div>{matrixB}</div>}
                                </Card>
                            </Col>
                        </Row>
                        <br></br>
                        {/*---------------------------------------------------------------------------------------------*/}
                        <Row gutter={[2, 2]}>
                            <Col span={10} offset={7}>
                                <Card
                                    title={<h3>Outpot</h3>}
                                    bordered={true}
                                    onChange={this.handleChange} id="answerCard">
                                    <p style={{fontSize: "24px", fontWeight: "bold"}}>{output}</p>
                                </Card>
                            </Col>
                        </Row>
                    </body>
                </Layout>
            </Router>
        );
    }
}
export default Cholesky;