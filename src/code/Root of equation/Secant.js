import React, { Component } from 'react'
import {Card, Input, Button, Table} from 'antd';
import { LineChart, Line ,XAxis,CartesianGrid,Tooltip,Legend,YAxis} from 'recharts';
import 'antd/dist/antd.css';
import {  compile } from 'mathjs';
import axios from 'axios';

var api;
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
        var x = [], xnew  = 0, epsilon = parseFloat(0.000000);
        var n = 1, i = 1;
        var data = []
        data['xnew'] = []
        data['error'] = []
        x.push(x0);
        x.push(x1);
        data['xnew'][0] = x0;
        data['error'][0] = "---";

        do {
            xnew  = x[i] - (this.func(this.state.fx,x[i]) *(x[i]-x[i-1])) / (this.func(this.state.fx, x[i]) - this.func(this.state.fx, x[i-1]));
            x.push(xnew );
            epsilon = Math.abs((xnew-x[i]) / xnew);
            data['xnew'][n] = xnew.toFixed(8);
            data['error'][n] = Math.abs(epsilon).toFixed(8);
            n++;
            i++;

        } while (Math.abs(epsilon) > 0.000001);
        console.log(data['xnew'])
        this.createTable(data['xnew'], data['error']);
        this.setState({
            showtable: true,
            showgraph: true
        })


    }
    createTable(y, error) {
        schedule = []
        console.log(y)
        for (var i = 0; i < y.length; i++) {
            schedule.push({
                key:i,
                iteration: i + 1,
                y: y[i],
                error: error[i]
            });
        }

    }
    func = (fx, X) => {
        var expr = compile(fx); // f(x)
        let scope = { x: parseFloat(X) }; //f(x) ; x=input
        return expr.evaluate(scope);
    }
    
    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
    async dataapi() {
        await axios({method: "get",url: "http://localhost:5000/data/secant",}).then((response) => {console.log("response: ", response.data);api = response.data;});
        await this.setState({
            fx:api.fx,
            x0:api.x0,
            x1:api.x1
        })
        this.secant(this.state.x0,this.state.x1)
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
                        <h2>f(x)</h2><Input size="large" name="fx" value={this.state.fx} style={InputColor}></Input><br/><br/><br/><br/>
                        <h2>X<sub>0</sub></h2><Input size="large" name="x0" value={this.state.x0} style={InputColor}></Input><br/><br/><br/><br/>
                        <h2>X<sub>1</sub></h2><Input size="large" name="x1" value={this.state.x1} style={InputColor}></Input><br/><br/><br/><br/>
                        
                        <Button id="submit_button" onClick= {
                                ()=>this.secant(parseFloat(this.state.x0), parseFloat(this.state.x1))
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