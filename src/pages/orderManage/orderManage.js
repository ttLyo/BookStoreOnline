import React from 'react'
import { Table } from 'antd';
import util from "../../util"
import "./orderManage.css"

const header = [
        {
            title: '订单用户',
            dataIndex: 'userName',
        },
        {
            title: '用户地址',
            dataIndex: 'userAddress',
        },
        {
            title: '电话',
            dataIndex: 'userTel',
        },
        {
            title: '书籍名称',
            dataIndex: 'bookName',
        },
        {
            title: '数量',
            dataIndex: 'bookNumber',
        },
    ]

class productsManage extends React.Component{
    constructor(){
        super();

        this.state = {
            orderList:[],
            orderListFinish:[],
            
            selectList:[]
        }
    }
    componentDidMount(){
        util.axios.post("/queryAllUnfinishedOrder").then(res=>{
            let temp=[]
            for(let i in res.data){
                temp.push(res.data[i].Order)
                temp[temp.length-1].bookName = res.data[i].Book.name
                temp[temp.length-1].key = temp.length-1
            }
            console.log("productsManage -> componentDidMount -> temp", temp)
            this.setState({orderList:temp})
        })
        util.axios.post("/queryAllFinishedOrder").then(res=>{
            let temp=[]
            for(let i in res.data){
                temp.push(res.data[i].Order)
                temp[temp.length-1].bookName = res.data[i].Book.name
                temp[temp.length-1].key = temp.length-1
            }
            console.log("productsManage -> componentDidMount -> temp1", temp)
            this.setState({orderListFinish:temp})
        })
    }
    render(){
        return(
            <div>
                <h4>未下单订单</h4>
                <Table size="small" bordered
                    columns={header}
                    dataSource={this.state.orderList}
                />
                <h4>已下单订单</h4>
                <Table size="small" bordered
                    columns={header}
                    dataSource={this.state.orderListFinish}
                />
            </div>
        )
    }
}

export default productsManage