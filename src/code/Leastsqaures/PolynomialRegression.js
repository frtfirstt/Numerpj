import React, { Component } from 'react'
import {Card, Input, Button, Table} from 'antd';

import 'antd/dist/antd.css';
import {  squeeze,sum,lusolve } from 'mathjs';

const InputColor = {
    background: "",
    color: "#003a8c", 
    fontWeight: "bold", 
    fontSize: "24px",
    width: 300 ,
    height:50
};
var table = [
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

var x, y, tableinput, XMatrix, YMatrix, matrixA, matrixB, answer

class PolynomialRegression extends Component {
    
    constructor() {
        super();
        x = []
        y = []

        tableinput = []
        this.state = {

            Points: 0,
            m: 0,
            showinput: false,
            showbutton: false,
            showanswer: false
        }
        this.handleChange = this.handleChange.bind(this);
      
    
    }  
    createTableInput(n, m) {
        for (var i=1 ; i<=n ; i++) {
            x.push(<Input style={{
                width: "40%",
                height: "50%", 
                backgroundColor:"#003a8c", 
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                
            }}
            id={"x"+i} key={"x"+i} placeholder={"x"+i}/>);            
            y.push(<Input style={{
                width: "40%",
                height: "50%", 
                backgroundColor:"#003a8c", 
                
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"y"+i} key={"y"+i} placeholder={"y"+i}/>);
            tableinput.push({
                no: i,
                x: x[i-1],
                y: y[i-1]
            })

        }
        XMatrix = []
        YMatrix = []
        for (i=1 ; i<=m+1 ; i++) {
            XMatrix[i] = []
            for (var j=1 ; j<=m+1 ; j++) {
                XMatrix[i][j] = []
            }
        }        
    
        this.setState({
            
            showinput: true,
            showbutton: true
        })
    }
    Valueinarray(n, m) {
        x = []
        y = []
        for (var i=1 ; i<=n ; i++) {
          x[i]= parseFloat(document.getElementById("x"+i).value);    
  
        }  
        for (i=1 ; i<=n ; i++) {
            y[i] = parseFloat(document.getElementById("y"+i).value);
        }
    }
    PolynomialRegression(n, m) {
        var Powers = 1
        for (var i=1 ; i<=m+1 ; i++) {
            for (var j=1 ; j<=m+1 ; j++) {
               if (i===1 && j===1) {
                XMatrix[i][j] = n  
                    continue//ทำ j ตัวต่อไปเลย
               }
               XMatrix[i][j] = this.sumxpow(x, Powers)
               Powers++

            }
            Powers = i
        }  
        
        YMatrix[1] = sum(y)
        for (i=2 ; i<=m+1 ; i++) {
            YMatrix[i] = this.sumXpowY(x, y, i-1)
        }
        
        this.answerx(m)
        
    }
    answerx(m) {
        matrixA = []
        matrixB = []
        for (var i=0 ; i<m+1 ; i++) {
            matrixA[i] = []
            for (var j=0 ; j<m+1 ; j++) {

                matrixA[i][j] = XMatrix[i+1][j+1]
            }

            matrixB[i] = YMatrix[i+1]
        }

        answer = squeeze(lusolve(matrixA, matrixB))

        this.setState({
            showanswer: true
        })
    }
    sumxpow(A, Powers) {
        var sum = 0
        for (var i=1 ; i<A.length ; i++) {
            sum = sum+ Math.pow(A[i], Powers)
        }
        return sum       
    }
    sumXpowY(x, y, Powers) {
        var sum = 0
        for (var i=1 ; i<y.length ; i++) {
            sum = sum +  Math.pow(x[i], Powers) * y[i]
        }
        return sum
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        return(
            <body style={{ background: "#ebe18d", padding: "90px" , float:"left"}}>
                <h2 style={{color: "#003a8c", fontWeight: "bold",fontSize: "35px"}}>Polynomial Regression</h2>
                <div>
                <Card
                    
                    bordered={true}
                    style={{ width: 1500 ,height:600, background: "#ebe18d", color: "#FFFFFFFF", float:"Auto"}}
                    onChange={this.handleChange}
                    id="inputCard"
                    >
                        
                                <h2>Number of points(n)</h2><Input size="large" name="Points" style={InputColor}></Input><br/><br/><br/><br/>
                                <h2>Order(m)</h2><Input size="large" name="m" style={InputColor}></Input><br/><br/><br/>
                                <Button id="dimention_button" onClick= {
                                ()=> this.createTableInput(parseInt(this.state.Points), parseInt(this.state.m))}
                                style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}>
                                Submit<br></br>
                            </Button>
                                               
                        {this.state.showinput && 
                        <div><br></br>
                            <Table columns={table} dataSource={tableinput} pagination={false} bordered={true} bodyStyle={{fontWeight: "bold", fontSize: "18px", color: "white" , overflowY: "scroll", minWidth: 120, maxHeight: 300}}></Table>
                        </div>
                        }
                        <br></br>
                        
                        {this.state.showbutton && 
                            <Button 
                                id="matrix_button"  
                                style={{width: 150 , height:50,background: "#4caf50", color: "white", fontSize: "30px"}}
                                onClick= {()=>{this.Valueinarray(parseInt(this.state.Points), parseInt(this.state.m)); 
                                                this.PolynomialRegression(parseInt(this.state.Points), parseInt(this.state.m))}}
                                >
                                Submit

                                
                            </Button>
                        }
                        
                    </Card>
                    

                    {this.state.showanswer &&
                        <Card
                        title={"Output"}
                        bordered={true}
                        style={{ width: 800 ,height:800, background: "#40a9ff", color: "#FFFFFFFF", float:"Auto"}}
                        >
                            <p style={{fontSize: "24px", fontWeight: "bold"}}>x = {JSON.stringify(answer).replace(',', '\n')}</p> 
                        </Card>                        
                    }

                   
                </div>

                
            </body>
        );
    }
}
export default PolynomialRegression;