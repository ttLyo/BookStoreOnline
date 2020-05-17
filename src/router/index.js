import React from 'react'
//需要补充BrowserRouter,否则报错无法识别浏览器路径
import { BrowserRouter as Router,Route,Switch,} from 'react-router-dom'
import "axios"
import 'bootstrap/dist/css/bootstrap.min.css'


//添加组件
    //公共组建
import Navigator from '../pages/common/navigator' //左侧导航栏组件
import TopInfo from '../pages/common/topInfo' //顶部信息栏
    //路由组件
import home from '../pages/home/home'   //主页组件
import myProducts from '../pages/myProducts/myProducts'    //添加信息组件
import productsManage from '../pages/productsManage/productsManage'    
import orderManage from "../pages/orderManage/orderManage"

import { Provider } from 'react-redux'
import store from '../store'
 class RouteJs extends React.Component{
     constructor(){
         super()
         this.state = {
          loged:false,
          type:0
         }
         document.cookie=""
     }
     logIn(e){
         this.setState({loged:true,type:e})
     }
     logOut(){
         this.setState({loged:false,type:""})
        //  useHistory.push("/")
     }
    render(){
        var manage = this.state.loged?productsManage:home
        var manage1 = this.state.loged?orderManage:home
        return(
            <Provider store={store}>
                <Router>
                    <div className="componentWried">
                        <div  className="topInfo">
                            <TopInfo loged={this.state.loged} logIn={this.logIn.bind(this)} logOut={this.logOut.bind(this)} />
                        </div>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-2 left_nav">
                                    <Navigator userType={this.state.type} loged={this.state.loged} />                                
                                </div>
                                <div className="col-sm-10 right_cont">
                                    <div className="showComp">
                                        <Switch>
                                            <Route exact path="/" component={home} />
                                            <Route path="/myProducts" component={myProducts} />
                                            <Route path="/productsManage" component={manage} />
                                            <Route path="/orderManage" component={manage1} />
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    </div>
                </Router>
            </Provider>
            // </BaseUrl.Provider>
        )
    }
}

export default RouteJs