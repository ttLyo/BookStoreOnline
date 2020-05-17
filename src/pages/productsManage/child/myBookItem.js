import React from 'react'
import tvImg from '../../../images/tv.jpg'
class myBookItem extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isSelect:""
        }
    }
    setSelected=()=>{
        let isSelect = this.state.isSelect===""?"selectLi":""
        this.setState({isSelect})
        this.props.onSelect(this.props.item,isSelect)
    }
    delete(e){
        // this.props.parent.deleteAddPro.call(this,e)
    }
    render(){ 
        let item = this.props.item
        return <li onClick={this.setSelected} className={"productLi right_li "+this.state.isSelect}>
                    <img alt="" src={item.pictureUrl===''?tvImg:item.pictureUrl} className="productImg" /> 
                    <div className="productCont">
                        <div className="contLeft">
                            <h5 className="name">{item.name}</h5>
                            {/* <span 
                            className="add_pro_delete" 
                            data-idx={this.props.index} 
                            onClick={this.delete.bind(this)}>删除</span> */}
                            <p className="author">{item.author}</p>
                        </div>

                        <div className="contRight">
                            <p>￥{item.price}</p>
                            {/* <p>数量:{item.pro_count}</p> */}
                        </div>
                        <div style={{clear:'both'}}>{item.ID}</div>
                    </div>
                </li>
    }
    
}
export default myBookItem;