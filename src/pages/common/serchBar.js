import React from 'react'
import { Input, Select,  } from 'antd';
import util from "../../util"
const { Option } = Select;
const { Search } = Input;



class searchBar extends React.Component{
    constructor(){
        super();

        this.state = {
            type:"Name"
        }
    }
    changeType=(e)=>{
        this.setState({
            type:e
        })
    }
    getList = value=>{
    console.log("searchBar -> value", value)
        if(value.length===0){
            this.props.init()
        }
        const url = "/queryBookBy"+this.state.type
        let data = new URLSearchParams()
        data.append([this.state.type],value)
        util.axios({
            url:url,
            method:"post",
            data
        }).then(res=>{
            console.log(res)
            
            if(this.state.type==="ID"){
                if(res.data)this.props.onUpdate([res.data])
                else this.props.onUpdate([])
            }else{
                this.props.onUpdate(res.data.BookList)
            }
            
        })
    }
    render(){
        const selectBefore = (
            <Select defaultValue="Name" className="select-after" onChange={this.changeType}>
              <Option value="Name">按书名</Option>
              <Option value="Author">按作者</Option>
              <Option value="ID">按ID</Option>
            </Select>
          );
        return(
            <div style={{ marginBottom: 5 }}>
                <Search 
                addonBefore={selectBefore}  
                placeholder="检索书籍" 
                enterButton="Search"
                // size="large"
                onSearch={this.getList}
                />
            </div>
        )
    }
}

export default searchBar