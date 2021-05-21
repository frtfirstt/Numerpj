import React, { Component } from 'react'
import {Card, Input, Button, Table} from 'antd';
import 'antd/dist/antd.css';
import {  sum,inv,multiply } from 'mathjs';
import axios from 'axios';
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    LineChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
  } from 'recharts';
  
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
var schedule = []
var schedule2= []
var x, y, tableinput, answer

class LinearRegression extends Component {
    
    constructor() {
        super();
        x = []
        y = []

        tableinput = []
        this.state = {
            Points: 0,
            m: 0,
            showinput: false, //table
            showbutton: false, //sub2
            showAnswer: false,
            showgraph : false
        }
        this.handleChange = this.handleChange.bind(this);
      
    
    }  
    createTableInput(n) {
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
    
        this.setState({
            
            showinput: true,
            showbutton: true
        })
    }
    Valueinarray(n) {
        x = []
        y = []
        for (var i=1 ; i<=n ; i++) {
          x[i]= parseInt(document.getElementById("x"+i).value);    
  
        }  
        for (i=1 ; i<=n ; i++) {
            y[i] = parseFloat(document.getElementById("y"+i).value);
        }
        // for (i=1 ; i<=n ; i++) {
        //     schedule.push({x:x[i],y:y[i]})
        // }
       
    }
    LinearRegression(n) {
        var Xmatrix = [2], Ymatrix = [2]
        for (var i=0 ; i<2 ; i++) {
            Xmatrix[i] = []
            for (var j=0 ;  j<2 ; j++) {

                if (i===0 && j===0) {
                    Xmatrix[i][j] = n
                }
                else if (i===0 && j===1){
                    Xmatrix[i][j] = this.sumxpow(x, 1)
                }
                else if (i===1 && j===0){
                    Xmatrix[i][j] = this.sumxpow(x, 1)
                }
                else {
                    Xmatrix[i][j] = this.sumxpow(x, 2)
                }
            }
            
        }
        Ymatrix[0] = sum(y)
        Ymatrix[1] = this.sumXY(x, y)
        Xmatrix = inv(Xmatrix)
        answer = JSON.stringify(multiply(Xmatrix, Ymatrix)) //arr string
        console.log(answer)
        var ans2=multiply(Xmatrix, Ymatrix)
        for(var i=1;i<x.length;i++){
            schedule2.push({
                x:x[i],
                y:y[i],
                ans:ans2[0]+(ans2[1]*x[i])})
                
        }
        console.log(schedule2)
       
        
        
        

        this.setState({
            showAnswer: true,
            showgraph : true
        })
         
    }
    sumxpow(A ,Powers) {
        var sum = 0
        for (var i=1 ; i<A.length ; i++) {
            sum = sum + Math.pow(A[i], Powers)
            
        }
        return sum       
    }
    sumXY(A, B) {
        var sum = 0
        for (var i=1 ; i<A.length ; i++) {
            sum = sum + A[i]*B[i]
            
        }
        return sum
    }

    async dataapi() {
        await axios({method: "get",url: "http://localhost:5000/data/linear",}).then((response) => {console.log("response: ", response.data);api = response.data;});
        await this.setState({
        Points:api.numberpoint,
          X:api.xfind
          
        })
        this.createTableInput(parseInt(this.state.Points))
        for (var i = 0; i < this.state.Points; i++) {
            document.getElementById("x" + (i + 1)).value = api.arrayX[i];
            document.getElementById("y" + (i + 1)).value = api.arrayY[i];
        }
        this.Valueinarray(parseInt(this.state.Points))
        this.LinearRegression(parseInt(this.state.Points))
      }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        return(
            <body style={{ background: "#ebe18d", padding: "90px" , float:"left"}}>
                <h2 style={{color: "#003a8c", fontWeight: "bold",fontSize: "35px",textAlign:"center"}}>Linear Regression</h2>
                <div style={{textAlign:"center"}}>
                    <Card
                      bordered={true}
                      style={{ width: "100%" ,height:600, background: "#ebe18d", color: "#FFFFFFFF", float:"Auto"}}
                        onChange={this.handleChange}
                      id="inputCard"
                    >
                        
                        <h2>Number of points(n)</h2><Input size="large" name="Points" style={InputColor}></Input><br/><br/>
                        <Button id="dimention_button" onClick= {
                                ()=> this.createTableInput(parseInt(this.state.Points))}
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
                                onClick= {()=> {this.Valueinarray(parseInt(this.state.Points)); 
                                                this.LinearRegression(parseInt(this.state.Points))}}
                                >
                                Submit
                            </Button>
                        }
                        <Button id="submit_button" onClick= {
                                
                                ()=>this.dataapi()
                        }  
                        style={{width: 100 , height:50,background: "#003a8c", color: "white", fontSize: "25px"}}>API</Button>
                        
                    </Card>
                    
                    
                    

                   
                </div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <div>
                    {this.state.showAnswer &&
                        <Card
                        title={"Output"}
                        bordered={true}
                        style={{ width: 700 ,height:600, background: "#40a9ff", color: "#FFFFFFFF", float:"Auto"}}
                        >
                            <p style={{fontSize: "24px", fontWeight: "bold"}}>x = {JSON.stringify(answer)}</p> 
                        </Card>                        
                    }
                    </div>

                    
                       {this.state.showgraph &&
                        <LineChart width={760} height={280} data={schedule2}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="x" />
                        <YAxis dataKey="y"/>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Line name="y=a0+(a1*x)" type="monotone" dataKey="ans" stroke="#ff7300" />
                        <Line name="y" type="monotone" dataKey="y" stroke="#8884d8" />
                    </LineChart>                      
                    }
                
               
                    
            </body>
        );
    }
}
export default LinearRegression;