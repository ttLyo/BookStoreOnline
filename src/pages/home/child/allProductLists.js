import React from 'react'

// import AllProductsJson from './allProductJson'
import '../../common/Product.css'
import tvImg from '../../../images/tv.jpg'
import util from "../../../util"
import {message} from "antd"

import $ from 'jquery'
import 'bootstrap/dist/js/bootstrap'
import './modal.css'

export default class ProductLists extends React.Component{
    constructor(...args){
        super(...args)

        this.state = {
            clickIdx:0,
            pro_count:1,            
            idx_pro_info:[],
            warning_text:'',
            logText:"",
            pro_price:0,
        }    
    }
    //给模态框添加相应的产品信息
    addProInModal(e){
        // console.log(e)
        let idx = e.target.getAttribute('data-idx');
        // console.log(this.state.clickIdx)
        let idx_pro_info = this.props.products[idx]
        // console.log(idx_pro_info)
        this.setState({
            idx_pro_info,
            pro_price:idx_pro_info.price,
            pro_count:1,//每次打开模拟框初始化数量
        })
    }
    //增加数量
    pro_add(){
        // const that = this;
        let count = this.state.pro_count;
        //如果超过5个 出现提示
        if(count < 5){
            this.setState({
                pro_count:++count,
                warning_text:'',
            },function(){
                this.pro_price(this.state.pro_count,this.state.idx_pro_info.price) //计算价格
            })
        }
        else{
            this.setState({
                pro_count:5,
                warning_text:'不能超过五个哦'
            })
        }
    }

    //减少数量
    pro_minus(){
        const that = this;        
        let count = this.state.pro_count;
        
        //如果低于1个 出现提示
        if(count > 1){
            that.setState({
                pro_count:--count,
                warning_text:'',
            },function(){
                this.pro_price(this.state.pro_count,this.state.idx_pro_info.price) //计算价格                
            })
        }
        else{
            this.setState({
                pro_count:1,
                warning_text:'不能低于一个哦'
            })
        }
    }

    //计算价格
    pro_price(count,price){
        let pro_price = count * price;
        console.log(pro_price)
        this.setState({
            pro_price:pro_price
        })
    }

    //数据传回父级
    onSubmitChild(e){
        // let idx = e.target.getAttribute('data-idx');
        // let idx_pro_name = this.state.idx_pro_info.name;
        // let idx_pro_price = this.state.pro_price;
        // let idx_pro_count = this.state.pro_count;
        
        // this.props.onSubmitData({
        //     pro_name:idx_pro_name,
        //     pro_price:idx_pro_price,
        //     pro_count:idx_pro_count,
        // })
        if(document.cookie===""){
           this.setState({
            logText:"您未登录"
           })
            return
        }
        let form = new URLSearchParams()    
        console.log("ProductLists -> onSubmitChild -> this.state.idx_pro_info", this.state.idx_pro_info)
        form.append("BookID",this.state.idx_pro_info.id)
        form.append("BookNum",this.state.pro_count)
        util.axios.post("/addOrder",form)
        .then(res=>{
            console.log("ProductLists -> onSubmitChild -> res", res)
            if(res.status===400){
                alert(res.data.message)
                return
            }
            message.success("成功")
            // this.setState({Products:res.data.BookList})
        })
        //隐藏
        $('#myModal').modal('hide')
    }

    render(){
        // let loged = this.props.loged;
        return(
            <ul >
                {
                    this.props.products.map((item,i) =>
                        <li key={i} className="productLi right_li">
                            <div className="img_">
                                <img alt="" src={item.pictureUrl===''?tvImg:item.pictureUrl} className="productImg" /> 
                            </div>
                            <div className="productCont">
                                <p className="pro_name">{item.name}</p>
                                <p className="pro_desc">{item.content}</p>
                                <button 
                                data-idx={i} 
                                data-toggle="modal" 
                                data-target="#myModal" 
                                onClick={this.addProInModal.bind(this)}
                                className="btn btn_item btn-block btn-danger" >
                                    ￥{item.price}
                                </button>

                                {/* <div className="contLeft"> 
                                    <p className="pro_name">{item.name}</p>
                                    <span className="pro_desc">{item.description}</span>
                                </div>

                                <div className="contRight">
                                    <p className="price">￥{item.price}</p>
                                    <button className="btn btn-danger" data-idx={i} data-toggle="modal" data-target="#myModal" onClick={this.addProInModal.bind(this)}>￥{item.price}</button>
                                </div> */}
                                <div style={{clear:'both'}}></div>
                            </div>
                        </li>
                    )
                }

                {/*bootstrap弹框样式*/}
                <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <form id="saveChangeForm">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h6 className="modal-title" id="myModalLabel">加入购物车</h6>
                                </div>
                                <div className="modal-body modal_body">
                                    <div>
                                    <img alt="" src={this.state.idx_pro_info.pictureUrl===''?tvImg:this.state.idx_pro_info.pictureUrl} className="productImg_modal" /> 
                                    </div>
                                    <div className="productCont_modal">
                                        <div className="contLeft">
                                            <h4 className="name">{this.state.idx_pro_info.name} </h4>
                                            <span className="category">[{this.state.idx_pro_info.publishName}] </span>
                                            <span className="author">{this.state.idx_pro_info.author}</span>
                                        </div>

                                        <div className="contRight">
                                            <p className="price">￥{this.state.pro_price}</p>
                                            <p className="countBtn">
                                                <span className="count_warning">{this.state.warning_text}</span>
                                                <span className="minus" onClick={this.pro_minus.bind(this)}>-</span>
                                                <span className="count">{this.state.pro_count}</span>
                                                <span className="add" onClick={this.pro_add.bind(this)}>+</span>
                                            </p>
                                        </div>
                                        <div className="content">{this.state.idx_pro_info.content}</div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <span id="subTips">{this.state.logText}</span>
                                    <button type="button" className="btn btn-default" onClick={()=>{this.setState({logText:""})}} data-dismiss="modal">关闭</button>
                                    <button type="button" className="btn btn-primary"  onClick={this.onSubmitChild.bind(this)} >添加</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </ul>
        )

    }

}