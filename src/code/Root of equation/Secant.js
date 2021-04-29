import React, { Component } from 'react'
import {Card, Input, Button, Table} from 'antd';
import { LineChart, Line ,XAxis,CartesianGrid,Tooltip,Legend,YAxis} from 'recharts';
import 'antd/dist/antd.css';
import {  compile } from 'mathjs';
import axios from 'axios';


const InputColor = {
    background: "",
    color: "#003a8c", 
    fontWeight: "bold", 
    fontSize: "24px",
    width: 300 ,
    height:50
    

};
var schedule = []
const table = [
    {
      title: "Iteration",
      dataIndex: "iteration",
      key: "iteration"
    },
    {
        title: "Xnew",
        dataIndex: "xnew",
        key: "xnew"
    },
    
    {
      title: "Error",
      dataIndex: "error",
      key: "error",
      
    }
  ];
  
class Secant extends Component {
    
    constructor() {
        super();
        this.state = {
            items: [],
            x0: 0,
            x1: 0,
            fx: "",
            showtable: false,
            showgraph: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.secant = this.secant.bind(this);
    }
    
    secant(x0, x1) {
        
        var x = [], xnew=0, epsilon = parseFloat(0.000000);
        var n=1, i=1;
        var array2d  = []
        array2d[0] = []//xnew
        array2d[1] = []//error
        x.push(x0);
        x.push(x1);
        array2d[0][0] = x0;
        array2d[1][0] = "---";

        do{ 
            xnew = x[i] - (this.func(x[i])*((x[i]-x[i-1])))/(this.func(x[i])-this.func(x[i-1]));
            x.push(xnew);
            epsilon = Math.abs((xnew-x[i]) / xnew);
            array2d[0][n]   =   xnew.toFixed(6);
            array2d[1][n] =   Math.abs(epsilon).toFixed(6);
            n++;  
            i++;

        }while(Math.abs(epsilon)>0.000001);
        
        


        for (var  j=1 ;  j< array2d[0].length ; j++) {
            schedule.push({
                iteration: j,
                xnew: array2d[0][j],
                error:  array2d[1][j]
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
    
    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
    dataapi = async()=>{
        var response = await axios.get('http://localhost:3000/secant').then(res => {return res.data});
        this.setState({
            fx:response['fx'],
            x0:response['x0'],
            x1:response['x1']
        })
        this.secant(this.state.x0,this.state.x1);
    }
    render() {
        return(
            <body style={{ background: "#ebe18d", padding: "90px" , float:"left" }}>
                <h2 style={{color: "#003a8c", fontWeight: "bold",fontSize: "35px",textAlign:"center"}}>Secant</h2>
                <div style={{textAlign:"center"}}>
                    <Card
                    bordered={true}
                    style={{ width: 1500 ,height:600, background: "#ebe18d", color: "#FFFFFFFF", float:"Auto"}}
                    onChange={this.handleChange}
                    >
                        <h2>f(x)</h2><Input size="large" name="fx" style={InputColor}></Input><br/><br/><br/><br/>
                        <h2>X<sub>0</sub></h2><Input size="large" name="x0" style={InputColor}></Input><br/><br/><br/><br/>
                        <h2>X<sub>1</sub></h2><Input size="large" name="x1" style={InputColor}></Input><br/><br/><br/><br/>
                        
                        <Button id="submit_button" onClick= {
                                ()=>this.secant(this.state.fx,parseFloat(this.state.x0), parseFloat(this.state.x1))
                            }  
                            style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}>GO</Button>&nbsp;&nbsp;&nbsp;&nbsp;

                        <Button id="submit_button" onClick= {
                                
                                ()=>this.dataapi()
                                
                        }  
                        style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}>API</Button>
                        
                    </Card>
                    
                    
                
                    {this.state.showtable && 
                        <Card
                        title={"Output"}
                        bordered={true}
                        style={{width: "100%", background: "#2196f3", color: "#FFFFFFFF", float:"inline-start", marginBlockStart:"2%"}}
                        id="outputCard"
                        >
                            <Table columns={table} dataSource={schedule} bodyStyle={{fontWeight: "bold", fontSize: "18px", color: "black"}}
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
export default Secant;