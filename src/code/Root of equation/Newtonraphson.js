import React, { Component } from 'react'
import {Card, Input, Button, Table} from 'antd';

import { LineChart, Line ,XAxis,CartesianGrid,Tooltip,Legend,YAxis} from 'recharts';
import 'antd/dist/antd.css';
import {  compile ,derivative} from 'mathjs';
import axios from 'axios';

const InputColor = {
    background: "",
    color: "#003a8c", 
    fontWeight: "bold", 
    fontSize: "24px",
    width: 300 ,
    height:50
    

};
var schedule=[];
const table = [
    {
      title: "Iteration",
      dataIndex: "iteration",
      key: "iteration"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Error",
        dataIndex: "error",
        key: "error",
    }
];
  
class Newton extends Component {
    
    constructor() {
        super();
        this.state = {
            
            x0: 0,
            fx: "",
            showtable: false,
            showgraph: false
        }

        this.handleChange = this.handleChange.bind(this);

        this.newton_raphson = this.newton_raphson.bind(this);


    }

    newton_raphson(xold) {
        
        var xnew = 0;
        var n=0;
        var Epsilon= parseFloat(0.000000);
        var array2d  = []

        array2d[0] = []//x
        array2d[1] = []//error

        do{ 
            xnew = xold - (this.funcDiff(xold)/this.funcDiff(xold));
            Epsilon = Math.abs((xnew-xold) / xnew);
            array2d[0][n] =  xnew.toFixed(6);
            array2d[1][n] = Math.abs(Epsilon).toFixed(6);
            n++;  
            xold = xnew;

        }while(Math.abs(Epsilon)>0.000001);

        
        
        for (var i=0 ; i<array2d[0].length ; i++) {
            schedule.push({
                iteration: i+1,
                x: array2d[0][i],
                error: array2d[1][i]
            });
        }
        
        this.setState({
            showtable: true,
            showgraph: true
        })

        
    }
    func(datastr) {
        
        var comfunc = compile(this.state.fx)
        let data = {x:parseFloat(datastr)}

        return comfunc.evaluate(data)       
    }

    funcDiff(datastr) {
        var comfunc = derivative(this.state.fx);
        
        let data = {x:parseFloat(datastr)};
        return comfunc.evaluate(data); 
    }
    
    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    dataapi = async()=>{
        var response = await axios.get('http://localhost:3000/newtonraphson').then(res => {return res.data});
        this.setState({
            fx:response['fx'],
            x0:response['x0'],
            
        })
        this.newton_raphson(this.state.x0);
    }
    render() {
        return(
            <body style={{ background: "#ebe18d", padding: "90px" , float:"left" }}>
                <h2 style={{color: "#003a8c", fontWeight: "bold",fontSize: "35px",textAlign:"center"}}>Newton Paphson</h2>
                <div style={{textAlign:"center"}}>
                    <Card
                    
                    bordered={true}
                    style={{ width: 1500 ,height:600, background: "#ebe18d", color: "#FFFFFFFF", float:"Auto"}}
                    onChange={this.handleChange}
                    >
                        <h2>f(x)</h2><Input size="large" name="fx" style={InputColor}></Input><br/><br/><br/><br/>
                        <h2>X<sub>0</sub></h2><Input size="large" name="x0" style={InputColor}></Input><br/><br/><br/><br/>
                        <Button id="submit_button" onClick= {
                                ()=>this.newton_raphson(parseFloat(this.state.x0))
                            }  
                            style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}>GO</Button>&nbsp;&nbsp;&nbsp;&nbsp;

                        <Button id="submit_button" onClick= {
                                
                                ()=>this.dataapi()
                        }  
                        style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}>API</Button>
                        
                    </Card>
                     
                    {this.state.showtable&& 
                        <Card
                        title={"Output"}
                        bordered={true}
                        style={{width: "100%", background: "#2196f3", color: "#FFFFFFFF", float:"inline-start", marginBlockStart:"2%"}}
                        id="outputCard"
                        >
                            <Table columns={table} bordered={true} dataSource={schedule} bodyStyle={{fontWeight: "bold", fontSize: "18px", color: "black"}}
                            ></Table>
                        </Card>
                    } 
                    {this.state.showgraph &&
                        <LineChart width={730} height={250} data={schedule}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="error" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Line name="error" type="monotone" dataKey="error" stroke="#8884d8" />
                    </LineChart>                    
                    }                   
                </div>

                
            </body>
        );
    }
}
export default Newton;