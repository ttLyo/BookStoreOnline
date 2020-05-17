import React from 'react'
import { Checkbox, message, Modal, Input } from 'antd';
import { connect } from 'react-redux'
import util from "../../../util"
import axios from "axios"
import '../../common/Product.css'
import tvImg from '../../../images/tv.jpg'
const { confirm } = Modal;
class productLists extends React.Component{
    constructor(){
        super();
        this.state = {
            My_pro_arr:[],
            My_pro_arr1:[],
            selected:[],
            countPrice:0,
            UserAddress:"",
            UserTel:"",
            visible:false,
        }
    }
    //生命周期:挂载成功后给state赋值
    componentDidMount(){
        // let Add_pro_arr = this.props.Add_pro_arr ? this.props.Add_pro_arr : ''
        util.axios.post("/queryUnfinishedOrder").then(res=>{
            console.log("productLists -> componentDidMount -> res", res)
            if(res.status===400){
                message.warning(res.data.message)
                return
            }
            if(res.data){
                let temp=[]
                let s = []
                for(let i in res.data){
                    temp.push(res.data[i])
                    s.push('')
                }
                this.setState({My_pro_arr:temp,selected:s})
            }
            
        })
        util.axios.post("/queryFinishedOrder").then(res=>{
            console.log("productLists -> componentDidMount -> res1", res)
            if(res.status===400){
                // message.warning(res.data.message)
                return
            }
            let temp=[]
            for(let i in res.data){
                temp.push(res.data[i])
            }
            this.setState({My_pro_arr1:temp})
        })
    }
    selectBook(e){
        // e.persist()
        // console.log(e)
        let index
        let selected = this.state.selected
        let countPrice = this.state.countPrice
        let My_pro_arr = this.state.My_pro_arr
        for(let i of e.nativeEvent.path){
            if(i.dataset&&i.dataset.index){
                index=i.dataset.index
                console.log(i.dataset)
                break
            }
        }
        let itemPrice = My_pro_arr[index].Order.bookNumber*My_pro_arr[index].Book.price
        selected[index] = selected[index]===''?"selectLi":''
        countPrice+=(selected[index]==='selectLi'?itemPrice:-itemPrice)
        // console.log(index)
        this.setState({selected:selected,countPrice:countPrice})
    }
    selectAll(e){
        if(!e.target.checked){
            this.setState({selected:[],countPrice:0})
            return
        }
        let selected=[]
        let countPrice = 0
        let My_pro_arr = this.state.My_pro_arr
        for(let i in this.state.My_pro_arr){
            selected.push("selectLi")
            countPrice+=My_pro_arr[i].Order.bookNumber*My_pro_arr[i].Book.price
        }
        console.log(selected)
        this.setState({selected,countPrice})
    }
    //删除产品函数
    deleteAddPro(e){
        console.log(e)
        e.stopPropagation()
        let idx = e.target.getAttribute('data-idx');
        let temp = this.state.My_pro_arr.slice()
        temp.splice(idx,1);
        //疑问,因为setState属于异步操作,所以DOM更新的时候My_pro_arr还未更新,导致jugleContent的判断失误
        let form = new URLSearchParams()
        form.append("OrderID",this.state.My_pro_arr[idx].id)
        util.axios.post("/deleteOrder",form).then(res=>{
            console.log("productLists -> deleteAddPro -> res", res)
            if(res.status===400){
                this.componentDidMount()
                return
            }
            message.success("成功")
        })
        this.setState({
            My_pro_arr:temp
        },function(){
            console.log('setState更新成功')
            this.jugleContent()
        })
    }
    handleSubmitInput=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }
    showSubmit=()=>{
        this.setState({visible:true})
    }
    OrderSubmit=()=>{
        let list=[]
        for(let i in this.state.selected){
            if(this.state.selected[i]==="")continue;
            let form=new URLSearchParams()
            form.append("OrderID",this.state.My_pro_arr[i].Order.id)
            form.append("UserAddress",this.state.UserAddress)
            form.append("UserTel",this.state.UserTel)
            list.push(util.axios.post("/createOrder",form))
            
        }
        axios.all(list).then(res=>{
            console.log("productLists -> OrderSubmit -> res", res)
            for(let i of res){
                if(i.status===400){
                    message.warning(i.data.message)
                }
            }
            message.success("成功")
            this.setState({visible:false})
            this.componentDidMount()
        })
        
    }

    jugleContent(){
        // console.log('更新DOM')
        //如果内容不为空,则循环数据
        
        if( this.state.My_pro_arr ){
            return(
                <div>
                    <Modal
                    title="订单"
                    visible={this.state.visible}
                    onOk={this.OrderSubmit}
                    onCancel={()=>{this.setState({visible:false})}}
                    >
                        <div style={{padding:"10px 10%"}}>
                            <Input placeholder="地址" style={{marginBottom:"10px"}}
                            value={this.state.UserAddress} 
                            onChange={this.handleSubmitInput} 
                            name="UserAddress" />
                            <br/>
                            <Input placeholder="电话"
                            value={this.state.UserTel} 
                            onChange={this.handleSubmitInput} 
                            name="UserTel" />
                        </div>
                    </Modal>
                    <p className="cart_title">
                        <button className="btn " 
                        type="button" data-toggle="collapse" 
                        data-target="#shopping_cart" 
                        aria-expanded="true" 
                        aria-controls="shopping_cart">
                        购物车
                        </button>
                    </p>
                    <div className="collapse show" id="shopping_cart">
                        <p>
                            <span className="countPrice">结算金额：{this.state.countPrice}</span>
                            <Checkbox onChange={this.selectAll.bind(this)}>全选</Checkbox>
                            <button className="btn btn-light" onClick={this.showSubmit}>结算</button>
                            {/* <button className="btn btn-danger" >删除</button> */}
                        </p>
                        <ul>
                            {/*循环接收到的数据:this.props*/}
                            {
                                this.state.My_pro_arr.map((item,i) => 
                                    <li onClick={this.selectBook.bind(this)} 
                                    key={i} data-index = {i}
                                    className={"productLi right_li "+this.state.selected[i]}>
                                        <img alt="" src={item.Book.pictureUrl===''?tvImg:item.Book.pictureUrl} className="productImg" /> 
                                        <div className="productCont">
                                            <div className="contLeft">
                                                <p className="pro_name">{item.Book.name}</p>
                                                <span className="add_pro_delete" data-idx={i} onClick={this.deleteAddPro.bind(this)}>删除</span>
                                            </div>

                                            <div className="contRight">
                                                <p>￥{item.Book.price}</p>
                                                <p>数量:{item.Order.bookNumber}</p>
                                                {/* <button className="btn btn-info">￥{item.pro_price}</button>                    
                                                <button className="btn btn-info">数量:{item.pro_count}</button> */}
                                            </div>
                                            <div style={{clear:'both'}}></div>
                                        </div>
                                    </li>
                                    // < Book key={i} item={item} id={i} parent={this} />
                                    )
                            }
                        </ul>   
                    </div>
                    <p className="bought_title">
                        <button className="btn" 
                        type="button" data-toggle="collapse" 
                        data-target="#have_bought" 
                        aria-expanded="true" 
                        aria-controls="have_bought">
                        订单
                        </button>
                    </p>
                    <div className="collapse show" id="have_bought">
                        <ul>
                            {/*循环接收到的数据:this.props*/}
                            {
                                this.state.My_pro_arr1.map((item,i) => 
                                    <li key={i} data-index = {i}
                                    className={"productLi right_li"}>
                                        <img alt="" src={item.Book.pictureUrl===''?tvImg:item.Book.pictureUrl} className="productImg" /> 
                                        <div className="productCont">
                                            <div className="contLeft">
                                                <p className="pro_name">{item.Book.name}</p>
                                                {/* <span className="add_pro_delete" data-idx={i} onClick={this.deleteAddPro.bind(this)}>删除</span> */}
                                            </div>

                                            <div className="contRight">
                                                <p>￥{item.Book.price}</p>
                                                <p>数量:{item.Order.bookNumber}</p>
                                                {/* <button className="btn btn-info">￥{item.pro_price}</button>                    
                                                <button className="btn btn-info">数量:{item.pro_count}</button> */}
                                            </div>
                                            <div style={{clear:'both'}}></div>
                                        </div>
                                    </li>
                                    // < Book key={i} item={item} id={i} parent={this} />
                                    )
                            }
                        </ul>  
                    </div>   
                </div> 
            )
        }
        else{
            return <div className="no_pro_arr">(T＿T) 暂无订单</div>
        }
    }


    render(){
        // console.log(this.jugleContent())
        return(
           this.jugleContent()
        )
    }
}

//connect参数之一,获取参数 , state为接受的参数
const mapStateToProps = (state) => {
    console.log(state);
    return {
        Add_pro_arr:state.pro_Info
    }
}

productLists = connect(mapStateToProps)(productLists)

export default productLists;