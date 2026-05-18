import { useFormState } from "react-dom"
import { createContext } from "react-router-dom"

const CartContext = createContext();

export const cartProvider = ({children})=>{

    const [cartItems,setCartItems] = useFormState([]);

    useeffect(()=>{
        const fetch = async()=>{

        const token = localStorage.getItem("token");
        if(!token) return;
        try {
            const response = await axios.get("",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            setCartItems(response.data.data || []);
        } catch (error) {
            console.log(error.response?.data);
        }
        }
        fetch();
    },[])

    const addCart = async({product})=>{
        const token = localStorage.getItem("token");
        if(!token) return;
        try {
            const response = await axios.post("",{
                product_id: product.id,
                quantity: 1
            },{
                headers:{
                    Authorization:`Bearer : ${token}`
                }
            })
            if(response === 200 || response === 201){
               const res = await axios.get("",{
                headers:{
                    Authorization:`Bearer: ${token}`
                }
               })
               setCartItems(res.data.data || []);
            }
        } catch (error) {
            console.log(error.response?.data);
        }
    }

    const updateCart = async({type,id})=>{
        const token = localStorage.getItem("token");
        if(!token) return;

        const currentItem = cartItems.find((item)=>item.id === id);
        if(!currentItem) return;

        const newQty = type= "inc" ? currentItem.quantity + 1 : currentItem.quantity - 1
        if(newQty < 1) return;
        try {
            const response = await axios.post("",{
                product_id: currentItem.product_id,
                quantity: newQty
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(response === 200){
                setCartItems((prev)=>prev.map(item=>item.id === id ? {...item,quantity:newQty} : item))
            }
        } catch (error) {
            console.log()
        }
    }

    const removeCart = async({id})=>{
        const token = localStorage.getItem("token");
        if(!token) return;
        try {
            const res = await axios.delete("",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(response === 200){
                setCartItems((prev)=>prev.filter(item=>item.id !== id))
            }
        } catch (error) {
            
        }
    }


    return(
       <CartContext.Provider value={{cartItems,addCart,updateCart,removeCart}}>{children}</CartContext.Provider>
    )
}
