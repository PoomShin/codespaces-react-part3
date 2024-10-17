import './Shop.css';
import { useEffect, useState,useRef } from 'react';
import axios from 'axios';
function Item(props){
    return (<div key={props.id} onClick={()=>props.callback(props)}>
        <img src={props.img} width={200} height={200}/><br/>
        id: {props.id} <br/>
        name: {props.name}<br/>
        price: {props.price}<br/>
        <button onClick={(e)=>props.del_callback(props.id,e)}>delete</button>
        <button onClick={(e)=>props.upd_callback(props)}>update</button>
    </div>);
}
export default function Shop(){
        let id; 
        const name_ref=useRef(null);
        const price_ref=useRef(null);
        const img_ref=useRef(null);
        const [products,setProducts]=useState([]);
        const URL="https://jubilant-space-eureka-976794v4v57phw95-5000.app.github.dev";
        useEffect(()=>{
            axios.get(URL+'/api/products')
            .then(response=>{
                setProducts(response.data);
            })
            .catch(error=>{
                console.log("error");
            });
        }
        ,[]);
        const [cart,setCart]=useState([]);
        function addCart(item){
         setCart([...cart,{id:item.id,name:item.name,price:item.price,img:item.img}]);
        }

        const productList=products.map(item=><Item {...item} upd_callback={upProductFrom} callback={addCart} del_callback={delProduct}/>);
        const cartList=cart.map((item,index)=><li>{item.id} {item.name} {item.price}
        <button onClick={()=>{
            alert('you click'+index);
            setCart(cart.filter((i,_index)=>index!=_index));
        }}>
        Delete</button>
        </li>);
        let totalprice=0;
        for(let i=0;i<cart.length;i++){
            totalprice+=cart[i].price;
        }
        function addProduct(){
            const data={
             name:name_ref.current.value,
             price:price_ref.current.value,
             img:img_ref.current.value
            }
            axios.post(URL+'/api/addproducts',data)
            .then(response=>{
                setProducts(response.data);
            })
            .catch(error=>{
                console.log("error");
            });
        }

        function delProduct(id,event){
            event.stopPropagation();
            axios.post(URL+'/api/delproducts/'+id)
            .then(response=>{
                if(response.data.status=="ok") alert("Delete product sucessfullyl");
                setProducts(response.data.products);
            })
            .catch(error=>{
                console.log("error");
            });
        }

        function upProductFrom(item){
            id_ref.current.value=item.id;
            name_ref.current.value=item.name;
            price_ref.current.value=item.price;
            img_ref.current.value=item.img;
            const data={
                name:item.name,
                price:item.price,
                img:item.img
            };
            axios.post(URL+'/api/updproducts/'+id,data)
            .then(response=>{
                if(response.data.status=="ok") alert("Updata product sucessfullyl");
                setProducts(response.data.products);
            })
            .catch(error=>{
                console.log("error");
            });
        }
        function upProduct(){

        }

        return (<>
        name : <input type='text' ref={name_ref}/>
        price : <input type='text' ref={price_ref}/>
        img : <input type='text' ref={img_ref}/>
        <button onClick={addProduct}>add</button>
        <button onClick={upProduct}>update</button>
        <div className='grid-container'>{productList}</div>
        <h1>Cart</h1>
        <ol>{cartList}</ol>
        <h2>total {totalprice}</h2>
        <button onClick={()=>setCart([])}>Clear all</button>
        </>);
}