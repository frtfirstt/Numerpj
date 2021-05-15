import React, { Component } from 'react'
import {Card, Input, Button, Table, AutoComplete} from 'antd';

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


const table = [
    {
      title: "Iteration",
      dataIndex: "iteration",
      key: "iteration"
    },
    {
      title: "XL",
      dataIndex: "xl",
      key: "xl"
    },
    {
      title: "XR",
      dataIndex: "xr",
      key: "xr"
    },
    {
      title: "XM",
      dataIndex: "xm",
      key: "xm"
    },
    {
      title: "Error",
      dataIndex: "error",
      key: "error",
      
    }
  ];

  var schedule = []

class Bisection extends Component {
    
    constructor() {
        super();
        this.state = {
            items: [],
            xl: 0,
            xr: 0,
            fx: "",
            showtable : false,
            showgraph: false,
            inputs:true
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.bisection = this.bisection.bind(this);
    }

    
    bisection(xl, xr) {
        
        
        var Epsilon= parseFloat(0.000000);
        var k=0;
        var xm = 0;
        var array2d  = []
        array2d[0] = []//XL
        array2d[1] = []//XR
        array2d[2] = []//XM
        array2d[3] = []//ERROR
        

        do{ 
            xm = (xl + xr) / 2;
            if (this.func(xm)*this.func(xr) < 0) { 
                Epsilon = Math.abs((xm-xr) / xm);
             
                xl = xm;
            } 
            else {
                
                Epsilon = Math.abs((xm-xr) / xm);
         
                xr = xm;
            }      
            

            array2d[0][k]  =   xl;
            array2d[1][k]  =   xr;
            array2d[2][k]  =  xm.toFixed(6);
            array2d[3][k]  = Math.abs(Epsilon).toFixed(6);
            k++;  
            
        }while(Math.abs(Epsilon)>0.000001);
        
        //เก็บเข้าไปใน schedule = [] เพื่อนำข้อมูลไปสร้างตาราง
        for (var i=0 ; i<array2d[0].length ; i++) {
            schedule.push({
                iteration: i+1,
                xl: array2d[0][i],
                xr: array2d[1][i],
                xm: array2d[2][i],
                error: array2d[3][i]
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
    } //การเอาค่าไปแทนในฟังก์ชั่น

    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });

    }

    
    // dataapi = async()=>{
    //         var response = await axios.get('http://localhost:3000/bisec').then(res => {return res.data});
    //         console.log(response)
    //         this.setState({
    //             fx:response['fx'],
    //             xl:response['xl'],
    //             xr:response['xr']
    //         })
            
    //         this.bisection(this.state.xl,this.state.xr);
            
    //     }
        async dataapi() {
            await axios({method: "get",url: "http://localhost:5000/database/bisection",}).then((response) => {console.log("response: ", response.data);api = response.data;});
            await this.setState({
                fx:api.fx,
              xl:api.xl,
              xr:api.xr
            })
            this.bisection(this.state.xl,this.state.xr)
          }
    render() {
        
        return(
            
            <body style={{ background: "#ebe18d", padding: "90px" , float:"left",}}>
            <h2 style={{color: "#003a8c", fontWeight: "bold",fontSize: "35px",textAlign:"center"}}>Bisection</h2>
                <div style={{textAlign:"center"}}>
                    <Card
                    
                    bordered={true}
                    style={{ width: 1500 ,height:600, background: "#ebe18d", color: "#FFFFFFFF", float:"Auto"}}
                    onChange={this.handleChange}
                    id="inputCard"
                    >
                        
                        <h2>f(x)</h2>{this.state.inputs &&<Input size="large" name="fx" value={this.state.fx} id ="fx" style={InputColor}></Input>}<br/><br/><br/><br/>
                        <h2>X<sub>L</sub></h2>{this.state.inputs &&<Input size="large" name="xl"value={this.state.xl} id ="xl" style={InputColor}></Input>}<br/><br/><br/><br/>
                        <h2>X<sub>R</sub></h2>{this.state.inputs &&<Input size="large" name="xr"value={this.state.xr} id ="xr" style={InputColor}></Input>}<br/><br/><br/><br/>
                        
                        <Button id="submit_button" onClick= {

                                ()=>this.bisection(parseFloat(this.state.xl), parseFloat(this.state.xr))
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
                            <Table columns={table} dataSource={schedule}  bodyStyle={{background: "#65b7f3",fontWeight: "bold", fontSize: "18px", color: "black"}}
                            ></Table>
                        
                        </Card>
                    
                    }
                    
                    {this.state.showgraph &&
                        <LineChart width={760} height={280} data={schedule}
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
            </body >
        );
    }
}

export default Bisection;
