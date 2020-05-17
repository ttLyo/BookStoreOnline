import React from 'react'
// import { Input, Select ,Button, Modal } from 'antd';
import util from "../../util"
import MyBookItem from './child/myBookItem';
import ChangeModal from './child/changeModal';
import SerchBar from '../common/serchBar';
import "./productsManage.css"



class productsManage extends React.Component{
    constructor(){
        super();

        this.state = {
            bookList:[
                {
                    ID:"1",
                    Name:"规模化",
                    Author:"someone",
                    Language:"中文",
                    Category:"科学",
                    Cdrom:"",
                    Commend:"",
                    Content:"介绍了六年的撒看见怒放",
                    Price:30,
                    On_Sale_Time:"",
                    Good_Price:"",
                    Publish_Name:"",
                    Publish_address:"",
                    Book_Num:"",
                },],
            selectList:[]
        }
    }
    componentDidMount(){
        util.axios.post("/queryAllBook").then(res=>{
        // console.log("ProductLists -> componentDidMount -> res", res)
            this.setState({bookList:res.data.BookList})
        })
    }
    updateList=(bookList)=>{
        this.setState({bookList})
    }
    handleSelect=(book,val)=>{
        let selectList = this.state.selectList
        if(val===""){
            for(let i in selectList){
                if(selectList[i].ID===book.ID){
                    selectList.splice(i,1)
                    break
                }
            }
        }else{
            selectList.push(book)
        }
        this.setState({selectList})
    }
    render(){
        return(
            <div>
                <SerchBar onUpdate={this.updateList} init={this.componentDidMount.bind(this)} />
                <div className="btn_group">
                    <ChangeModal selectList={this.state.selectList} init={this.componentDidMount.bind(this)} />
                </div>
                <div id="box">
                    {this.state.bookList.map((item,index)=>{
                       return <MyBookItem key={index} item={item} index={index} onSelect={this.handleSelect} />
                    })}
                </div>
            </div>
        )
    }
}

export default productsManage