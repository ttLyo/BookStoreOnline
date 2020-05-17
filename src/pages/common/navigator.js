import React from 'react'

import { Link,withRouter } from 'react-router-dom'

//导入导航栏内容
// import navCont from './navCont'

 class Nav extends React.Component{
    //  constructor(props){
    //      super(props)
    //  }
    get_class_name(){
        return this.props.history.location.pathname
    }
    render(){
        return(
            <ul className="nav nav-pills">
            {/*循环导航栏
                *不可以嵌套Router标签   
            */}            
                <li className={this.get_class_name() === '/' ? 'active' : ''} role="presentation">
                    <Link className="liBtn" to='/'>所有图书</Link>
                </li>
                {this.props.loged&&
                <li className={this.get_class_name() === '/myProducts' ? 'active' : ''} role="presentation">
                    <Link className="liBtn" to='/myProducts'>我的订单</Link>
                </li>}
                {this.props.userType===1&&
                    <li className={this.get_class_name() === '/productsManage' ? 'active' : ''} role="presentation">
                        <Link className="liBtn" to='/productsManage'>书籍管理</Link>
                    </li>
                }
                {this.props.userType===1&&
                    <li className={this.get_class_name() === '/orderManage' ? 'active' : ''} role="presentation">
                        <Link className="liBtn" to='orderManage'>订单管理</Link>
                    </li>
                }
            </ul>
        )
    }

}
//通过withRouter给Nav组件注入路由信息
Nav = withRouter(Nav);
export default Nav;