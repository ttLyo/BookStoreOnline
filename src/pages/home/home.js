import React from 'react'

import AllProduct from './child/allProduct'
import SerchBar from '../common/serchBar';
import util from "../../util"
class Home extends React.Component{
    constructor(){
        super();
        this.state = {
            Products:[]
        }
    }
    
    componentDidMount(){
        util.axios.post("/getBookRandom").then(res=>{
        console.log("ProductLists -> componentDidMount -> res", res)
            this.setState({Products:res.data.BookList})
        })
    }
    updateList=(bookList)=>{
        this.setState({
            Products:bookList
        })
    }
    render(){
        return(
            <div className="home">
                <SerchBar onUpdate={this.updateList} init={this.componentDidMount.bind(this)} />
                <AllProduct products={this.state.Products}  />
            </div>
        )
    }
}

export default Home