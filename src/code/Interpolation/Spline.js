import React, { Component } from 'react';
import { Card, Input, Button, Row, Col, Table } from 'antd';
import 'antd/dist/antd.css';
import { compile } from 'mathjs';
import { Layout, Breadcrumb } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
const InputStyle = {
    background: "#1890ff",
    color: "white",
    fontWeight: "bold",
    fontSize: "24px"

};
var columns = [
    {
        title: "No.",
        dataIndex: "no",
        key: "no"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Y",
        dataIndex: "y",
        key: "y"
    }
];
var x = [], y = [], tableTag = [], answer

class Appc extends Component {

    constructor() {
        super();
        this.state = {
            nPoints: 0,
            X: 0,
            showInputForm: true,
            showInputButton: true,
            showTableInput: false,
            showTableButton: false,
            showOutputCard: false
        }
        this.handleChange = this.handleChange.bind(this);

    }


    createTableInput(n) {
        for (var i = 1; i <= n; i++) {
            x.push(<Input style={{
                width: "100%",
                height: "50%",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"x" + i} key={"x" + i} placeholder={"x" + i} />);
            y.push(<Input style={{
                width: "100%",
                height: "50%",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"y" + i} key={"y" + i} placeholder={"y" + i} />);
            tableTag.push({
                no: i,
                x: x[i - 1],
                y: y[i - 1]
            });
        }


        this.setState({
            showInputForm: false,
            showInputButton: false,
            showTableInput: true,
            showTableButton: true
        })
    }
    initialValue(X) {
        x = []
        y = []
        for (var i = 0; i < this.state.nPoints; i++) {
            x[i] = parseFloat(document.getElementById("x" + (i + 1)).value);
            y[i] = parseFloat(document.getElementById("y" + (i + 1)).value);
        }
        answer = this.spline(X, x, y)
    }
    spline(x, xs, ys) {
        var ks = xs.map(function () { return 0 })
        ks = this.getNaturalKs(xs, ys, ks)
        var i = 1;
        while (xs[i] < x) i++;
        var t = (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
        var a = ks[i - 1] * (xs[i] - xs[i - 1]) - (ys[i] - ys[i - 1]);
        var b = -ks[i] * (xs[i] - xs[i - 1]) + (ys[i] - ys[i - 1]);
        var q = (1 - t) * ys[i - 1] + t * ys[i] + t * (1 - t) * (a * (1 - t) + b * t);
        console.log(q)
        this.setState({
            showOutputCard: true
        })

        return q;
    }

    getNaturalKs(xs, ys, ks) {
        var n = xs.length - 1;
        var A = this.zerosMat(n + 1, n + 2);

        for (var i = 1; i < n; i++)  // rows
        {
            A[i][i - 1] = 1 / (xs[i] - xs[i - 1]);
            A[i][i] = 2 * (1 / (xs[i] - xs[i - 1]) + 1 / (xs[i + 1] - xs[i]));
            A[i][i + 1] = 1 / (xs[i + 1] - xs[i]);
            A[i][n + 1] = 3 * ((ys[i] - ys[i - 1]) / ((xs[i] - xs[i - 1]) * (xs[i] - xs[i - 1])) + (ys[i + 1] - ys[i]) / ((xs[i + 1] - xs[i]) * (xs[i + 1] - xs[i])));
        }

        A[0][0] = 2 / (xs[1] - xs[0]);
        A[0][1] = 1 / (xs[1] - xs[0]);
        A[0][n + 1] = 3 * (ys[1] - ys[0]) / ((xs[1] - xs[0]) * (xs[1] - xs[0]));

        A[n][n - 1] = 1 / (xs[n] - xs[n - 1]);
        A[n][n] = 2 / (xs[n] - xs[n - 1]);
        A[n][n + 1] = 3 * (ys[n] - ys[n - 1]) / ((xs[n] - xs[n - 1]) * (xs[n] - xs[n - 1]));

        return this.solve(A, ks);
    }

    solve(A, ks) {
        var m = A.length;
        for (var k = 0; k < m; k++)  // column
        {
            // pivot for column
            var i_max = 0; var vali = Number.NEGATIVE_INFINITY;
            for (var i = k; i < m; i++) if (A[i][k] > vali) { i_max = i; vali = A[i][k]; }
            this.swapRows(A, k, i_max);

            // for all rows below pivot
            for (i = k + 1; i < m; i++) {
                for (var j = k + 1; j < m + 1; j++)
                    A[i][j] = A[i][j] - A[k][j] * (A[i][k] / A[k][k]);
                A[i][k] = 0;
            }
        }
        for (i = m - 1; i >= 0; i--) // rows = columns
        {
            var v = A[i][m] / A[i][i];
            ks[i] = v;
            for (j = i - 1; j >= 0; j--) // rows
            {
                A[j][m] -= A[j][i] * v;
                A[j][i] = 0;
            }
        }
        console.log(A)
        return ks;
    }

    zerosMat(r, c) {
        var A = [];
        for (var i = 0; i < r; i++) {
            A.push([]);
            for (var j = 0; j < c; j++) A[i].push(0);
        }
        return A;
    }

    swapRows(m, k, l) {
        var p = m[k]; m[k] = m[l]; m[l] = p;
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
                    <Content
                        style={{
                            background: '#FFCC66',
                            padding: 24,
                            margin: 30,
                            minHeight: 280,
                            fontSize: 24
                        }}
                        onChange={this.handleChange}
                    >
                        <Row gutter={[40, 40]}
                        >
                            <Col span={10} offset={7}>
                                {this.state.showTableInput &&
                                    <div>
                                        <Table columns={columns} dataSource={tableTag} pagination={false} bordered={true} bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "black", overflowY: "scroll", minWidth: 120, maxHeight: 300 }}>

                                        </Table>
                                    </div>}

                                {this.state.showInputForm &&
                                    <div>
                                        <h2>Number of points(n)</h2><Input size="large" name="nPoints"></Input>
                                        <h2>X</h2><Input size="large" name="X"></Input>
                                    </div>
                                }
                                <br></br>
                                {this.state.showInputButton &&
                                    <Button id="dimention_button" onClick={
                                        () => { this.createTableInput(parseInt(this.state.nPoints)) }
                                    }
                                        style={{ fontSize: "20px" }}>
                                        Submit<br></br>
                                    </Button>
                                }
                                {this.state.showTableButton &&
                                    <Button
                                        id="matrix_button"
                                        style={{ fontSize: "20px" }}
                                        onClick={() => this.initialValue(parseFloat(this.state.X))}>
                                        Submit
                            </Button>
                                }
                            </Col>

                        </Row>
                        {/*-----------------------------------------ปุ่มINPUTสมการ----------------------------------------------------*/}

                        <br></br>

                        {/*---------------------------------------------------------------------------------------------*/}
                        <Row>
                            <Col span={10} offset={7}>
                                <Card
                                    title={"Output"}
                                    bordered={true}
                                    style={{ width: "100%", float: "inline-start", marginBlockStart: "2%" }}
                                    id="outputCard"
                                >
                                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>X = {answer}</p>
                                </Card>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </Router>
        );
    }
}
export default Appc;