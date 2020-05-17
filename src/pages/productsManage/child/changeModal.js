import React from 'react'
import { Input, Row, Col, Button, Modal,message, InputNumber, Upload } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import util from "../../../util"
import axios from "axios"
const { confirm } = Modal;
const formStyle={
    span:10,
    offset:1
}
function newBook(){
    return {
        id:"",
        name:"",
        author:"",
        language:1,
        category:1,
        cdrom:1,
        commend:1,
        content:"",
        price:0,
        onSaleTime:"2020-03-01",
        goodPrice:2,
        publishName:"",
        publishAddress:"珞珈山",
        bookNum:0,
        pictureUrl:""
    }
}
class changeModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            visibleAdd:false,
            visibleDelete:false,
            deleteList:[],
            newBook:newBook(),
        }
    }
    addBook=()=>{
        
        let data = new URLSearchParams()
        for(let i in this.state.newBook){
            data.append(i,this.state.newBook[i])
        }
            console.log("changeModal -> addBook -> this.state.newBook", this.state.newBook)
        util.axios.post("/addBook",data).then(res=>{
            // console.log("changeModal -> addBook -> res", res)
            if(res.status===400){
                message.warning(res.data.message)
                return
            }
            this.setState({visibleAdd:false})
            this.props.init()
        })
    }
    handleAddForm=(e)=>{
        // console.log("changeModal -> handleAddForm -> e", e)
        let newBook=this.state.newBook
        newBook[e.target.name] = e.target.value
        this.setState({newBook})
    }
    handleUpload=(e)=>{
        console.log(e)
    }
    deleteBook=()=>{
        let list=[]
        for(let i of this.props.selectList){
            let form=new URLSearchParams()
            form.append("BookID",i.id)
            list.push(util.axios.post("/deleteBook",form))
        }
        axios.all(list).then(res=>{
            for(let i of res){
                if(i.status===400){
                    message.warning(i.data.message)
                }
            }
            message.success("成功")
            this.props.init()
            this.hideModal()
        })
    }
    showAdd=()=>{
        this.setState({
            visibleAdd:true,
            newBook:newBook()
        })
    }
    showChange=()=>{
        if(this.props.selectList.length>0){
            this.setState({newBook:this.props.selectList[0],visibleAdd:true})
        }else{
            message.warning("未选中书籍")
        }
    }
    showDelete=()=>{
        if(this.props.selectList.length===0){
            message.warning("未选中书籍")
            return
        }
        confirm({
            title: '确认删除所选书籍吗？',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk:this.deleteBook,
            onCancel:this.hideModal,
        });
    }
    hideModal=()=>{
        this.setState({
            visibleAdd:false,
            visibleDelete:false,
        })
    }
    render(){
        return (
            <div>
                <Button type="primary" onClick={this.showAdd}>添加新书籍</Button>
                {/* <Button onClick={this.showChange}>修改书籍信息</Button> */}
                <Button type="danger" onClick={this.showDelete}>删除所选书籍</Button>
                
                <Modal
                title="添加新书籍"
                visible={this.state.visibleAdd}
                onOk={this.addBook}
                onCancel={this.hideModal}
                >
                    <Row className="addForm">
                        <Col {...formStyle}>
                            <label>ID:</label>
                            <InputNumber className="inputNumber" value={this.state.newBook.id} 
                            onChange={val=>{this.handleAddForm({target:{name:"id",value:val}})}}/>
                        </Col>
                        <Col {...formStyle}>
                            <label>书名:</label>
                            <Input value={this.state.newBook.name} onChange={this.handleAddForm} name="name" />
                        </Col>
                    </Row>
                    <Row className="addForm">
                        <Col {...formStyle}>
                            <label>作者:</label>
                            <Input value={this.state.newBook.author} onChange={this.handleAddForm} name="author" />
                        </Col>
                        <Col {...formStyle}>
                            <label>图片:</label>
                            <Input value={this.state.newBook.pictureUrl} onChange={this.handleAddForm} name="pictureUrl" />
                        </Col>
                    </Row>
                    <Row className="addForm">
                        <Col {...formStyle}>
                            <label>数量:</label>
                            <InputNumber className="inputNumber" value={this.state.newBook.bookNum} 
                            onChange={val=>{this.handleAddForm({target:{name:"bookNum",value:val}})}}/> 
                        </Col>
                        <Col {...formStyle}>
                            <label>单价:</label>
                            <InputNumber className="inputNumber" value={this.state.newBook.price} 
                            onChange={val=>{this.handleAddForm({target:{name:"price",value:val}})}} />
                        </Col>
                    </Row>
                    <Row className="addForm_long">
                        <Col offset={1} span={22}>
                            <label>出版商:</label>
                            <Input value={this.state.newBook.publish_Name} onChange={this.handleAddForm} name="publishName" />
                        </Col>
                    </Row>
                    <Row className="addForm_long">
                        <Col offset={1} span={22}>
                            <label>概要:</label>
                            <Input value={this.state.newBook.content} onChange={this.handleAddForm} name="content" />
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}
export default changeModal