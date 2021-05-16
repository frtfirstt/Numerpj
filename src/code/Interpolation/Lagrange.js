import React, { Component } from 'react'
import {Card, Input, Button, Table} from 'antd';
import axios from 'axios';
import 'antd/dist/antd.css';
const InputColor = {
    background: "",
    color: "#003a8c", 
    fontWeight: "bold", 
    fontSize: "24px",
    width: 300 ,
    height:50
    

};
var api
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
var x, y, schedul,  fx

class Lagrange extends Component {
    
    constructor() {
        super();
        x = []
        y = []
        
        schedul = []
        this.state = {
            
            interpolatePoint: 0,
            showMatrix : true,
            showButton: true,
            showMatrixinput: false,
            showMatrixButton: false,
            showanswer: false,
            Point: 0,
            X: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.lagrange = this.lagrange.bind(this);
    
    }  
    createTableInput(n) {
        for (var i=1 ; i<=n ; i++) {
            x.push(<Input style={{

                width: "100%",
                height: "50%", 
                backgroundColor:"#003a8c", 
                
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }}
            id={"x"+i} key={"x"+i} placeholder={"x"+i}/>);
            y.push(<Input style={{

                width: "100%",
                height: "50%", 
                backgroundColor:"#003a8c", 
                
                color: "white",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"y"+i} key={"y"+i} placeholder={"y"+i}/>);   
            schedul.push({
                no: i,
                x: x[i-1],
                y: y[i-1]
            });
        }


        this.setState({
            showMatrix : false,
            showButton : false,
            showMatrixinput : true,
            showTableButton : true
        })
    }
    
    datainValue() {
        for (var i=1 ; i<=this.state.Point ; i++) {
            x[i] = parseFloat(document.getElementById("x"+i).value);
            
            y[i] = parseFloat(document.getElementById("y"+i).value);
        }
    }
    llagrangeI(X, nn, n) {
        var fraction1 = 1;
        var fraction2 = 1;
        for (var i=1 ; i<=n ; i++) {
            if (i !== nn) {
                fraction1 =fraction1 * (x[i]-X);

                fraction2 = fraction2 *(x[i] - x[nn]);
            }
            // console.log(x[i])
            // console.log(fraction2)
        } 
        
        return parseFloat(fraction1/fraction2);
    }

    lagrange(n, X) {
        fx = 0
        this.datainValue()
        console.log(n)
        console.log(X)
        for (var i=1 ; i<=n ; i++) {
            fx =fx + this.llagrangeI(X, i, n)*y[i];
            
        }
        
        this.setState({
            showanswer: true
        })

    } 


    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async dataapi() {
        await axios({method: "get",url: "http://localhost:5000/data/lagrange",}).then((response) => {console.log("response: ", response.data);api = response.data;});
        await this.setState({
        Point:api.numberpoint,
          X:api.xfind,
          interpolatePoint:api.interpolateinput,
          x:api.arrayX,
          y:api.arrayY
          
        })
        this.createTableInput(this.state.Point)
        for (var i = 0; i < this.state.Point; i++) {
            document.getElementById("x" + (i + 1)).value = api.arrayX[i];
            document.getElementById("y" + (i + 1)).value = api.arrayY[i];
        }
        this.lagrange(parseInt(this.state.interpolatePoint), parseFloat(this.state.X))
      }

    render() {
        return(
            <body style={{ background: "#ebe18d", padding: "90px" , float:"left"}}>
                     <h2 style={{color: "#003a8c", fontWeight: "bold",fontSize: "35px",textAlign:"center"}}>Lagrange</h2>
                <div style={{textAlign:"center"}}>
                    <Card
                      bordered={true}
                      style={{ width: 1500 ,height:600, background: "#ebe18d", color: "#FFFFFFFF", float:"Auto"}}
                      onChange={this.handleChange}
                      id="inputCard"
                    >
                        {this.state.showMatrixinput && 
                        <div>
                            <Table columns={table} dataSource={schedul} pagination={false} bordered={true} bodyStyle={{fontWeight: "bold", fontSize: "18px", color: "white" , overflowY: "scroll", minWidth: 120, maxHeight: 300}}></Table>
                            
                        </div>}
                        
                        {this.state.showMatrix && 
                            <div>
                                <h2>Number of points(n)</h2><Input size="large" name="Point" style={InputColor}></Input><br/><br/>
                                <h2>X</h2><Input size="large" name="X" style={InputColor}></Input><br/><br/>
                                <h2>interpolatePoint</h2><Input size="large" name="interpolatePoint" style={InputColor}></Input><br/>
                            </div> 
                        }
                        <br></br>
                        {this.state.showButton && 
                            <Button id="dimention_button" onClick= {
                                ()=>{this.createTableInput(parseInt(this.state.Point));
                                }
                            }  
                            style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}>GO</Button>
                            
                        }
                        {this.state.showTableButton && 
                            <Button 
                                id="matrix_button"  
                                style={{width: 150 , height:50,background: "#4caf50", color: "white", fontSize: "30px"}}
                                onClick={()=>this.lagrange(parseInt(this.state.interpolatePoint), parseFloat(this.state.X))}>
                                Submit
                            </Button>
                        }
                        <Button id="submit_button" onClick= {
                                
                                ()=>this.dataapi()
                        }  
                        style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}>API</Button>
                        
                    </Card>
                    
                    

                    {this.state.showanswer &&
                        <Card
                        title={"Output"}
                        bordered={true}
                        style={{width: 700 ,height:600, background: "#40a9ff", color: "#FFFFFFFF", float:"Auto"}}
                        >
                        <p style={{fontSize: "24px", fontWeight: "bold"}}>{fx}</p>
                            
                        </Card>                        
                    }

                   
                </div>

                
            </body>
        );
    }
}

export default Lagrange;
