import React,{Component} from 'react'
// import Qs from "qs";
import util from "../../util"
import { message } from 'antd';

import $ from "jquery"

export default class TopInfo extends Component{
    constructor(props) {
      super(props);
      this.state = {
          ID:"123",
          Logname:"",
          Password:"123456",
          regID:"",
          regLogname:"",
          regPassword:"",
          checkPsword:"",
          gender:1,
          admin:0,
          reqTips:" "
      };
      
        document.cookie=""
    }
    componentDidMount(){
        // this.login()
    }
    changeAdmin=()=>{
        let temp = this.state.admin===0?1:0
        this.setState({
            admin:temp
        })
    }
    handleChange(e){
        let data = {reqTips:""}
        if((e.target.name==="checkPsword"||e.target.name==="regPassword")&&e.target.value!==this.state.regPassword){
            data.reqTips="两次输入密码不一致"
        }
        data[e.target.name] = e.target.value
        this.setState(data)
    }
    register(){
        let regID = this.state.regID;
        let name = this.state.regLogname;
        let psword = this.state.regPassword;
        const data={
            ID:parseInt(this.state.regID) ,
            Logname:this.state.regLogname,
            Password:this.state.regPassword,
            Email:"def",
            Gender:1, 
            Selfinfo:"def",
            Admin:this.state.admin
        }
        //将数据对象转化为表单格式
        let form = new URLSearchParams()
        for(let i in data){
            form.append(i,data[i])
        }
        //使用封装好的util工具函数发出请求 
        util.axios.post("/register",form).then((res)=>{
            //错误处理
            if(res.status===400){
                message.warning(res.data.message)
                return
            }
            //成功则清空表单并自动登录
            this.setState({
                ID:regID,
                Password:psword,
                Logname:name,
                regLogname:"",
                regPassword:"",
                checkPsword:"",
            })
            this.login()
            //隐藏弹窗
            $('#loginModal').modal('hide')
        })
    }
    login(){
        const data={
            ID:this.state.ID,
            Password:this.state.Password
        }
        let form = new URLSearchParams()
        for(let i in data){
            form.append(i,data[i])
        }
        util.axios.post("/login",form).then((res)=>{
            if(res.status===400){
                message.error(res.data.message)
                setTimeout(() => {
                    $('#loginModal').modal('show')
                }, 1100);
                
                return
            }
            document.cookie=res.data.Token
            this.setState({
                Logname:"",
                Password:"",})
            this.props.logIn(res.data.admin)
        })
    }
    logOut(){
        this.setState({
            Password:"",
        })
        this.props.logOut()
    }
    check_form(){
        return (this.state.ID===''||this.state.Password==='')?'disabled':''
    }
    check_form_reg(){
        if(this.state.regLogname===''||this.state.regPassword==='')return 'disabled'
        if(this.state.regPassword!==this.state.checkPsword)return 'disabled'
        return ''
    }
    render(){
        let log_btn = <button 
            className="btn btn_item btn_show_login btn-primary" 
            data-toggle="modal" 
            data-target="#loginModal">登录</button>

        let welcome = <div className="btn-group btn_show_login">
            <button type="button" className="btn btn_item btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              欢迎您，{this.state.ID}
            </button>
            <div className="dropdown-menu">
              <a className="dropdown-item" onClick={this.logOut.bind(this)} href="/">退出登录</a>
            </div>
          </div>
        return(
            <div>
                {/* <p>网上书店</p> */}
                书屋
                {
                    this.props.loged?welcome:log_btn
                }
                {/* 登录弹窗 */}
                <div className="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal_content modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title login_modal_head" id="myModalLabel">登录</h6>
                            {/* <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button> */}
                        </div>
                        <div className="login_modal_body modal-body">
                            <div className="input-group mb-3">
                                <input type="text" 
                                className="login_input form-control" 
                                placeholder="输入登录ID" 
                                value={this.state.ID}
                                onChange={this.handleChange.bind(this)}
                                name="ID" aria-describedby="basic-addon1"/>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" 
                                className="login_input form-control" 
                                placeholder="Password" 
                                value={this.state.Password}
                                onChange={this.handleChange.bind(this)}
                                name="Password" aria-describedby="basic-addon1"/>
                            </div>
                            <button 
                            type="button" data-dismiss="modal"
                            className="btn btn-block btn-primary"
                            disabled={this.check_form.call(this)}
                            onClick={this.login.bind(this)}>登录</button>
                            <button style={{float:'right'}}
                             type="button"
                            className="btn btn-link"
                            data-toggle="modal" 
                            data-target="#registerModal">前往注册</button>
                            
                        </div>
                        </div>
                    </div>
                </div>
                {/* 注册弹窗 */}
                <div className="modal fade" id="registerModal" tabIndex="1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal_content modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title login_modal_head" id="myModalLabel">注册</h6>
                            {/* <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button> */}
                        </div>
                        <div className="login_modal_body modal-body">
                            <div className="input-group mb-3">
                                <input type="text" 
                                className="login_input form-control" 
                                placeholder="输入登录ID" 
                                value={this.state.regID}
                                onChange={this.handleChange.bind(this)}
                                name="regID" aria-describedby="basic-addon1"/>
                            </div>
                            <div className="input-group mb-3">
                                <input type="text" 
                                className="login_input form-control" 
                                placeholder="输入昵称" 
                                value={this.state.regLogname}
                                onChange={this.handleChange.bind(this)}
                                name="regLogname" aria-describedby="basic-addon1"/>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" 
                                className="login_input form-control" 
                                placeholder="输入密码" 
                                value={this.state.regPassword}
                                onChange={this.handleChange.bind(this)}
                                name="regPassword" aria-describedby="basic-addon1"/>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" 
                                className="login_input form-control" 
                                placeholder="确认密码" 
                                value={this.state.checkPsword}
                                onChange={this.handleChange.bind(this)}
                                name="checkPsword" aria-describedby="basic-addon1"/>
                            </div>
                            <p className="reqTips">{this.state.reqTips}</p>
                            <div className="form-check" style={{textAlign:"center"}}>
                            <input className="form-check-input" type="checkbox" 
                            name="admin"
                            value="admin" id="defaultCheck1"
                            onChange={this.changeAdmin} />
                            <label className="form-check-label" htmlFor="defaultCheck1">
                                是否管理员
                            </label>
                            </div>
                            <button 
                            type="button" data-dismiss="modal"
                            className="btn btn-block btn-primary"
                            disabled={this.check_form_reg.call(this)}
                            onClick={this.register.bind(this)}>注册</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
} 