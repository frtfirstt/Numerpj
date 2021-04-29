import React, { Component } from 'react'
import { Menu, Input, Row, Col, Button, Card, Table } from 'antd';
import { Carousel } from 'antd';
import { range, compile, lusolve, format, det ,subtract,multiply,transpose,add} from 'mathjs';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Layout, Breadcrumb } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
const InputColor = {
    background: "",
    color: "#003a8c", 
    fontWeight: "bold", 
    fontSize: "24px",
    width: 300 ,
    height:50
    

};
var A = [], B = [], matrixA = [], matrixB = [], matrixX = [], x, epsilon, dataInTable = [], count = 1, output
var columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "λ",
        dataIndex: "lambda",
        key: "lambda"
    },
    {
        title: "{X}",
        dataIndex: "X",
        key: "X"
    },
    {
        title: "Error",
        dataIndex: "error",
        key: "error"
    }
];

class Conjugate extends Component {
    constructor() {
        super();
        this.state = {
            row: 0,
            column: 0,
            showDimentionForm: true,
            showDimentionButton: true,
            showMatrixForm: false,
            showMatrixButton: false,
            showOutputCard: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.conjugate_gradient = this.conjugate_gradient.bind(this);

    }
    positive_definite(dimention) {
        var tempMatrix = []
        for (var i = 0; i < dimention; i++) {
            tempMatrix[i] = []
            for (var j = 0; j < dimention; j++) {
                tempMatrix[i][j] = A[i][j];
            }
        }
        if (det(tempMatrix) <= 0) {
            return false;
        }
        if (dimention !== this.state.row - 1) {
            return this.positive_definite(++dimention);
        }
        return true;
    }

    conjugate_gradient(row) {
        this.initMatrix();
        // if (!this.positive_definite(row)) {
        //     output = "This matrix doesn't positive definite"
        //     console.log("b");
        //     this.setState({
        //         showOutputCard: true
        //     });
        //     return false;
        // }
        //find {R0}
        var R = subtract(multiply(A, x), B);
        console.log(R)
        //find D0
        var D = multiply(R, -1);
        console.log(D)
        do {
            //find λ
            var λ = (multiply(multiply(transpose(D), R), -1)) /
                (multiply(multiply(transpose(D), A), D))
            console.log(λ)
            /*------------------------------------------------------------------*/

            //find new {X}
            x = add(x, multiply(λ, D));
            console.log(x)
            //find new {R}
            R = subtract(multiply(A, x), B);
            console.log(R)
            //find epsilon
            epsilon = Math.sqrt(multiply(transpose(R), R)).toFixed(8);
            this.appendTable(λ, JSON.stringify(x).split(',').join(",\n"), epsilon);
            console.log(epsilon)
            var α = (multiply(multiply(transpose(R), A), D)) /
                multiply(transpose(D), multiply(A, D)).toFixed(8);
            console.log(α)
            D = add(multiply(R, -1),multiply(α, D))
            console.log(D)
        } while (epsilon > 0.000001);

        this.setState({
            showOutputCard: true
        });


    }
    createMatrix(row, column) {
        A = []
        B = []
        matrixA = []
        matrixB = []
        matrixX = []
        x = []
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= column; j++) {
                matrixA.push(<Input style={{
                    width: "18%",
                    height: "50%",
                    marginInlineEnd: "5%",
                    marginBlockEnd: "5%",
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold"
                }}
                    id={"a" + i + "" + j} key={"a" + i + "" + j} placeholder={"a" + i + "" + j} />)
            }
            matrixA.push(<br />)
            matrixB.push(<Input style={{
                width: "18%",
                height: "50%",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"b" + i} key={"b" + i} placeholder={"b" + i} />)
            matrixX.push(<Input style={{
                width: "18%",
                height: "50%",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"x" + i} key={"x" + i} placeholder={"x" + i} />)


        }

        this.setState({
            showDimentionForm: false,
            showDimentionButton: false,
            showMatrixForm: true,
            showMatrixButton: true
        })
        console.log(matrixA);



    }
    initMatrix() {
        for (var i = 0; i < this.state.row; i++) {
            A[i] = []
            
            for (var j = 0; j < this.state.column; j++) {
                // console.log(parseFloat(document.getElementById("x" + (i + 1)).value))
                A[i][j] = parseFloat(document.getElementById("a" + (i + 1) + "" + (j + 1)).value)
            }
            B.push(parseFloat(document.getElementById("b" + (i + 1)).value));
            x.push(parseFloat(document.getElementById("x" + (i + 1)).value));
        }
    }
    appendTable(lambda, x, error) {
        console.log(dataInTable)
        dataInTable.push({
            iteration: count++,
            lambda: lambda,
            X: x,
            error: error
        });
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
                                        () => { this.createMatrix(this.state.row, this.state.column) }
                                    } style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}
                                    >
                                        Submit<br></br>
                                    </Button>
                                }

                                {this.state.showMatrixButton &&
                                    <Button
                                        id="matrix_button"
                                        onClick={()=>this.conjugate_gradient(parseInt(this.state.row))} style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}>
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
                            <Col span={8}>
                                <Card
                                    title={<h3>Vector</h3>}
                                >
                                    {this.state.showMatrixForm && <div>{matrixX}</div>}
                                </Card>
                            </Col>
                        </Row>
                        <br></br>

                        {/*---------------------------------------------------------------------------------------------*/}
                        <Row gutter={[2, 2]}>
                            <Col span={10} offset={7}>
                            {this.state.showOutputCard &&
                                <Card
                                    title={<h3>Outpot</h3>}
                                    bordered={true}
                                    onChange={this.handleChange} id="answerCard">
                                    <Table columns={columns} dataSource={dataInTable} bordered={true} bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "black", overflowX: "scroll" }}
                                    ></Table>
                                </Card>
                            }
                            </Col>
                        </Row>
                    </body>
                </Layout>
            </Router>
        );
    }
}
export default Conjugate;