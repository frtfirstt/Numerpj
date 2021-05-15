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
var api
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
        this.Lu = this.cholesky.bind(this);
    
    }

    cholesky(n) {
        this.initMatrix();
        var  x  = new Array(n);
        var  y  = new Array(n)

        if (matrixA[0][0] === 0) {
            for (var i=0 ; i<n ; i++) {
                var temp = A[0][i];
                matrixA[0][i] = B[i][i];
                matrixB[0][i] = temp;
            }
        }
        var matrixL = new Array(n);
        for(i=0;i<n;i++){
            matrixL[i]  = new Array(n); 
            for(var j=0;j<n;j++){
                matrixL[i][j] = 0;
            }
            x[i] = 0;
            y[i] = 0;
        }
        console.log(x)
        matrixL[0][0] = Math.sqrt(matrixA[0][0]);
        for(var k=1;k<n;k++){

            for(i=0;i<k;i++){
                var sum = 0;
                if(i!==0){
                    for(j=0;j<i;j++){
                        sum += matrixL[i][j]*matrixL[k][j];
                        //console.log(sum);
                    }
                }
                matrixL[k][i]= (matrixA[i][k]-sum)/matrixL[i][i];//ได้ค่า L ที่ไม่ใช่แนวทะแยง
            }
            sum = 0;
            for(j=0;j<k;j++){
                sum += matrixL[k][j]*matrixL[k][j];
            }
            matrixL[k][k] = Math.sqrt(matrixA[k][k]-sum);
        };
        console.log(y)
        y[0] = matrixB[0]/matrixL[0][0];
        console.log(y)
        for(i=1;i<n;i++){
            sum = 0;
            for(j=0;j<i;j++){
                sum += matrixL[i][j]*y[j];
            }
            y[i] = (matrixB[i]-sum)/matrixL[i][i];
        }
        console.log(y)
   
        x[n-1] = y[n-1]/matrixL[n-1][n-1];
        console.log(x)
        for(i=this.state.row-2;i>=0;i--){
            sum = 0;
            for(j=i+1;j<this.state.row;j++){
                sum += matrixL[j][i]*x[j];
            }
            x[i] = (y[i]-sum)/matrixL[i][i];
        }
        
        for (var i = 0; i < x.length; i++) {
            output.push(<h2>X<sub>{i}</sub>=&nbsp;&nbsp;{Math.round(x[i])}</h2>);
            output.push(<br />)
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

    async dataapi() {
        await axios({method: "get",url: "http://localhost:5000/database/gauss",}).then((response) => {console.log("response: ", response.data);api = response.data;});
        await this.setState({
            row: api.row,
            column: api.row,
          });
          matrixA = [];
          matrixB = [];
          await this.createMatrix(api.row, api.row);
          for (let i = 1; i <= api.row; i++) {
            for (let j = 1; j <= api.row; j++) {
              document.getElementById("a" + i + "" + j).value =
                api.A[i - 1][j - 1];
            }
            document.getElementById("b" + i).value = api.B[i - 1];
          }
          this.cholesky(api.row);
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