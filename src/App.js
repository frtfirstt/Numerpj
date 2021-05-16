import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Sider from 'antd/lib/layout/Sider';
import Layout, { Content } from 'antd/lib/layout/layout';
import Bisection from './code/Root of equation/Bisection';
import Falseposition from './code/Root of equation/False-position';
import Onepoint from './code/Root of equation/One-pointIteration';
import Newton from './code/Root of equation/Newtonraphson';
import Secant from './code/Root of equation/Secant';

import Cramerrule from './code/Linear/Cramerrule';
import GuassElimination from './code/Linear/GuassElimination';
import GuassJordan from './code/Linear/GuassJordan';
import LU from './code/Linear/LU';
import Cholesky from './code/Linear/Cholesky';
import Jacobi from './code/Linear/Jacobi';
import Conjugate from './code/Linear/Conjugate';

import Lagrange from './code/Interpolation/Lagrange';
import Spline from './code/Interpolation/Spline';

import LinearRegression from './code/Leastsqaures/LinearRegression';
import Multiple_LinearRegression from './code/Leastsqaures/Multiple_LinearRegression';
import PolynomialRegression from './code/Leastsqaures/PolynomialRegression';




const { SubMenu } = Menu;

class App extends React.Component {
  handleClick = e => {
    console.log('click ', e);
  };

  render() {
    return (
      <Router>
      <Layout>
      <Sider width={250}>
      <Menu
        onClick={this.handleClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
      <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Root of Eqaution">
          <Menu.Item key="5">Bisection <Link to="/bisection"></Link></Menu.Item>
          <Menu.Item key="6">False-position<Link to="/false-position"></Link></Menu.Item>
          <Menu.Item key="7">One-point Iteration<Link to="/onepoint"></Link></Menu.Item>
          <Menu.Item key="8">Newtonraphson<Link to="/Newton"></Link></Menu.Item>
          <Menu.Item key="9">Secant<Link to="/Secant"></Link></Menu.Item>

        </SubMenu>
        <SubMenu key="sub4" icon={<SettingOutlined />} title="Linear Equation">
          <Menu.Item key="10">Cramer's Rule<Link to="/Cramerrule"></Link></Menu.Item>
          <Menu.Item key="11">Guass Elimination<Link to="/GuassElimination"></Link></Menu.Item>
          <Menu.Item key="12">GuassJordan<Link to="/GuassJordan"></Link></Menu.Item>
          <Menu.Item key="13">LU<Link to="/LU"></Link></Menu.Item>
          <Menu.Item key="14">Cholesky<Link to="/Cholesky"></Link></Menu.Item>
          <Menu.Item key="15">Jacobi<Link to="/Jacobi"></Link></Menu.Item>
          {/* <Menu.Item key="16">Conjugate<Link to="/Conjugate"></Link></Menu.Item> */}
          
        </SubMenu>

        <SubMenu key="sub3" icon={<AppstoreOutlined />} title="Interpolation">
          {/* <Menu.Item key="17">Newton divided-differences<Link to="/bisection="></Link></Menu.Item> */}
          <Menu.Item key="18">Lagrange polynomials<Link to="/Lagrange"></Link></Menu.Item>
          <Menu.Item key="19">Spline interpolation<Link to="/Spline"></Link></Menu.Item>
        
        </SubMenu>

        <SubMenu key="sub5" icon={<AppstoreOutlined />} title="Least sqaures Regresstion">
          <Menu.Item key="20">Linear Regression<Link to="/LinearRegression"></Link></Menu.Item>
          <Menu.Item key="21">polynomials Regresstion<Link to="/PolynomialRegression"></Link></Menu.Item>
          {/* <Menu.Item key="22">Multiple Linear Regression<Link to="/Multiple_LinearRegression"></Link></Menu.Item> */}
        
        </SubMenu>
      </Menu>
      </Sider>
      <Layout>
        <Content>
          <Route path="/bisection" component={Bisection}></Route>  
          <Route path="/False-position" component={Falseposition}></Route>  
          <Route path="/onepoint" component={Onepoint}></Route>  
          <Route path="/Newton" component={Newton}></Route>  
          <Route path="/Secant" component={Secant}></Route>  
          <Route path="/Cramerrule" component={Cramerrule}></Route>  
          <Route path="/GuassElimination" component={GuassElimination}></Route>  
          <Route path="/GuassJordan" component={GuassJordan}></Route>  
          <Route path="/LU" component={LU}></Route>  
          <Route path="/Cholesky" component={Cholesky}></Route>  
          <Route path="/Jacobi" component={Jacobi}></Route>  
          {/* <Route path="/Conjugate" component={Conjugate}></Route>   */}
          <Route path="/Lagrange" component={Lagrange}></Route>  
          <Route path="/Spline" component={Spline}></Route>  
          <Route path="/LinearRegression" component={LinearRegression}></Route>  
          {/* <Route path="/Multiple_LinearRegression" component={Multiple_LinearRegression}></Route>   */}
          <Route path="/PolynomialRegression" component={PolynomialRegression}></Route>  
        </Content>
      </Layout>
      </Layout>
      </Router>
    );
  }
}


export default App;
